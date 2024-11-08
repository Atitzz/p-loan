import { AppDataSource, orm } from "../../../data-source";
import { Loan } from "../entities/loan";
import { LoanPlan } from "../entities/loan_plan";
import { writeFile, reSizeBase64 } from "../../../Utils/index";
import { Installment } from "../entities/loan_installment";
import { loan_status, is_featured } from "../../Utils/enum";
import { Transaction } from "../../Transaction/entities/transaction";
import { v4 as uuidv4 } from "uuid";
import { Users } from "../../Users/entities";
import { File_Manager } from "../../FileManager/entities/File_Manager";
import { Folder_Manager } from "../../FileManager/entities/Folder_Manager";
import { sendNotificationEmail, takeloan_notificate } from "../../Notification/controller";
import { Application_Form } from "../entities/loan_applicationform";
import { LoanCategory } from "../entities/loan_category";
import { In, Like, Not, IsNull } from "typeorm";
import * as dotenv from "dotenv";
import e = require("cors");
import { LoanContract } from "../entities/loan_contract";
import { Users_KYC } from "../../KYC/entities";
import { Line_SendSlip } from "../../Line_Message/module";
import { Tax } from "../entities/tax";
import { generateReference, validateMimetype, generateLoanNumber } from "../../../Utils/index";
import { effevtiverateInstallment, flatrateInstallment, getDaysInYear, installmentRemaining, paymentCalculator,  } from "./calurate";
import { removeLoan } from "./admin_loan";
import { UsersAccessToken } from "../../Users_AccessToken/entities";
import { LoanGuarantee } from "../entities/loan_guarantee";
import { Users_SMS } from "../../UserSMS/entities";
import { io } from "../../..";

// import { LoanContract } from "../entities/loan_contract";
dotenv.config();

export const category_plan = async (req, res) => {
  try {
    const categories = await orm(LoanCategory).find({});

    const categoryIds = categories.map((category) => category.id);

    const plans = await orm(LoanPlan).find({
      where: { category_id: In(categoryIds) },
    });

    const categoryPlans = categories.map((category) => {
      const { created_at, updated_at, deleted_at, ...restCategory } = category;
      const filteredPlans = plans
        .filter((plan) => plan.category_id === category.id)
        .map((plan) => {
          const { created_at, updated_at, deleted_at, ...restPlan } = plan;
          return restPlan;
        });
      return {
        ...restCategory,
        plans: filteredPlans,
      };
    });

    return res.success("Get categories and plans", categoryPlans);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const takeLoan = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const _planId = parseInt(obj.plan_id) || -1;

  try {
    const user = await orm(Users).findOne({ where: { id: req.user.id } });
    if (user && user.kyc !== "verified") return res.error("กรุณายืนยันตัวตน");
    if (!user) return res.error("ไม่พบผู้ใช้");

    const loanPlan = await orm(LoanPlan).findOne({ where: { id: _planId } });
    if (!loanPlan) return res.error("ไม่พบแผนสินเชื่อ");

    if (
      Number(obj.amount) < loanPlan.minimum_amount ||
      Number(obj.amount) > loanPlan.maximum_amount
    )
      return res.error(
        `ยอดกู้ต้องอยู่ระหว่าง ${Number(loanPlan.minimum_amount)} - ${Number(
          loanPlan.maximum_amount
        )}`
      );

    const selectedInstallment = parseInt(obj.installment);
    const selectedRate = loanPlan.rate.find(
      (r) => Number(r.installment) === selectedInstallment
    );
    if (!selectedRate) return res.error("โปรดเลือกจำนวนงวดตามที่กำหนด");
    const interestRate =
      Number(selectedRate.interest_rate) +
      Number(loanPlan.application_percent_charge);

    const applicationForms = await orm(Application_Form).find({
      where: { plan_id: _planId },
      order: { index: "ASC" },
    });

    for (let field of applicationForms) {
      const fieldValue = obj.appForm[field.field_name];
      if (field.is_required.toLowerCase() === "required" && !fieldValue) {
        return res.error(`กรุณาระบุ ${field.label}`);
      }
    }

    let totalAmount = Number(obj.amount);
    const loanParts = [];

    while (totalAmount > 0) {
      if (totalAmount > 50000) {
        loanParts.push(50000);
        totalAmount -= Number(50000);
      } else {
        loanParts.push(totalAmount);
        totalAmount = 0;
      }
    }

    const createLoan = async (amount, reference, loan_ducument, loan_ducument_max) => {

      let interestRateToUse = interestRate;

      // กำหนดดอกเบี้ย 28% สำหรับสินเชื่อที่ 2
      if (interestRate > 32) {
        // ถ้าเกิน 30% ให้กำหนดอัตราดอกเบี้ยสำหรับสินเชื่อที่ 2 เป็น 28%
        if (loan_ducument === 2) {
          interestRateToUse = 28;
        }
      }

      let __createDate = new Date();
      let __startDate = new Date(__createDate);
      __startDate.setDate(5);
      __startDate.setMonth(__startDate.getMonth() + 1);
      let __endDate = new Date(__startDate);
      __endDate.setMonth(
        __endDate.getMonth() + Number(selectedRate.installment - 1)
      );

      let addInterrest = 0;
      if (loanPlan.type_interest == "flatrate")
        addInterrest =
          (Number(amount) * (Number(interestRate) / 100) * (selectedInstallment / 12))
      const { nor_pay, principle_remaining } = paymentCalculator(
        {
          type_interest: loanPlan.type_interest,
          amount: amount,
          remaining: Number(amount) + addInterrest,
          interest_rate: interestRateToUse,
          total_installment: selectedRate.installment,
          installment_start: __createDate,
          payment_date: __startDate.toISOString().split('T')[0],
        }
      );

      const {
        total_interest,
        total_receive,
        installment: valueInstallment,
      } = await installmentRemaining({
        type_interest: loanPlan.type_interest,
        amount: amount,
        rate: interestRateToUse,
        installment: selectedRate.installment,
        start: __startDate.toISOString().split('T')[0],
        created: __createDate.toISOString().split("T")[0],
        given_at: 0,
      });

      let totalAmount = Number(amount);

      const loan = new Loan();
      loan.loan_number = await generateLoanNumber(_planId)
      loan.startDate = __startDate;
      loan.endDate = __endDate;
      loan.user_id = req.user.id;
      loan.plan_id = _planId;
      loan.amount = totalAmount;
      loan.per_installment = nor_pay;
      loan.total_installment = selectedInstallment;
      loan.delay_value = loanPlan.delay_value;
      loan.delay_charge = loanPlan.fixed_charge;
      loan.overdue_balance = 0;
      loan.receivable =
        loanPlan.type_interest == "flatrate"
          ? Number(amount) *
          ((Number(interestRateToUse) / 100 / 12) * selectedRate.installment +
            1)
          : total_receive;
      loan.remaining = principle_remaining;
      loan.principle = totalAmount;
      loan.interest =
        loanPlan.type_interest == "flatrate"
          ? Number(amount) *
          ((Number(interestRateToUse) / 100 / 12) * selectedRate.installment)
          : total_interest;
      loan.approved_at = __createDate;

      // if (Date.now() >= __startDate.getTime()) loan.status = loan_status.Due;
      // else loan.status = loan_status.Pending;
      loan.status = loan_status.Pending;
      
      loan.installment_start = __createDate;
      loan.installment_due = __startDate;

      loan.reference = reference;

      loan.last_alert_date = __startDate;

      loan.loan_ducument = loan_ducument;
      loan.loan_ducument_max = loan_ducument_max;

      loan.guarantee = obj.guarantee;
      loan.loan_interest = interestRateToUse;

      await orm(Loan).save(loan);

      const formData = {};
      const fileUploads = [];

      for (let field of applicationForms) {
        const fieldValue = obj.appForm[field.field_name];

        switch (field.type.toLowerCase()) {
          case "file":
            if (fieldValue) {
              const allowedExtensions = field.extensions;
              if (!validateMimetype(fieldValue, allowedExtensions)) {
                return res.error(`ประเภทไฟล์ไม่ถูกต้องสำหรับ ${field.label}. ประเภทไฟล์ที่อนุญาต: ${allowedExtensions.join(', ')}`);
              }

              const processedImage = await reSizeBase64(fieldValue);

              const fileManager = new File_Manager();
              fileManager.ref_id = loan.id;
              fileManager.folder_id = `loan_${loan.id}`;
              fileManager.name = `${field.field_name}`;
              fileManager.base64 = processedImage;

              fileUploads.push(fileManager);

              formData[field.field_name] = { ref_id: fileManager.ref_id, name: fileManager.name };
            }
            break;
          case "select":
            if (
              Array.isArray(field.options) &&
              field.options.includes(fieldValue)
            ) {
              formData[field.field_name] = fieldValue;
            } else {
              return res.error(`ตัวเลือกไม่ถูกต้องสำหรับ ${field.field_name}`);
            }
            break;
          default:
            formData[field.field_name] = fieldValue;
        }
      }

      loan.application_form = JSON.stringify(formData);

      await loan.createLog(req, "create", "loan", obj);
      await orm(Loan).save(loan);

      for (let file of fileUploads) {
        await orm(File_Manager).save(file);
      }

      const data = new LoanContract();
      data.user_id = req.user.id;
      data.loan_id = loan.id;
      data.installment_start = loan.startDate;
      data.installment_end = loan.endDate;
      data.stamp =
        loanPlan.stamp == 0 ? 0 : Number(loan.amount) / Number(loanPlan.stamp);
      data.document = Number(loanPlan.document);

      await orm(LoanContract).save(data);
    };

    const reference = generateReference(new Date(), req.user.id);

    const loan_document_max = loanParts.length;

    for (let i = 0; i < loanParts.length; i++) {
      await createLoan(loanParts[i], reference, i + 1, loan_document_max);
    }

    // if (user.email) {
    //   try {
    //     const subject = "การขอสินเชื่อสำเร็จ";
    //     const htmlContent = takeloan_notificate(user, obj, loanPlan, interestRate);
    //     sendNotificationEmail(user.email, subject, htmlContent, obj.user_id);
    //   } catch (error) {
    //     return res.error("การขอสินเชื่อสำเร็จ แต่การส่งอีเมลแจ้งล้มเหลว");
    //   }
    // }

    io.emit('loans', { action: 1 })
    return res.success("บันทึกการขอสินเชื่อสำเร็จ");
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// export const takeLoan = async (req, res) => {
//   const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
//   const _planId = parseInt(obj.plan_id) || -1;

//   try {
//     const user = await orm(Users).findOne({ where: { id: req.user.id } });
//     if (user && user.kyc !== "verified") return res.error("กรุณายืนยันตัวตน");
//     if (!user) return res.error("ไม่พบผู้ใช้");

//     const loanPlan = await orm(LoanPlan).findOne({ where: { id: _planId } });
//     if (!loanPlan) return res.error("ไม่พบแผนสินเชื่อ");

//     if (
//       Number(obj.amount) < loanPlan.minimum_amount ||
//       Number(obj.amount) > loanPlan.maximum_amount
//     )
//       return res.error(
//         `ยอดกู้ต้องอยู่ระหว่าง ${Number(loanPlan.minimum_amount)} - ${Number(
//           loanPlan.maximum_amount
//         )}`
//       );

//     const selectedInstallment = parseInt(obj.installment);
//     const selectedRate = loanPlan.rate.find(
//       (r) => Number(r.installment) === selectedInstallment
//     );
//     if (!selectedRate) return res.error("โปรดเลือกจำนวนงวดตามที่กำหนด");
//     const interestRate =
//       Number(selectedRate.interest_rate) +
//       Number(loanPlan.application_percent_charge);

//     const applicationForms = await orm(Application_Form).find({
//       where: { plan_id: _planId },
//       order: { index: "ASC" },
//     });

//     for (let field of applicationForms) {
//       const fieldValue = obj.appForm[field.field_name];
//       if (field.is_required.toLowerCase() === "required" && !fieldValue) {
//         return res.error(`กรุณาระบุ ${field.label}`);
//       }
//     }

//     let totalAmount = Number(obj.amount);

//     // กำหนดวันเริ่มและวันชำระ
//     let __createDate = new Date();
//     let __startDate = new Date(__createDate);
//     __startDate.setDate(5);
//     __startDate.setMonth(__startDate.getMonth() + 1);
//     let __endDate = new Date(__startDate);
//     __endDate.setMonth(
//       __endDate.getMonth() + Number(selectedRate.installment - 1)
//     );

//     let addInterrest = 0;
//     if (loanPlan.type_interest == "flatrate") {
//       addInterrest =
//         (Number(totalAmount) * (Number(interestRate) / 100) * (selectedInstallment / 12));
//     }

//     const { nor_pay, principle_remaining } = paymentCalculator({
//       type_interest: loanPlan.type_interest,
//       amount: totalAmount,
//       remaining: Number(totalAmount) + addInterrest,
//       interest_rate: interestRate,
//       total_installment: selectedRate.installment,
//       installment_start: __createDate,
//       payment_date: __startDate.toISOString().split('T')[0],
//     });

//     const {
//       total_interest,
//       total_receive,
//     } = remainingCalcurate({
//       type_interest: loanPlan.type_interest,
//       amount: totalAmount,
//       rate: interestRate,
//       installment: selectedRate.installment,
//       start: __startDate,
//       created: __createDate,
//       given_at: 0,
//     });

//     // สร้างสินเชื่อ
//     const loan = new Loan();
//     loan.loan_number = await generateLoanNumber(_planId);
//     loan.startDate = __startDate;
//     loan.endDate = __endDate;
//     loan.user_id = req.user.id;
//     loan.plan_id = _planId;
//     loan.amount = totalAmount;
//     loan.per_installment = nor_pay;
//     loan.total_installment = selectedInstallment;
//     loan.delay_value = loanPlan.delay_value;
//     loan.delay_charge = loanPlan.fixed_charge;
//     loan.overdue_balance = 0;
//     loan.receivable =
//       loanPlan.type_interest == "flatrate"
//         ? Number(totalAmount) *
//         ((Number(interestRate) / 100 / 12) * selectedRate.installment + 1)
//         : total_receive;
//     loan.remaining = principle_remaining;
//     loan.principle = totalAmount;
//     loan.interest =
//       loanPlan.type_interest == "flatrate"
//         ? Number(totalAmount) *
//         ((Number(interestRate) / 100 / 12) * selectedRate.installment)
//         : total_interest;
//     loan.status = loan_status.Pending;

//     loan.installment_start = __createDate;
//     loan.installment_due = __startDate;
//     loan.reference = generateReference(new Date(), req.user.id);
//     loan.guarantee = obj.guarantee;
//     loan.loan_interest = interestRate;

//     await orm(Loan).save(loan);

//     // บันทึกข้อมูลแบบฟอร์มและไฟล์
//     const formData = {};
//     const fileUploads = [];

//     for (let field of applicationForms) {
//       const fieldValue = obj.appForm[field.field_name];

//       switch (field.type.toLowerCase()) {
//         case "file":
//           if (fieldValue) {
//             const allowedExtensions = field.extensions;
//             if (!validateMimetype(fieldValue, allowedExtensions)) {
//               return res.error(`ประเภทไฟล์ไม่ถูกต้องสำหรับ ${field.label}. ประเภทไฟล์ที่อนุญาต: ${allowedExtensions.join(', ')}`);
//             }

//             const processedImage = await reSizeBase64(fieldValue);

//             const fileManager = new File_Manager();
//             fileManager.ref_id = loan.id;
//             fileManager.folder_id = `loan_${loan.id}`;
//             fileManager.name = `${field.field_name}`;
//             fileManager.base64 = processedImage;

//             fileUploads.push(fileManager);

//             formData[field.field_name] = { ref_id: fileManager.ref_id, name: fileManager.name };
//           }
//           break;
//         case "select":
//           if (
//             Array.isArray(field.options) &&
//             field.options.includes(fieldValue)
//           ) {
//             formData[field.field_name] = fieldValue;
//           } else {
//             return res.error(`ตัวเลือกไม่ถูกต้องสำหรับ ${field.field_name}`);
//           }
//           break;
//         default:
//           formData[field.field_name] = fieldValue;
//       }
//     }

//     loan.application_form = JSON.stringify(formData);
//     await loan.createLog(req, "create", "loan", obj);
//     await orm(Loan).save(loan);

//     for (let file of fileUploads) {
//       await orm(File_Manager).save(file);
//     }

//     const data = new LoanContract();
//     data.user_id = req.user.id;
//     data.loan_id = loan.id;
//     data.installment_start = loan.startDate;
//     data.installment_end = loan.endDate;
//     data.stamp =
//       loanPlan.stamp == 0 ? 0 : Number(loan.amount) / Number(loanPlan.stamp);
//     data.document = Number(loanPlan.document);

//     await orm(LoanContract).save(data);

//     // ส่งการแจ้งเตือน
//     io.emit('loans', { action: 1 });
//     return res.success("take loan successfully");
//   } catch (err) {
//     console.log(err);
//     return res.error(err.detail || err.routine);
//   }
// };



export const get_applicationForm = async (req, res) => {
  const { plan_id } = req.params;
  const _planId = parseInt(plan_id) || -1;

  try {
    const plan = await orm(LoanPlan).findOne({ where: { id: _planId } });

    const form = await orm(Application_Form).find({
      where: { plan_id: plan.plan_id },
      order: { index: "ASC" },
    });
    const cutfield = form.map((data) => {
      const { created_at, updated_at, deleted_at, ...res } = data;
      return res;
    });

    return res.success("Detail Loan", { applicationForm: cutfield });
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const my_loan = async (req, res) => {
  const { search } = req.query;
  const { status } = req.params;
  const userId = req.user.id;

  let whereClause = " WHERE l.user_id = ? ";
  const parameters = [userId];

  if (status && status.toLowerCase() === "due") {
    whereClause += " AND LOWER(l.status) = LOWER(?)";
    parameters.push("due");
  } else if (status && status.toLowerCase() === "running") {
    whereClause += `
            AND (
                LOWER(l.status) = 'running' OR LOWER(l.status) = 'due'
            )
        `;
  } else if (status && status.toLowerCase() === "all") {
    whereClause += `
            AND (
                LOWER(l.status) = 'running' OR LOWER(l.status) = 'due'
            )
        `;
  }

  if (search) {
    whereClause +=
      " AND (LOWER(l.loan_number) LIKE LOWER(?) OR LOWER(lp.name) LIKE LOWER(?))";
    parameters.push(`%${search}%`, `%${search}%`);
  }

  const loanQuery = `
        SELECT 
        l.*,
        l.id AS loan_id,
        lp.name as planname, 
        lp.rate AS plan_rate,
        lp.application_percent_charge,
        lp.delay_value,
        lp.fixed_charge,
        lp.type_interest,
        l.installment_due as next_installment
        FROM loan l
        LEFT JOIN loan_plan lp ON lp.id = l.plan_id
        ${whereClause} 
        `;
  try {
    const loanResults = await AppDataSource.query(loanQuery, parameters);
    if (loanResults.length === 0) return res.error("Loan not found");

    const loanResult = loanResults.map(loan => {
      const rateArray = loan.plan_rate;

      const totalInstallment = Number(loan.total_installment);

      const matchedRate = rateArray.find(rateItem => Number(rateItem.installment) === totalInstallment);

      if (matchedRate) {
        loan.interest_rate = Number(matchedRate.interest_rate) + Number(loan.application_percent_charge);
      }

      const loan_summary = {
        amount: Number(loan.amount),
        per_installment: Number(loan.per_installment),
        total_installment: Number(loan.total_installment),
        given_installment: Number(loan.given_installment + 1),
        receivable: Number(loan.receivable),
        total_paid: Number(loan.total_paid),
        remaining: Number(loan.remaining),
        installment_start: loan.installment_start,
        installment_due: loan.installment_due,
        interestRate: Number(loan.interest_rate),
        overdue_balance: Number(loan.overdue_balance),
        pay_days: 30,
        delay_value: Number(loan.delay_value),
        delay_charge: Number(loan.fixed_charge),
      }

      const { application_form, plan_rate, application_percent_charge, ...filteredLoan } = loan;

      return { ...filteredLoan, ...loan_summary };
    });


    // const loansWithPaymentLink = loanResult.map(loan => {
    //     loan.payment_link = `loan/pay/${loan.loan_id}/${loan.next_installment_id}`;
    //     return loan;
    // });

    return res.success("Get Loan Detail", loanResult);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const myloanContract = async (req, res) => {
  const { loan_id } = req.params;
  const _loanId = parseInt(loan_id) || -1;
  try {
    const user = await orm(Users).findOne({ where: { id: req.user.id } });
    const loan = await orm(Loan).findOne({
      where: { user_id: req.user.id, id: _loanId },
    });
    const loanContract = await orm(LoanContract).findOne({
      where: { user_id: req.user.id, loan_id: _loanId },
    });

    if (!loan) return res.error("ยังไม่มีสินเชื่อที่อนุมัติ");
    if (!loanContract) return res.error("ไม่พบสัญญากู้");

    const detail = {
      titlename: user.titlename,
      firstname: user.firstname,
      lastname: user.lastname,
      citizen_id: user.citizen_id,
      address: user.address,
      houseno: user.houseno,
      villageno: user.villageno,
      lane: user.lane,
      subdistrict: user.subdistrict,
      district: user.district,
      province: user.province,
      country: user.country,
      zipcode: user.zipcode,
      job_company_name: user.job_company_name,
      job_houseno: user.job_houseno,
      job_villageno: user.job_villageno,
      job_lane: user.job_lane,
      job_subdistrict: user.job_subdistrict,
      job_district: user.job_district,
      job_province: user.job_province,
      job_zipcode: user.job_zipcode,
      job_country: user.job_country,
      loan_number: loan.loan_number,
      amount: loan.amount,
      per_installment: loan.per_installment,
      total_installment: loan.total_installment,
      start: loanContract.installment_start,
      end: loanContract.installment_end,
      admin_approve: loan.admin_approve,
    };

    return res.success("My loan id", detail);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// export const due_installment = async (req, res) => {
//   const { loan_id } = req.params;
//   const _loanId = parseInt(loan_id) || -1;
//   const userId = req.user.id;

//   try {
//     const loan = await orm(Loan).findOne({
//       where: { id: _loanId, user_id: userId },
//     });
//     if (!loan) return res.error("Loan not found");

//     const loanPlan = await orm(LoanPlan).findOne({
//       where: { id: loan.plan_id },
//     });
//     if (!loanPlan) return res.error("Loan Plan not found");

//     // const totalInstallments = await orm(Installment).count({ where: { loan_id: loan.id } });
//     const installments = await orm(Installment).find({
//       where: { loan_id: loan.id },
//       // take: perPage,
//       // skip: offset,
//     });
//     const selectedRate = loanPlan.rate.find(
//       (r) => Number(r.installment) === loan.total_installment
//     );
//     const interestRate =
//       Number(loan.loan_interest) +
//       Number(loanPlan.application_percent_charge);

//     const __rate = Number(interestRate) / 100 / 12;
//     const __diff = Number(loan.amount) * __rate;
//     const __pill = Math.pow(1 + __rate, loan.total_installment);
//     const __diff2 = __diff * __pill;
//     const __pill2 = __pill - 1;
//     const __installment_per_month = __diff2 / __pill2;

//     const __totalInstallment = __installment_per_month * loan.total_installment;

//     const loan_summary = {
//       loan_number: loan.loan_number,
//       plan: loanPlan.name,
//       amount: Number(loan.amount),
//       per_installment: Number(loan.per_installment),
//       total_installment: Number(loan.total_installment),
//       given_installment: Number(loan.given_installment + 1),
//       receivable: Number(loan.receivable),
//       delay_value: Number(loanPlan.delay_value),
//       total_paid: Number(loan.total_paid),
//       remaining: Number(loan.remaining),
//       installment_start: loan.installment_start,
//       installment_due: loan.installment_due,
//       interestRate: interestRate,
//       overdue_balance: Number(loan.overdue_balance),
//       status: loan.status,
//       pay_days: 30,
//       delay_days: loanPlan.delay_days,
//       delay_charge: loanPlan.delay_charge,
//     };


//     let totalAmount = Number(loan.remaining);
//     let nextDate = new Date(loan.installment_start);
//     const __array = Array.from({ length: Number(loan.total_installment) }).map(
//       (_, i) => {
//         let currentDate = new Date(loan.installment_due);
//         currentDate.setMonth(currentDate.getMonth() + i);

//         const timeDifference = currentDate.getTime() - nextDate.getTime();
//         nextDate = currentDate;
//         const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//         const year = currentDate.getFullYear();
//         const daysInYear = getDaysInYear(year);

//         const __interest =
//           (totalAmount * (Number(interestRate) / 100) * daysPassed) /
//           daysInYear;

//         let __principle =
//           __installment_per_month - __interest <= 0
//             ? 0
//             : __installment_per_month - __interest;
//         if (i === Number(loan.total_installment) - 1) {
//           __principle = totalAmount;
//         } else if (__principle > totalAmount) __principle = totalAmount;
//         else if (totalAmount === 0)
//           return {
//             date: currentDate,
//             amount: 0,
//             interest: 0,
//             principle: 0,
//             remaining: 0,
//             receive: totalAmount,
//             days: 0,
//           };
//         totalAmount = totalAmount - __principle;
//         const __receive = Number(loan.amount) - totalAmount;
//         const __amount = __principle + __interest;
//         return {
//           date: currentDate,
//           amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
//           interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
//           principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
//           remaining: Math.round((totalAmount + Number.EPSILON) * 100) / 100,
//           receive: Math.round((__receive + Number.EPSILON) * 100) / 100,
//           days: daysPassed,
//         };
//       }
//     );
//     return res.success("Get installment LoanId", { loan_summary, installment: __array });
//   } catch (err) {
//     console.log(err);
//     return res.error(err.detail || err.routine);
//   }
// };

// export const due_installment = async (req, res) => {
//   const { loan_id } = req.params;
//   const _loanId = parseInt(loan_id) || -1;
//   const userId = req.user.id;

//   try {
//     const loan = await orm(Loan).findOne({
//       where: { id: _loanId, user_id: userId },
//     });
//     if (!loan) return res.error("Loan not found");

//     const loanPlan = await orm(LoanPlan).findOne({
//       where: { id: loan.plan_id },
//     });
//     if (!loanPlan) return res.error("Loan Plan not found");

//     const installments = await orm(Installment).find({
//       where: { loan_id: loan.id },
//     });

//     const interestRate =
//       Number(loan.loan_interest) +
//       Number(loanPlan.application_percent_charge);

//     let __array;
//     let __installment_per_month;
//     const __amount = Number(loan.amount);


//     if (loanPlan.type_interest === 'flatrate') {
//       // คำนวณดอกเบี้ยแบบคงที่ (Flat Rate)
//       const totalInterest = __amount * (interestRate / 100) * (loan.total_installment / 12);
//       const totalAmount = __amount + totalInterest;
//       __installment_per_month =
//         Math.round((totalAmount / loan.total_installment + Number.EPSILON) * 100) / 100;

//       let remainingAmount = totalAmount;
//       let nextDate = new Date(loan.installment_start);

//       __array = Array.from({ length: Number(loan.total_installment) }).map((_, i) => {
//         let currentDate = new Date(loan.installment_due);
//         currentDate.setMonth(currentDate.getMonth() + i);

//         const timeDifference = currentDate.getTime() - nextDate.getTime();
//         nextDate = currentDate;
//         const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//         let __principle, __interest, __amount_per_month;

//         if (i === Number(loan.total_installment) - 1) {
//           // งวดสุดท้าย
//           __amount_per_month =
//             Math.round((remainingAmount + Number.EPSILON) * 100) / 100;
//           __interest =
//             Math.round((totalInterest / loan.total_installment + Number.EPSILON) * 100) / 100;
//           __principle =
//             Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) / 100;
//         } else {
//           __amount_per_month = __installment_per_month;
//           __interest =
//             Math.round((totalInterest / loan.total_installment + Number.EPSILON) * 100) / 100;
//           __principle =
//             Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) / 100;
//         }

//         remainingAmount =
//           Math.round((remainingAmount - __amount_per_month + Number.EPSILON) * 100) / 100;

//         return {
//           date: currentDate,
//           amount: __amount_per_month,
//           interest: __interest,
//           principle: __principle,
//           remaining: Math.max(0, remainingAmount),
//           receive:
//             Math.round((totalAmount - remainingAmount + Number.EPSILON) * 100) / 100,
//           days: daysPassed,
//         };
//       });
//     } else {
//       // คำนวณดอกเบี้ยแบบลดต้นลดดอก (Effective Rate)
//       const __rate = Number(interestRate) / 100 / 12;
//       __installment_per_month = pillComponent(__amount, __rate, loan.total_installment);

//       let totalAmount = Number(loan.remaining);
//       let nextDate = new Date(loan.installment_start);

//       __array = Array.from({ length: Number(loan.total_installment) }).map((_, i) => {
//         let currentDate = new Date(loan.installment_due);
//         currentDate.setMonth(currentDate.getMonth() + i);

//         const timeDifference = currentDate.getTime() - nextDate.getTime();
//         nextDate = currentDate;
//         const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

//         const year = currentDate.getFullYear();
//         const daysInYear = getDaysInYear(year);

//         const __dailyInterestRate = Number(interestRate) / 100 / daysInYear;
//         const __interest = Math.round(
//           (totalAmount * __dailyInterestRate * daysPassed + Number.EPSILON) * 100
//         ) / 100;

//         let __principle, __amount_per_month;

//         if (i === Number(loan.total_installment) - 1) {
//           __principle = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
//           if (__principle <= 0) __principle = 0;
//           __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
//         } else {
//           __principle = Math.round((__installment_per_month - __interest + Number.EPSILON) * 100) / 100;
//           if (__principle <= 0) __principle = 0;
//           __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
//         }

//         if (__principle > totalAmount) {
//           __principle = totalAmount;
//           __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
//         }

//         totalAmount = Math.round((totalAmount - __principle + Number.EPSILON) * 100) / 100;
//         const __receive = Math.round((__amount - totalAmount + Number.EPSILON) * 100) / 100;

//         return {
//           date: currentDate,
//           amount: __amount_per_month,
//           interest: __interest,
//           principle: __principle,
//           remaining: Math.max(0, totalAmount),
//           receive: __receive,
//           days: daysPassed,
//         };
//       });
//     }

//     const loan_summary = {
//       loan_number: loan.loan_number,
//       plan: loanPlan.name,
//       amount: Number(loan.amount),
//       per_installment: Number(loan.per_installment),
//       total_installment: Number(loan.total_installment),
//       given_installment: Number(loan.given_installment + 1),
//       receivable: Number(loan.receivable),
//       delay_value: Number(loanPlan.delay_value),
//       total_paid: Number(loan.total_paid),
//       remaining: Number(loan.remaining),
//       installment_start: loan.installment_start,
//       installment_due: loan.installment_due,
//       interestRate: interestRate,
//       overdue_balance: Number(loan.overdue_balance),
//       status: loan.status,
//       pay_days: 30,
//       delay_days: loanPlan.delay_days,
//       delay_charge: loanPlan.delay_charge,
//     };

//     return res.success("Get installment LoanId", { loan_summary, installment: __array });
//   } catch (err) {
//     console.log(err);
//     return res.error(err.detail || err.routine);
//   }
// };


export const due_installment = async (req, res) => {
  const { loan_id } = req.params;
  const _loanId = parseInt(loan_id) || -1;
  const userId = req.user.id;

  try {
    const loan = await orm(Loan).findOne({
      where: { id: _loanId, user_id: userId },
    });
    if (!loan) return res.error("Loan not found");

    const loanPlan = await orm(LoanPlan).findOne({
      where: { id: loan.plan_id },
    });
    if (!loanPlan) return res.error("Loan Plan not found");

    const interestRate =
      Number(loan.loan_interest) +
      Number(loanPlan.application_percent_charge);

    const lastInstallment = await orm(Installment).findOne({
      where: { loan_id: _loanId },
      order: { created_at: "DESC" },
    })


    let result;
    if (loanPlan.type_interest === 'flatrate') {
      result = await flatrateInstallment({
        loan_id: _loanId,
        amount: Number(loan.amount),
        rate: interestRate,
        installment: Number(loan.total_installment),
        start: loan.startDate,
        created: loan.approved_at,
        given_at: Number(loan.given_installment || 0),
        lastPaid: lastInstallment.paid - Number(loan.charge_per_installment),
        delay_charge: Number(loan.charge_per_installment)
      });
    } else {
      result = await effevtiverateInstallment({
        loan_id: _loanId,
        amount: Number(loan.amount),
        rate: interestRate,
        installment: Number(loan.total_installment),
        start: loan.startDate,
        created: loan.approved_at,
        given_at: Number(loan.given_installment || 0),
        lastPaid: lastInstallment.paid - Number(loan.charge_per_installment),
        delay_charge: Number(loan.charge_per_installment)
      });
    }

    const loan_summary = {
      loan_number: loan.loan_number,
      plan: loanPlan.name,
      amount: Number(loan.amount),
      per_installment: Number(loan.per_installment),
      total_installment: Number(loan.total_installment),
      given_installment: Number(loan.given_installment + 1),
      receivable: Number(loan.receivable),
      delay_value: Number(loanPlan.delay_value),
      total_paid: Number(loan.total_paid),
      remaining: Number(loan.remaining),
      installment_start: loan.installment_start,
      installment_due: loan.installment_due,
      interestRate: interestRate,
      overdue_balance: Number(loan.overdue_balance),
      status: loan.status,
      pay_days: 30,
      delay_days: loanPlan.delay_days,
      delay_charge: loanPlan.delay_charge,
    };

    return res.success("Get installment LoanId", {
      loan_summary,
      installment: result.installment
    });

  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const installments = async (req, res) => {
  const { loan_id } = req.params;
  const _loanId = parseInt(loan_id) || -1;
  // const { page, limit } = req.query;
  // const perPage = parseInt(limit) || 20;
  // const offset = (parseInt(page) - 1) * perPage || 0;
  const userId = req.user.id;

  try {
    const loan = await orm(Loan).findOne({
      where: { id: _loanId, user_id: userId },
    });
    if (!loan) return res.error("Loan not found");

    const loanPlan = await orm(LoanPlan).findOne({
      where: { id: loan.plan_id },
    });
    if (!loanPlan) return res.error("Loan Plan not found");

    // const totalInstallments = await orm(Installment).count({ where: { loan_id: loan.id } });
    const installments = await orm(Installment).find({
      where: { loan_id: loan.id },
      // take: perPage,
      // skip: offset,
    });
    const selectedRate = loanPlan.rate.find(
      (r) => Number(r.installment) === loan.total_installment
    );
    const interestRate =
      Number(selectedRate.interest_rate) +
      Number(loanPlan.application_percent_charge);

    const loan_summary = {
      loan_number: loan.loan_number,
      plan: loanPlan.name,
      amount: Number(loan.amount),
      per_installment: Number(loan.per_installment),
      total_installment: Number(loan.total_installment),
      given_installment: Number(loan.given_installment + 1),
      receivable: Number(loan.receivable),
      delay_value: Number(loanPlan.delay_value),
      total_paid: Number(loan.total_paid),
      remaining: Number(loan.remaining),
      installment_start: loan.installment_start,
      installment_due: loan.installment_due,
      interestRate: interestRate,
      overdue_balance: Number(loan.overdue_balance),
      status: loan.status,
      pay_days: 30,
      delay_days: loanPlan.delay_days,
      delay_charge: loanPlan.delay_charge,
    };

    const notApprove = {
      id: loan.id,
      loan_number: loan.loan_number,
      plan: loanPlan.name,
      amount: 0,
      per_installment: 0,
      delay_charge: 0,
      total_installment: loan.total_installment,
    };

    let updatedInstallments = [];

    if (loan.status == loan_status.Running) {
      updatedInstallments = installments;
    } else {
      updatedInstallments = [notApprove];
    }

    return res.success("Get installment LoanId", {
      loan_summary,
      installment: updatedInstallments,
    });
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const installmentAll = async (req, res) => {
  const { page, limit } = req.query;
  const { status } = req.params;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  const userId = req.user.id;

  try {
    const loans = await orm(Loan).find({ where: { user_id: userId } });
    if (!loans.length) return res.error("No loans found");

    const planIds = loans.map((loan) => loan.plan_id);
    const loanIds = loans.map((loan) => loan.id);

    // ดึงข้อมูล plans และสร้าง map ของ plan_id และ plan_name
    const plans = await orm(LoanPlan).find({ where: { id: In(planIds) } });
    const planMap = plans.reduce((map, plan) => {
      map[plan.id] = plan.name;
      return map;
    }, {});

    // ดึงข้อมูล installment ทั้งหมดของ loan_id
    const allInstallments = await orm(Installment).find({
      where: { loan_id: In(loanIds) },
      order: { installment_date: "ASC" },
    });

    // สร้าง map สำหรับเก็บข้อมูลจำนวนงวดทั้งหมดของแต่ละ loan และนับงวดที่จ่ายไปแล้ว
    const totalInstallmentsMap = {};
    const paidInstallmentsMap = {};

    allInstallments.forEach((installment) => {
      if (!totalInstallmentsMap[installment.loan_id]) {
        totalInstallmentsMap[installment.loan_id] = 0;
        paidInstallmentsMap[installment.loan_id] = [];
      }
      totalInstallmentsMap[installment.loan_id]++;
      if (installment.isPaid) {
        paidInstallmentsMap[installment.loan_id].push(installment);
      }
    });

    // กรอง installments ตามสถานะ
    let filteredInstallments = allInstallments;
    if (status && status.toLowerCase() === "paid") {
      filteredInstallments = allInstallments.filter(
        (installment) => installment.isPaid
      );
    } else if (status && status.toLowerCase() === "due") {
      filteredInstallments = allInstallments.filter(
        (installment) => !installment.isPaid
      );
    }

    const installmentData = [];
    loans.forEach((loan) => {
      const loanInstallments = filteredInstallments.filter(
        (inst) => inst.loan_id === loan.id
      );
      loanInstallments.forEach((installment, index) => {
        let installmentNumber = index + 1;
        if (status && status.toLowerCase() === "paid") {
          installmentNumber =
            paidInstallmentsMap[loan.id].findIndex(
              (inst) => inst.id === installment.id
            ) + 1;
        } else if (status && status.toLowerCase() === "due") {
          installmentNumber = paidInstallmentsMap[loan.id].length + index + 1;
        }
        installmentData.push({
          ...installment,
          plan_name: planMap[loan.plan_id],
          loan_number: loan.loan_number,
          installment_number: installmentNumber,
          total_installments: totalInstallmentsMap[loan.id],
        });
      });
    });

    const paginatedInstallments = installmentData.slice(
      offset,
      offset + perPage
    );

    return res.success(
      "Get Installment all",
      paginatedInstallments,
      installmentData.length
    );
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.detail || err.message });
  }
};

export const getPaymentDetails = async (req, res) => {
  const _loanId = parseInt(req.params.loan_id) || -1;
  const _installmentId = parseInt(req.params.installment_id) || -1;

  try {
    const loan = await orm(Loan).findOne({ where: { id: _loanId } });
    if (!loan) return res.error("Loan not found");
    const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id } });

    if (loan.approved_at === null) {
      const paymentDetails = {
        loan_id: loan.id,
        plan_name: plan.name,
        loan_number: loan.loan_number,
        installment_date: null,
        per_installment: 0,
        delay_charge: 0,
        totalpay: 0,
        total_installments: loan.total_installment,
      };
      return res.success("Get Payment Details", paymentDetails);
    }

    // if ((loan.status !== loan_status.Running) && (loan.status !== loan_status.Due)) return res.error('Loan is not Running');

    const allInstallments = await orm(Installment).find({
      where: { loan_id: _loanId },
      order: { installment_date: "ASC" },
    });

    const installment = allInstallments.find(
      (inst) => inst.id === _installmentId
    );
    // if (!installment) return res.error('Installment not found');

    const installmentIndex =
      allInstallments.findIndex((inst) => inst.id === _installmentId) + 1;

    const currentDate = new Date();
    const installmentDate = new Date(installment.installment_date);
    const delayDays = Math.max(
      0,
      Math.ceil(
        (currentDate.getTime() - installmentDate.getTime()) /
        (1000 * 60 * 60 * 24)
      )
    );
    let startDate;
    if (loan.given_installment === 0) {
      // งวดแรก ใช้ approve_at
      startDate = new Date(loan.approved_at);
    } else {
      // งวดถัดไป ใช้วันที่ชำระล่าสุด
      const lastPayment = await orm(Installment).findOne({
        where: { loan_id: loan.id },
        order: { given_at: "DESC" },
      });
      startDate = new Date(lastPayment.given_at);
    }
    const days = Math.ceil(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const delayValue = parseInt(plan.delay_value);
    const fixedCharge = Number(plan.fixed_charge);
    let delayCharge = 0;

    if (delayDays > delayValue) {
      const monthsLate = Math.floor((delayDays - delayValue) / 30) + 1;
      delayCharge = fixedCharge * monthsLate;
    }

    installment.delay_charge = delayCharge;
    // ถ้าจ่ายค่าล่าช้าแล้ว ให้ delayCharge = 0
    if (installment.delay_charge_paid >= installment.delay_charge) {
      delayCharge = 0;
    }

    // การคำนวณ per_installment
    let remainingPerInstallment = 0;
    if (installment.paid === 0) {
      remainingPerInstallment =
        Number(installment.per_installment) +
        delayCharge +
        Number(installment.overdue_balance);
    } else {
      remainingPerInstallment =
        Number(loan.per_installment) -
        (Number(installment.paid) -
          (Number(installment.paid) >= Number(installment.delay_charge)
            ? delayCharge
            : 0));
    }

    const selectedRate = plan.rate.find(
      (r) => Number(r.installment) === loan.total_installment
    );
    const interestRate =
      selectedRate.interest_rate + Number(plan.application_percent_charge);
    const currentInterest =
      Number(loan.principle) * (((interestRate / 100) * days) / 366);
    const closeloan = Number(loan.principle) + currentInterest;

    const paymentDetails = {
      loan_id: loan.id,
      installment_id: installment.id,
      plan_name: plan.name,
      loan_number: loan.loan_number,
      installment_date: installment.installment_date,
      per_installment:
        remainingPerInstallment > 0 ? remainingPerInstallment : 0,
      overdue_balance: loan.overdue_balance,
      delay_charge: delayCharge,
      delay_days: delayDays,
      totalpay:
        (remainingPerInstallment > 0 ? remainingPerInstallment : 0) +
        Number(loan.overdue_balance) +
        delayCharge,
      installment_number: installmentIndex,
      total_installments: loan.total_installment,
      closeLoan: closeloan,
    };

    return res.success("Get Payment Details", paymentDetails);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};


export const payment = async (req, res) => {
  // const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  // const _loanId = parseInt(obj.loan_id) || -1;

  try {
    // const loan = await orm(Loan).findOne({
    //   where: {
    //     id: _loanId,
    //     approved_at: Not(IsNull()),
    //     status: Not(loan_status.Paid),
    //   },
    // });
    // if (!loan) return res.error("Loan not found");
    // if (loan.status !== loan_status.Running)
    //   return res.error("Loan is not Running");

    // const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id } });

    // // const installment = await orm(Installment).findOne({ where: { loan_id: _loanId } });
    // // if (!installment) return res.error('Installment not found');

    // let paidAmount = Number(obj.paidAmount);
    // if (paidAmount <= 0) return res.error("ยอดชำระต้องไม่น้อยกว่า 0");

    // const paidDate = obj.paymentDate ? obj.paymentDate : null;

    // // คำนวนยอด
    // const selectedRate = plan.rate.find(
    //   (r) => Number(r.installment) === loan.total_installment
    // );
    // const interestRate =
    //   Number(selectedRate.interest_rate) +
    //   Number(plan.application_percent_charge);
    // const appliecationRate =
    //   Number(loan.principle) * Number(plan.application_percent_charge);

    // const {
    //   delay_days,
    //   delay_charge,
    //   principle,
    //   interest,
    //   paid_principle,
    //   paid_interest,
    //   days,
    //   principle_remaining,
    //   interest_remaining,
    //   installment,
    //   ...props
    // } = paymentCalculator(
    //   loan.amount,
    //   loan.remaining,
    //   interestRate,
    //   loan.total_installment,
    //   loan.installment_start,
    //   paidDate,
    //   paidAmount,
    //   loan.overdue_balance,
    //   Number(loan.given_installment) + 1,
    //   30,
    //   plan.delay_days,
    //   plan.fixed_charge
    // );
    // const _installment = new Installment();
    // _installment.loan_id = loan.id;
    // _installment.installment_date = new Date(loan.installment_due);
    // _installment.start_date = loan.installment_start;
    // _installment.per_installment = loan.per_installment;
    // _installment.isPaid = true;
    // _installment.given_at = new Date();
    // _installment.paid = paidAmount;
    // _installment.delay_days = delay_days > 0 ? delay_days : 0;
    // _installment.per_installment = loan.per_installment;
    // _installment.principle_installment = principle;
    // _installment.interest_installment = interest;
    // _installment.principle_paid = paid_principle;
    // _installment.interest_paid = paid_interest;
    // _installment.overdue_balance = 0;
    // await orm(Installment).save(_installment);
    // // let __checkDate = new Date(loan.installment_start);
    // // __checkDate.setDate(__checkDate.getDate() + days);
    // if (days >= 0) {
    //   const _nextStart = new Date(loan.installment_due);
    //   let _nextDue = new Date(loan.installment_due);
    //   _nextDue.setMonth(_nextDue.getMonth() + 1);
    //   loan.installment_start = _nextStart;
    //   loan.installment_due = _nextDue;
    // }

    // loan.principle = principle_remaining;
    // loan.remaining = principle_remaining;
    // loan.given_installment = installment;
    // loan.overdue_balance = interest_remaining;
    // loan.total_paid = Number(loan.total_paid) + Number(paidAmount);
    // // loan.interest = Number(loan.interest) - Number(installment.interest_paid);
    // if (principle_remaining <= 0) loan.status = loan_status.Paid;
    // await orm(Loan).save(loan);

    // const transaction = new Transaction();
    // transaction.user_id = loan.user_id;
    // transaction.loan_id = loan.id;
    // transaction.plan = plan.name;
    // transaction.loan_number = loan.loan_number;
    // transaction.amount = loan.amount;
    // transaction.installment_date = _installment.installment_date;
    // transaction.given_at = paidDate;
    // transaction.paid = paidAmount;
    // transaction.given_installment = loan.given_installment;
    // transaction.total_installment = loan.total_installment;
    // transaction.delay_days = delay_days;
    // transaction.delay_charge = delay_charge;
    // transaction.application_percent_charge = appliecationRate;
    // transaction.receivable = loan.receivable;
    // transaction.total_paid = loan.total_paid;
    // transaction.remaining = loan.remaining;
    // transaction.principle = _installment.principle_paid;
    // transaction.interest = _installment.interest_paid;
    // transaction.days = days;
    // if (obj.type === "cash") {
    //   transaction.cash = paidAmount;
    // } else transaction.transfer_payment = paidAmount;

    // await orm(Transaction).save(transaction);

    // const tax = new Tax();
    // tax.user_id = loan.user_id;
    // tax.loan_id = loan.id;
    // tax.loan_number = loan.loan_number;
    // tax.principle = paid_principle;
    // tax.interest = paid_interest;
    // tax.interest_rate = selectedRate.interest_rate;
    // tax.installment_id = _installment.id;
    // tax.tax_business = (paid_interest * 3) / 100;
    // tax.tax_local = (((paid_interest * 3) / 100) * 10) / 100;
    // tax.total_tax =
    //   (paid_interest * 3) / 100 + (((paid_interest * 3) / 100) * 10) / 100;
    // await orm(Tax).save(tax);

    return res.success("Comming Soon");
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const removeUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await orm(Users).findOne({ where: { id: user_id } });
    if (!user) return res.error("ไม่พบผู้ใช้");

    await AppDataSource.transaction(async (transactionManager) => {
      const loans = await transactionManager.find(Loan, {
        where: { user_id: user_id },
      });

      for (const loan of loans) {
        const loanContracts = await transactionManager.find(LoanContract, {
          where: { loan_id: loan.id },
        });
        const installments = await transactionManager.find(Installment, {
          where: { loan_id: loan.id },
        });
        // const guarantees = await transactionManager.find(LoanGuarantee, {
        //   where: { loan_id: loan.id },
        // });
        const taxes = await transactionManager.find(Tax, {
          where: { loan_id: loan.id },
        });

        await transactionManager.remove(LoanContract, loanContracts);
        await transactionManager.remove(Installment, installments);
        // await transactionManager.remove(LoanGuarantee, guarantees);
        await transactionManager.remove(Tax, taxes);
        await transactionManager.remove(Loan, loan);
      }

      const userAccessToken = await transactionManager.findOne(
        UsersAccessToken,
        { where: { userid: user_id } }
      );
      if (userAccessToken) {
        await transactionManager.remove(UsersAccessToken, userAccessToken);
      }

      const userKyc = await transactionManager.findOne(Users_KYC, {
        where: { user_id: user_id },
      });
      if (userKyc) {
        await transactionManager.remove(Users_KYC, userKyc);
      }

      const smsVerify = await transactionManager.findOne(Users_SMS, {
        where: { mobile: user.mobile },
      });
      if (smsVerify) {
        await transactionManager.remove(Users_SMS, smsVerify);
      }

      await transactionManager.remove(Users, user);
    });

    return res.success("ลบผู้ใช้และข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว");
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};
