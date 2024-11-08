import { LoanPlan } from "../entities/loan_plan";
import { AppDataSource, orm } from "../../../data-source";
import { Loan } from "../entities/loan";
import { Installment } from "../entities/loan_installment";
import { loan_status } from "../../Utils/enum";
import { Users } from "../../Users/entities";
import {
  sendNotificationEmail,
  takeloan_notificate,
  ApproveRejectLoan_notificate,
  payment_notificate,
} from "../../Notification/controller";
import {
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
  Not,
  LessThan,
  IsNull,
  In,
} from "typeorm";
import { LoanContract } from "../entities/loan_contract";
import {
  Line_SendNotificate,
  Line_Reject,
  Line_SendSlip,
  Line_Approve,
} from "../../Line_Message/module";
import { File_Manager } from "../../FileManager/entities/File_Manager";
import { v4 as uuidv4 } from "uuid";
import { Application_Form } from "../entities/loan_applicationform";
import {
  generateReference,
  toTHB,
  validateMimetype,
  toDate,
  generateLoanNumber,
  generateReceiptNumber,
} from "../../../Utils/index";
import {
  effectiverateCalculator,
  flatrateCalculator,
  installmentRemaining,
  paymentCalculator,
  flatrateInstallment,
  effevtiverateInstallment
} from "./calurate";
import { Transaction } from "../../Transaction/entities/transaction";
import { Tax } from "../entities/tax";
import { LoanGuarantee } from "../entities/loan_guarantee";
import * as path from "path";
import * as fs from "fs";
import { LineCreateQR } from "../../PaymentGateway/controller";
import { QRPayment } from "../../PaymentGateway/entities/qrpayment";
import { reSizeBase64 } from "../../../Utils";

export const dashboard = async (req, res) => {
  try {
    const { month, year } = req.query;

    // ถ้าไม่มีการระบุค่า month และ year ให้ใช้ค่าปัจจุบัน
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const hasDateFilter = month && year;

    const queryMonth = month ? parseInt(month) : currentMonth;
    const queryYear = year ? parseInt(year) : currentYear;

    // หาค่าเริ่มต้นและสิ้นสุดของเดือนที่ระบุ
    const start = new Date(queryYear, queryMonth - 1, 1);
    const end = new Date(queryYear, queryMonth, 0, 23, 59, 59);

    const totalUser = await orm(Users).count({});
    const activeUser = await orm(Users).count({
      where: { line_id: Not(IsNull()) },
    });
    const kycPending = await orm(Users).count({ where: { kyc: "pending" } });
    const mobileUnverify = await orm(Users).count({
      where: { sv: "unverified" },
    });

    const dateFilter = hasDateFilter ? { created_at: Between(start, end) } : {};

    const allLoan = await orm(Loan).count({
      where: {
        ...dateFilter,
      },
    });

    const runningLoan = await orm(Loan).count({
      where: {
        status: In([loan_status.Running]),
        ...dateFilter,
      },
    });

    const pendingLoan = await orm(Loan).count({
      where: {
        status: loan_status.Pending,
        ...dateFilter,
      },
    });

    const rejectLoan = await orm(Loan).count({
      where: {
        status: loan_status.Rejected,
        ...dateFilter,
      },
    });

    const dueLoan = await orm(Loan).count({
      where: {
        installment_due: LessThanOrEqual(new Date()),
        status: loan_status.Running,
        ...dateFilter,
      },
    });

    const paidLoan = await orm(Loan).count({
      where: {
        status: loan_status.Paid,
        ...dateFilter,
      },
    });

    const badLoan = await orm(Loan).count({
      where: {
        status: loan_status.Bad,
        ...dateFilter,
      },
    });

    const query = `
            WITH months AS (
                SELECT LAST_DAY(DATE(CONCAT(YEAR(CURDATE()), '-', m, '-01'))) AS end_date
                FROM (SELECT 1 AS m UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL 
                      SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL 
                      SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) AS months
            ),
            loan_data AS (
                SELECT 
                    LAST_DAY(created_at) AS end_date,
                    SUM(COALESCE(total_paid, 0)) AS total_paid,
                    SUM(COALESCE(overdue_balance, 0)) AS overdue_balance
                FROM 
                    loan
                WHERE 
                    YEAR(created_at) = YEAR(CURDATE())
                GROUP BY 
                    LAST_DAY(created_at)
            )
            SELECT 
                DATE_FORMAT(m.end_date, '%Y-%m-%d') AS end_date, -- แปลงวันที่เป็นรูปแบบที่ต้องการ
                COALESCE(l.total_paid, 0) AS total_paid,
                COALESCE(l.overdue_balance, 0) AS overdue_balance
            FROM 
                months m
            LEFT JOIN 
                loan_data l ON m.end_date = l.end_date
            ORDER BY 
                m.end_date ASC;
        `;

    const result = await AppDataSource.query(query);

    const totalPaidData = result.map((row) => row.total_paid);
    const overdueBalanceData = result.map((row) => row.overdue_balance);
    const categoriesData = result.map((row) => row.end_date);

    const dashboardData = {
      totalUser,
      activeUser,
      kycPending,
      mobileUnverify,
      allLoan,
      runningLoan,
      pendingLoan,
      rejectLoan,
      dueLoan,
      paidLoan,
      badLoan,
      total_paid: totalPaidData, // ยอดชำระในแต่ละเดือน
      overdue_balance: overdueBalanceData, // ยอดค้างชำระในแต่ละเดือน
      categories: categoriesData, // วันที่สิ้นเดือน
    };

    return res.success("Dashboard", dashboardData);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const dashboardGraph = async (req, res) => {
  try {
    const { start, end } = req.query;

    const currentDate = new Date();

    const startDate = start
      ? new Date(`${start}T00:00:00Z`)
      : new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth() - 1,
          currentDate.getUTCDate(),
          0,
          0,
          0
        )
      );

    const endDate = end
      ? new Date(`${end}T23:59:59Z`)
      : new Date(
        Date.UTC(
          currentDate.getUTCFullYear(),
          currentDate.getUTCMonth(),
          currentDate.getUTCDate(),
          23,
          59,
          59
        )
      );

    const startDateString = startDate.toISOString().split("T")[0];
    const endDateString = endDate.toISOString().split("T")[0];

    const query = `
        SELECT 
          DATE(i.given_at) AS period,
          SUM(i.paid) AS total_paid,
          SUM(i.overdue_balance) AS overdue_balance,
          SUM(IF(i.paid < i.per_installment, i.per_installment - i.paid, 0)) AS outstanding_balance
        FROM loan_installment i
        WHERE given_at BETWEEN ? AND ?
        GROUP BY DATE(given_at)
        ORDER BY DATE(given_at) ASC
      `;

    const installmentData = await AppDataSource.query(query, [
      startDateString,
      endDateString,
    ]);

    const allDates = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setUTCDate(d.getUTCDate() + 1)
    ) {
      allDates.push(new Date(d).toISOString().split("T")[0]);
    }

    const totalPaidData = Array(allDates.length).fill(0);
    const overdueBalanceData = Array(allDates.length).fill(0);
    const outstandingBalanceData = Array(allDates.length).fill(0);

    installmentData.forEach((row) => {
      const periodDate = new Date(row.period);
      const periodUTC = new Date(
        Date.UTC(
          periodDate.getFullYear(),
          periodDate.getMonth(),
          periodDate.getDate()
        )
      )
        .toISOString()
        .split("T")[0];

      const dateIndex = allDates.indexOf(periodUTC);
      if (dateIndex !== -1) {
        totalPaidData[dateIndex] = row.total_paid;
        overdueBalanceData[dateIndex] = row.overdue_balance;
        outstandingBalanceData[dateIndex] = row.outstanding_balance;
      }
    });

    const graphResponseData = {
      total_paid: totalPaidData,
      overdue_balance: overdueBalanceData,
      outstanding_balance: outstandingBalanceData,
      categories: allDates,
    };

    return res.success("Dashboard Graph", graphResponseData);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const lastCustomer = async (req, res) => {
  try {
    const user = await orm(Users).find({
      where: { kyc: "verified" },
      order: { created_at: "DESC" },
      take: 10,
    });
    const users = user.map((user) => {
      const { password, ...detail } = user;
      return detail;
    });

    return res.success("last user", users);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// -------------------------------- loan status -------------------------------- //
export const get_loans = async (req, res) => {
  const { status } = req.params;
  const { search, page, limit, start, end } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;

  let whereClause = "";
  const parameters = [];

  if (status && status.toLowerCase() !== "all") {
    if (status.toLowerCase() === "due") {
      //   whereClause += " WHERE LOWER(l.status) = LOWER(?)";
      whereClause = " WHERE ? >= l.installment_due AND l.status = 'Running'";
      parameters.push(new Date().toISOString().split("T")[0]);
    } else if (status.toLowerCase() === "paid") {
      whereClause += `
              WHERE (
                  LOWER(l.status) = 'Paid' OR LOWER(l.status) = 'Bad'
              )
          `;
    } else if (status.toLowerCase() === "running") {
      whereClause += `
              WHERE (
                  LOWER(l.status) = 'Running'
              )
          `;
    } else {
      whereClause += " WHERE LOWER(l.status) = LOWER(?)";
      parameters.push(status);
    }
  }

  if (start && end) {
    whereClause += whereClause ? " AND " : " WHERE ";
    if (status && status.toLowerCase() === "paid") {
      whereClause += "l.closed_at BETWEEN ? AND ?";
    } else if (status && status.toLowerCase() === "due") {
      whereClause += "l.installment_due BETWEEN ? AND ?";
    } else {
      whereClause += "l.created_at BETWEEN ? AND ?";
    }
    parameters.push(new Date(`${start}T00:00:00`));
    parameters.push(new Date(`${end}T23:59:59`));
  } else if (start) {
    whereClause += whereClause ? " AND " : " WHERE ";
    if (status && status.toLowerCase() === "paid") {
      whereClause += "l.closed_at >= ?";
    } else if (status && status.toLowerCase() === "due") {
      whereClause += "l.installment_due BETWEEN ? AND ?";
    } else {
      whereClause += "l.created_at >= ?";
    }
    parameters.push(new Date(`${start}T00:00:00`));
  } else if (end) {
    whereClause += whereClause ? " AND " : " WHERE ";
    if (status && status.toLowerCase() === "paid") {
      whereClause += "l.closed_at <= ?";
    } else if (status && status.toLowerCase() === "due") {
      whereClause += "l.installment_due BETWEEN ? AND ?";
    } else {
      whereClause += "l.created_at <= ?";
    }
    parameters.push(new Date(`${end}T23:59:59`));
  }

  if (search) {
    whereClause += whereClause ? " AND " : " WHERE ";
    whereClause += `(LOWER(l.loan_number) LIKE LOWER(?) 
      OR LOWER(u.citizen_id) LIKE LOWER(?) 
      OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)
      )`;
    parameters.push(
      `%${search.toLowerCase()}%`,
      `%${search.toLowerCase()}%`,
      `%${search.toLowerCase()}%`
    );
  }

  parameters.push(perPage, offset);

  const countQuery = `
          SELECT COUNT(*) AS total
          FROM loan l
          LEFT JOIN system_users u ON l.user_id = u.id
          ${whereClause}
      `;

  const loansQuery = `
      SELECT
        l.id, 
        MAX(l.loan_number) as loan_number,
        MAX(l.reference) as reference,
        MAX(l.amount) as amount, 
        GREATEST(MAX(l.principle), 0) as remaining, 
        MAX(l.per_installment) as per_installment, 
        MAX(l.per_installment) as per_installment2, 
        MAX(l.total_installment) as total_installment, 
        MAX(l.given_installment) + 1 as given_installment, 
        MAX(l.day_tricker) as day_tricker,
        MAX(l.status) as status, 
        MAX(l.created_at) as created_at, 
        MAX(l.startDate) as startDate,
        MAX(l.endDate) as endDate,
        MAX(l.approved_at) as approved_at,
        GREATEST(MAX(l.total_paid), 0) as total_paid, 
        GREATEST(MAX(l.principle), 0) as principle, 
        GREATEST(MAX(l.interest), 0) as interest, 
        MAX(l.installment_due) as installment_due,
        GREATEST(MAX(lp.application_fixed_charge), 0) as application_fixed_charge,         
        GREATEST(MAX(lp.application_percent_charge), 0) as application_percent_charge,    
        GREATEST(MAX(lp.fixed_charge), 0) as fixed_charge,                  
        GREATEST(MAX(lp.fixed_charge2), 0) as fixed_charge2,                 
        MAX(lc.installment_start) as loan_start,           
        MAX(lc.installment_end) as loan_end,               
        MAX(u.citizen_id) as citizen_id,
        MAX(u.firstname) as firstname, 
        MAX(u.lastname) as lastname,
        MAX(u.email) as email,
        MAX(u.username) as username,
        MAX(u.id) as user_id,
        GREATEST(MAX(i.interest_paid), 0) as interest_paid, 
        GREATEST(MAX(i.principle_paid), 0) as principle_paid,                
        GREATEST(MAX(i.principle_installment), 0) as principle_installment,         
        GREATEST(MAX(i.interest_installment), 0) as interest_installment,
        GREATEST(MAX(CASE WHEN i.installment = l.given_installment THEN i.paid ELSE 0 END), 0) as paid,
        GREATEST(MAX(l.per_installment) - GREATEST(MAX(CASE WHEN i.installment = l.given_installment THEN i.paid ELSE 0 END), 0), 0) as outstanding_balance,
        MIN(l.installment_due) as next_installment,
        MAX(i.given_at) as last_payment_date,
        l.closed_at,
        MAX(l.loan_interest) as interest_rate,
        CASE 
            WHEN lp.type_interest = 'flatrate' THEN GREATEST(MAX(l.interest), 0)
            ELSE GREATEST(MAX(l.overdue_balance), 0) 
        END AS overdue_balance,
        CASE 
            WHEN lp.type_interest = 'flatrate' THEN GREATEST(MAX(l.principle), 0) + GREATEST(MAX(l.interest), 0)
            ELSE GREATEST(MAX(l.principle), 0) + GREATEST(MAX(l.overdue_balance), 0) 
        END AS total_remaining
    FROM 
        loan l
    LEFT JOIN 
        loan_plan lp ON lp.id = l.plan_id
    LEFT JOIN 
        loan_contract lc ON lc.loan_id = l.id
    LEFT JOIN 
        system_users u ON l.user_id = u.id
    LEFT JOIN 
        loan_installment i ON i.loan_id = l.id
    ${whereClause}
    GROUP BY 
        l.id
    ORDER BY 
        l.created_at DESC
    LIMIT 
        ? OFFSET ?
      `;

  try {
    const totalResult = await AppDataSource.query(countQuery, parameters);
    const _total = parseInt(totalResult[0].total);

    const loans = await AppDataSource.query(loansQuery, parameters);
    loans.forEach((loan) => {
      loan.interest_rate = Number(loan.interest_rate) + Number(loan.application_percent_charge);
    });
    if (loans.length === 0) return res.error("ไม่พบรายการสินเชื่อ");

    const total_loan = loans.length;
    const total_sum = loans.reduce(
      (acc, loan) => {
        acc.amount += Number(loan.amount || 0);
        acc.remaining += Number(loan.remaining || 0);
        acc.overdue_balance += Number(loan.overdue_balance || 0);
        acc.outstanding_balance += Number(loan.outstanding_balance || 0);
        acc.per_installment += Number(loan.per_installment || 0);
        acc.per_installment2 += Number(loan.per_installment2 || 0);
        acc.paid += Number(loan.paid || 0);
        acc.total_remaining += Number(loan.total_remaining || 0);
        return acc;
      },
      {
        amount: 0,
        remaining: 0,
        overdue_balance: 0,
        outstanding_balance: 0,
        per_installment: 0,
        per_installment2: 0,
        paid: 0,
        total_remaining: 0,
      }
    );

    const total = {
      total_loan,
      ...total_sum,
    };

    return res.success("Get Loan", { data: loans, total }, _total);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// -------------------------------- loan detail -------------------------------- //

// interface FileReference {
//   ref_id: number;
//   name: string;
// }
// interface FileReferenceWithBase64 extends FileReference {
//   base64?: string;
// }
// interface ApplicationForm {
//   [key: string]: string | FileReference;
// }
// interface UpdatedApplicationForm {
//   [key: string]: string | FileReferenceWithBase64;
// }

export const get_loanDetail = async (req, res) => {
  const { id } = req.params;
  const _loanId = parseInt(id) || -1;

  const query = `
        SELECT l.*, lp.name as planname, lp.type_interest,
        u.titlename, u.firstname, u.lastname, u.citizen_id, u.birthdate, u.address,
        u.houseno, u.villageno, u.lane, u.road, u.subdistrict, u.district, u.province, u.zipcode,
        u.job_company_name, u.job_houseno, u.job_villageno, u.job_lane, u.job_road, u.job_subdistrict,
        u.job_district, u.job_province, u.job_zipcode
        FROM loan l
        LEFT JOIN loan_plan lp ON lp.id = l.plan_id
        LEFT JOIN system_users u ON l.user_id = u.id
        WHERE l.id = ? 
        `;
  try {
    const result = await AppDataSource.query(query, [_loanId]);
    if (result.length === 0) return res.error("Loan not found");
    const loan = result[0];

    let application_form: any = {};
    let updatedApplicationForm: any = {};

    if (loan.application_form) {
      try {
        application_form = JSON.parse(loan.application_form);

        const fileManagers = await orm(File_Manager).find({
          where: { ref_id: loan.id },
        });

        for (const [key, value] of Object.entries(application_form)) {
          if (
            typeof value === "object" &&
            "ref_id" in value &&
            "name" in value
          ) {
            const fileReference = value as { ref_id: number; name: string };
            const fileManager = fileManagers.find(
              (fm) => fm.name === fileReference.name
            );
            if (fileManager) {
              updatedApplicationForm[key] = {
                ...fileReference,
                base64: fileManager.base64,
              };
            } else {
              updatedApplicationForm[key] = fileReference;
            }
          } else {
            updatedApplicationForm[key] = value;
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    } else {
      updatedApplicationForm = {};
    }

    const detailLoan = {
      ...loan,
      profit: Number(loan.receivable) - Number(loan.amount),
      application_form: updatedApplicationForm,
    };

    return res.success("Get Loan Detail", detailLoan);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const edit_loanDetail = async (req, res) => {
  const { id } = req.params;
  const _loanId = parseInt(id) || -1;
  const { guarantee, appForm } = req.body;

  try {
    const loan = await orm(Loan).findOne({ where: { id: _loanId } });
    if (!loan) return res.error("Loan not found");

    if (guarantee) {
      loan.guarantee = guarantee;
    }

    if (appForm) {
      const currentForm = JSON.parse(loan.application_form) || {};
      const applicationForms = await orm(Application_Form).find({
        where: { plan_id: loan.plan_id },
        order: { index: "ASC" },
      });

      for (let field of applicationForms) {
        const fieldValue = appForm[field.field_name];

        if (field.type.toLowerCase() === "file" && fieldValue) {
          let base64Data;
          if (
            typeof fieldValue === "string" &&
            fieldValue.startsWith("data:")
          ) {
            base64Data = fieldValue;
          } else if (typeof fieldValue === "object" && fieldValue.base64) {
            base64Data = fieldValue.base64;
          } else {
            return res.error(`Invalid file data for ${field.label}`);
          }

          const allowedExtensions = field.extensions;
          if (!validateMimetype(base64Data, allowedExtensions)) {
            return res.error(
              `ประเภทไฟล์ไม่ถูกต้องสำหรับ ${field.label
              }. ประเภทไฟล์ที่อนุญาต: ${allowedExtensions.join(", ")}`
            );
          }

          const processedImage = await reSizeBase64(base64Data);

          const fileManager = await orm(File_Manager).findOne({
            where: { ref_id: loan.id, name: field.field_name },
          });

          if (fileManager) {
            fileManager.base64 = processedImage;
            await orm(File_Manager).save(fileManager);
          } else {
            const newFileManager = new File_Manager();
            newFileManager.ref_id = loan.id;
            newFileManager.folder_id = `loan_${loan.id}`;
            newFileManager.name = field.field_name;
            newFileManager.base64 = processedImage;
            await orm(File_Manager).save(newFileManager);
          }
        } else if (field.type.toLowerCase() !== "file") {
          currentForm[field.field_name] =
            fieldValue || currentForm[field.field_name];
        }
      }

      loan.application_form = JSON.stringify(currentForm);
    }

    await orm(Loan).save(loan);

    const updatedFileManagers = await orm(File_Manager).find({
      where: { ref_id: loan.id },
    });

    const response = {
      ...loan,
      fileManagers: updatedFileManagers,
    };

    return res.success("Update Loan Detail", response);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const get_installments = async (req, res) => {
  const { id } = req.params;
  const _loanId = parseInt(id) || -1;
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;

  try {
    const loan = await orm(Loan).findOne({ where: { id: _loanId } });
    if (!loan) return res.error("Loan not found");

    const loanPlan = await orm(LoanPlan).findOne({
      where: { id: loan.plan_id },
    });
    if (!loanPlan) return res.error("Loan Plan not found");

    const totalInstallments = await orm(Installment).count({
      where: { loan_id: loan.id },
    });
    const installments = await orm(Installment).find({
      where: { loan_id: _loanId },
      order: { id: "asc" },
      take: perPage,
      skip: offset,
    });

    const selectedRate = loanPlan.rate.find(
      (r) => Number(r.installment) === loan.total_installment
    );
    // const interestRate =
    //   Number(selectedRate.interest_rate) +
    //   Number(loanPlan.application_percent_charge);

    const interestRate =
      Number(loan.loan_interest) + Number(loanPlan.application_percent_charge);

    // const {
    //   days,
    //   delay_charge,
    //   delay_times,
    //   delay_days,
    //   interest_remaining,
    //   interest,
    //   principle,
    //   mini_pay,
    //   max_pay,
    //   close_pay,
    // } = paymentCalculator(
    //   loan.amount,
    //   loan.remaining,
    //   interestRate,
    //   selectedRate.installment,
    //   loan.installment_start,
    //   new Date(),
    //   0,
    //   loan.overdue_balance,
    //   loan.given_installment + 1,
    //   30,
    //   loanPlan.delay_days,
    //   loanPlan.delay_charge
    // );
    const loan_summary = {
      loan_number: loan.loan_number,
      plan: loanPlan.name,
      amount: Number(loan.amount),
      per_installment: Number(loan.per_installment),
      total_installment: Number(loan.total_installment),
      given_installment: Number(loan.given_installment) + 1,
      receivable: Number(loan.receivable),
      delay_value: Number(loanPlan.delay_value),
      total_paid: Number(loan.total_paid),
      remaining: Number(loan.remaining),
      interest: Number(loan.interest),
      installment_start: loan.installment_start,
      installment_due: loan.installment_due,
      interestRate: interestRate,
      overdue_balance: Number(loan.overdue_balance),
      status: loan.status,
      pay_days: 30,
      delay_days: loanPlan.delay_days,
      delay_charge: loanPlan.delay_charge,
      approved_at: loan.approved_at,
      startDate: loan.startDate,
      type_interest: loanPlan.type_interest,
      // principle,
      // interest,
      // interest_remaining,
      // delay_charge,
      // delay_times,
      // delay_days,
      // days,
      // close_pay,
      // mini_pay,
      // max_pay,
    };

    return res.success(
      "Get installment LoanId",
      { loan_summary, installment: installments },
      totalInstallments
    );
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.message);
  }
};

// --------------------------- approve & rejecy loan --------------------------- //

export const approveLoan = async (req, res) => {
  const { reference } = req.params;
  const { ...obj } = req.body;

  try {
    // ค้นหาสินเชื่อทั้งหมดที่มี reference ตรงกันและสถานะ Pending
    const loans = await orm(Loan).find({
      where: { reference: reference, status: loan_status.Pending },
    });
    if (loans.length === 0) return res.error("Loan not found");

    for (let loan of loans) {
      const user = await orm(Users).findOne({ where: { id: loan.user_id } });
      const loanPlan = await orm(LoanPlan).findOne({
        where: { id: loan.plan_id },
      });
      if (!loanPlan) return res.error("Plan not found");
      const loanContract = await orm(LoanContract).findOne({
        where: { loan_id: loan.id },
      });

      const selectedInstallment = parseInt(loan.total_installment);
      const selectedRate = loanPlan.rate.find(
        (r) => Number(r.installment) === selectedInstallment
      );
      // const interestRate =
      //   Number(selectedRate.interest_rate) +
      //   Number(loanPlan.application_percent_charge);

      const interestRate =
        Number(loan.loan_interest) +
        Number(loanPlan.application_percent_charge);

      const applicationAnnualRate =
        Number(loanPlan.application_percent_charge) / 100;

      const beforeRemaining = Number(loan.remaining);

      loan.status = loan_status.Running;
      loan.approved_at = loan.approved_at ? loan.approved_at : new Date();
      loan.admin_approve = `${req.user.titlename} ${req.user.firstname} ${req.user.lastname}`;

      loan.installment_start = loan.installment_start
        ? loan.installment_start
        : new Date();
      if (!loan.installment_due) {
        let nextMonthDate = new Date(loan.installment_start);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        loan.installment_due = nextMonthDate;
      }

      loan.startDate = loan.startDate ? loan.startDate : loan.installment_due;
      if (!loan.endDate) {
        loan.endDate = new Date();
        loan.endDate.setMonth(
          loan.endDate.getMonth() + Number(selectedRate.installment)
        );
      }

      loan.last_alert_date = loan.installment_due;

      loan.guarantee = obj.guarantee;

      const data = new LoanContract();
      data.user_id = loan.user_id;
      data.loan_id = loan.id;
      data.installment_start = loan.startDate;
      data.installment_end = loan.endDate;
      data.stamp =
        loanPlan.stamp == 0 ? 0 : Number(loan.amount) / Number(loanPlan.stamp);
      data.document = Number(loanPlan.document);

      await orm(LoanContract).save(data);

      await loan.createLog(req, "approve", "loan", {
        status: loan.status,
        approve: loan.approved_at,
      });
      await orm(Loan).save(loan);

      const {
        delay_days,
        delay_charge,
        principle,
        interest,
        interest_due,
        paid_principle,
        paid_interest,
        days,
        daysInYear,
        principle_remaining,
        interest_remaining,
        installment,
        ...props
      } = paymentCalculator({
        type_interest: loanPlan.type_interest,
        amount: loan.amount,
        remaining: Number(loan.remaining),
        interest_rate: interestRate,
        total_installment: loan.total_installment,
        installment_start: loan.installment_start,
        installment_due: loan.installment_due,
        payment_date: loan.installment_due,
        pay: loan.per_installment,
        interest_stack: loan.overdue_balance,
        installment: Number(loan.given_installment) + 1,
        pay_days: 30,
        delay_days: loanPlan.delay_value,
        delay_charge: loanPlan.fixed_charge,
      });

      const { installment: valueInstallment } = await installmentRemaining({
        loan_id: loan.id,
        amount: loan.amount,
        rate: interestRate,
        installment: loan.total_installment,
        start: loan.startDate,
        created: loan.approved_at,
        given_at: Number(loan.given_installment),
        type_interest: loanPlan.type_interest
      });
      const [firstInstallment, nextInstallment] = valueInstallment;

      const applicationFee =
        (beforeRemaining * (applicationAnnualRate * days)) / daysInYear;

      const _installment = new Installment();
      _installment.receipt_number = await generateReceiptNumber(loanPlan.id);
      _installment.plan_id = loanPlan.id;
      _installment.user_id = loan.user_id;
      _installment.loan_id = loan.id;
      _installment.loan_number = loan.loan_number;
      _installment.installment_date = new Date(loan.installment_due);
      _installment.start_date = loan.installment_start;
      _installment.per_installment = firstInstallment.pay_per_month;
      _installment.amount = loan.amount;
      _installment.remaining = firstInstallment.remaining;
      _installment.principle = Number(loan.principle) - firstInstallment.principle;
      _installment.outstanding_balance = firstInstallment.remaining;
      _installment.overdue_balance = 0;
      _installment.installment = 1;
      _installment.total_installment = loan.total_installment;
      _installment.isPaid = false;
      // _installment.given_at = new Date();
      _installment.paid = loan.per_installment;
      _installment.delay_days = 0;
      _installment.per_installment = firstInstallment.pay_per_month;
      _installment.principle_installment = firstInstallment.principle;
      _installment.interest_installment = firstInstallment.interest;
      _installment.principle_paid = firstInstallment.principle;
      _installment.interest_paid = firstInstallment.interest;
      _installment.delay_charge_paid = 0;
      _installment.paid_by = `${user.firstname} - ${user.lastname}`;

      _installment.interest_due = firstInstallment.interest;

      _installment.total_interest = Number(loan.interest) - Number(firstInstallment.interest);

      if (nextInstallment) {
        _installment.principle_next_due = nextInstallment.principle
        _installment.interest_next_due = nextInstallment.interest
        _installment.total_amount_next_due = nextInstallment.remaining;
        _installment.installment_next_due = nextInstallment.date;
      }
      _installment.transfer_payment = 0;

      if (applicationFee < 0) {
        _installment.application_charge = 0;
      } else {
        _installment.application_charge =
          Math.round((applicationFee + Number.EPSILON) * 100) / 100;
      }
      await orm(Installment).save(_installment);

      const name = `${user.firstname} ${user.lastname}`;

      const formattedInstallmentDate = new Intl.DateTimeFormat("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date());

      await Line_Approve(
        user.line_id,
        loanPlan.name,
        loan.loan_number,
        toTHB(loan.amount),
        `${loan.total_installment.toString()} งวด`,
        name,
        formattedInstallmentDate
      );

      // if (user.email) {
      //   const subject = "การขอสินเชื่อได้รับการอนุมัติแล้ว";
      //   const firstpay = loan.installment_due;
      //   const htmlContent = ApproveRejectLoan_notificate(
      //     user,
      //     loan,
      //     loanPlan,
      //     interestRate,
      //     subject,
      //     toDate(new Date(firstpay).toISOString(), 1),
      //     null
      //   );
      //   sendNotificationEmail(user.email, subject, htmlContent, loan.user_id);
      // }
    }

    return res.success("Loans approved successfully", { loans });
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const rejectLoan = async (req, res) => {
  const { reference } = req.params;
  const { reject_reason } = req.body;

  try {
    // ค้นหาสินเชื่อทั้งหมดที่มี reference ตรงกันและสถานะ Pending
    const loans = await orm(Loan).find({
      where: { reference: reference, status: loan_status.Pending },
    });
    if (loans.length === 0) return res.error("Loan not found");

    for (let loan of loans) {
      const user = await orm(Users).findOne({ where: { id: loan.user_id } });
      const loanPlan = await orm(LoanPlan).findOne({
        where: { id: loan.plan_id },
      });
      if (!loanPlan) return res.error("Plan not found");

      loan.status = loan_status.Rejected;
      loan.admin_approve = req.user.username;
      loan.reject_reason = reject_reason;

      await loan.createLog(req, "reject", "loan", {
        status: loan.status,
        reject_reason: loan.reject_reason,
      });
      await orm(Loan).save(loan);

      const name = `${user.firstname} ${user.lastname}`;

      await Line_Reject(
        user.line_id,
        loanPlan.name,
        toTHB(loan.amount),
        name,
        reject_reason
      );

      // if (user.email) {
      //   const subject = "การขอสินเชื่อถูกปฏิเสธ";
      //   const htmlContent = ApproveRejectLoan_notificate(
      //     user,
      //     loan,
      //     loanPlan,
      //     null,
      //     subject,
      //     null,
      //     reject_reason
      //   );
      //   sendNotificationEmail(user.email, subject, htmlContent, loan.user_id);
      // }
    }

    return res.success("Loans approved successfully", { loans });
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const badLoan = async (req, res) => {
  const { id } = req.params;
  const _loanId = parseInt(id) || -1;
  const { created_at, updated_at, deleted_at, ...obj } = req.body;
  try {
    const loan = await orm(Loan).findOne({ where: { id: _loanId } });
    if (!loan) return res.error("Loan not found");
    const loanPlan = await orm(LoanPlan).findOne({
      where: { id: loan.plan_id },
    });
    if (!loanPlan) return res.error("Plan not found");

    // if (!obj.admin_feedback) return res.error('Please feedback')

    loan.status = loan_status.Bad;
    loan.closed_at = new Date();
    // loan.admin_feedback = obj.admin_feedback;

    await loan.createLog(req, "update", "loan", {
      status: loan.status,
      feedback: loan.admin_feedback,
    });
    await orm(Loan).save(loan);

    return res.success("Loan Bad successfully", loan);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// export const removeLoan = async (req, res) => {
//   const { loan_id } = req.params;
//   const _loanId = parseInt(loan_id) || -1;

//   try {
//     const loan = await orm(Loan).findOne({ where: { id: _loanId } });
//     if (!loan) return res.error("ไม่พบสินเชื่อ");

//     await AppDataSource.transaction(async (transactionManager) => {
//       const loanContracts = await transactionManager.find(LoanContract, {
//         where: { loan_id: loan.id },
//       });
//       const installments = await transactionManager.find(Installment, {
//         where: { loan_id: loan.id },
//       });
//       // const guarantees = await transactionManager.find(LoanGuarantee, {
//       //   where: { loan_id: loan.id },
//       // });
//       const taxes = await transactionManager.find(Tax, {
//         where: { loan_id: loan.id },
//       });

//       await transactionManager.remove(LoanContract, loanContracts);
//       await transactionManager.remove(Installment, installments);
//       // await transactionManager.remove(LoanGuarantee, guarantees);
//       await transactionManager.remove(Tax, taxes);
//       await transactionManager.remove(Loan, loan);
//     });

//     return res.success("ลบสินเชื่อและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว");
//   } catch (err) {
//     console.log(err);
//     return res.error(err.detail || err.routine);
//   }
// };
export const removeLoan = async (req, res) => {
  const { reference } = req.params; 

  try {
    const loans = await orm(Loan).find({ where: { reference } }); 
    if (!loans.length) return res.error("ไม่พบสินเชื่อที่มี reference นี้");

    await AppDataSource.transaction(async (transactionManager) => {
      for (const loan of loans) {
        const loanContracts = await transactionManager.find(LoanContract, {
          where: { loan_id: loan.id },
        });
        const installments = await transactionManager.find(Installment, {
          where: { loan_id: loan.id },
        });

        const taxes = await transactionManager.find(Tax, {
          where: { loan_id: loan.id },
        });

        await transactionManager.remove(LoanContract, loanContracts);
        await transactionManager.remove(Installment, installments);
        await transactionManager.remove(Tax, taxes);
        await transactionManager.remove(Loan, loan);
      }
    });

    return res.success("ลบสินเชื่อและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว");
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};


// ----------------------------- สมัครสินเชื่อโดย admin ----------------------------- //
export const takeLoan_admin = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const _planId = parseInt(obj.plan_id) || -1;

  try {
    const user = await orm(Users).findOne({ where: { id: obj.user_id } });
    if (user && user.kyc !== "verified") return res.error("กรุณายืนยันตัวตน");
    if (!user) return res.error("ไม่พบผู้ใช้");

    const loanPlan = await orm(LoanPlan).findOne({ where: { id: _planId } });
    if (!loanPlan) return res.error("ไม่พบแผนสินเชื่อ");

    if (
      Number(obj.amount) < Number(loanPlan.minimum_amount) ||
      Number(obj.amount) > Number(loanPlan.maximum_amount)
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

    const createLoan = async (
      amount,
      reference,
      loan_ducument,
      loan_ducument_max
    ) => {
      let interestRateToUse = interestRate;

      // กำหนดดอกเบี้ย 28% สำหรับสินเชื่อที่ 2
      if (interestRate > 32) {
        // ถ้าเกิน 30% ให้กำหนดอัตราดอกเบี้ยสำหรับสินเชื่อที่ 2 เป็น 28%
        if (loan_ducument === 2) {
          interestRateToUse = 28;
        }
      }
      let addInterrest = 0;
      if (loanPlan.type_interest == "flatrate")
        addInterrest =
          (Number(amount) * (Number(interestRate) / 100) * (selectedInstallment / 12))
      const { nor_pay, principle_remaining } = paymentCalculator({
        type_interest: loanPlan.type_interest,
        amount: amount,
        remaining: Number(amount) + addInterrest,
        interest_rate: interestRateToUse,
        total_installment: selectedRate.installment,
        installment_start: obj.createDate,
        payment_date: obj.startDate,
      });

      const {
        total_interest,
        total_receive,
        installment: valueInstallment,
      } = await installmentRemaining({
        type_interest: loanPlan.type_interest,
        amount: amount,
        rate: interestRateToUse,
        installment: selectedRate.installment,
        start: obj.startDate,
        created: obj.createDate,
        given_at: 0,
      });

      let totalAmount = Number(amount);

      let __createDate = obj?.createDate ? new Date(obj.createDate) : null;
      let __startDate = obj?.startDate ? new Date(obj.startDate) : null;
      let __endDate = new Date(__startDate);
      __endDate.setMonth(
        __endDate.getMonth() + Number(selectedRate.installment - 1)
      );
      const loan = new Loan();
      loan.loan_number = await generateLoanNumber(_planId);
      loan.startDate = __startDate;
      loan.endDate = __endDate;
      loan.user_id = obj.user_id;
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
      loan.installment_start = __createDate;
      loan.installment_due = __startDate;
      loan.status = loan_status.Pending;

      loan.reference = reference;
      // loan.admin_approve = req.user.username;

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
                return res.error(
                  `ประเภทไฟล์ไม่ถูกต้องสำหรับ ${field.label
                  }. ประเภทไฟล์ที่อนุญาต: ${allowedExtensions.join(", ")}`
                );
              }

              const processedImage = await reSizeBase64(fieldValue);

              const fileManager = new File_Manager();
              fileManager.ref_id = loan.id;
              fileManager.folder_id = `loan_${loan.id}`;
              fileManager.name = `${field.field_name}`;
              fileManager.base64 = processedImage;

              fileUploads.push(fileManager);

              formData[field.field_name] = {
                ref_id: fileManager.ref_id,
                name: fileManager.name,
              };
            }
            break;
          case "select":
            if (
              Array.isArray(field.options) &&
              field.options.includes(fieldValue)
            ) {
              formData[field.field_name] = fieldValue;
            } else {
              return res.error(`Invalid option for ${field.field_name}`);
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
      data.user_id = loan.user_id;
      data.loan_id = loan.id;
      data.installment_start = loan.startDate;
      data.installment_end = loan.endDate;
      data.stamp =
        loanPlan.stamp == 0 ? 0 : Number(loan.amount) / Number(loanPlan.stamp);
      data.document = Number(loanPlan.document);

      await orm(LoanContract).save(data);

      // const _installment = new Installment();
      // _installment.user_id = loan.user_id;
      // _installment.loan_id = loan.id;
      // _installment.loan_number = loan.loan_number;
      // _installment.installment_date = new Date(loan.installment_due);
      // _installment.start_date = loan.installment_start;
      // _installment.per_installment = loan.per_installment;
      // _installment.amount = loan.amount;
      // _installment.remaining = principle_remaining;
      // _installment.overdue_balance = 0;
      // _installment.installment = 1;
      // _installment.total_installment = loan.total_installment;
      // _installment.isPaid = true;
      // _installment.given_at = obj.paymentDate
      //   ? new Date(obj.paymentDate)
      //   : new Date();
      // _installment.paid = 0;
      // _installment.delay_days = 0;
      // _installment.per_installment = loan.per_installment;
      // _installment.principle_installment = 0;
      // _installment.interest_installment = 0;
      // _installment.principle_paid = 0;
      // _installment.interest_paid = 0;
      // _installment.delay_charge_paid = 0;
      // _installment.paid_by = `${user.firstname} - ${user.lastname}`;

      // await orm(Installment).save(_installment)
    };

    const reference = generateReference(new Date(), obj.user_id);

    const loan_document_max = loanParts.length;

    for (let i = 0; i < loanParts.length; i++) {
      await createLoan(loanParts[i], reference, i + 1, loan_document_max);
    }

    // if (user.email) {
    //   try {
    //     const subject = "การขอสินเชื่อสำเร็จ";
    //     const htmlContent = takeloan_notificate(
    //       user,
    //       obj,
    //       loanPlan,
    //       interestRateToUse
    //     );
    //     sendNotificationEmail(user.email, subject, htmlContent, obj.user_id);
    //   } catch (error) {
    //     return res.error("การขอสินเชื่อสำเร็จ แต่การส่งอีเมลแจ้งล้มเหลว");
    //   }
    // }

    return res.success("บันทึกการขอสินเชื่อสำเร็จ");
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};
// export const takeLoan_admin = async (req, res) => {
//   const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
//   const _planId = parseInt(obj.plan_id) || -1;

//   try {
//     const user = await orm(Users).findOne({ where: { id: obj.user_id } });
//     if (user && user.kyc !== "verified") return res.error("กรุณายืนยันตัวตน");
//     if (!user) return res.error("ไม่พบผู้ใช้");

//     const loanPlan = await orm(LoanPlan).findOne({ where: { id: _planId } });
//     if (!loanPlan) return res.error("ไม่พบแผนสินเชื่อ");

//     if (
//       Number(obj.amount) < Number(loanPlan.minimum_amount) ||
//       Number(obj.amount) > Number(loanPlan.maximum_amount)
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


//     // เริ่มสร้างสินเชื่อ
//     let totalAmount = Number(obj.amount);
//     let addInterrest = 0;

//     // คำนวณดอกเบี้ยเพิ่มเติมหากเป็น Flatrate
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
//       installment_start: obj.createDate,
//       payment_date: obj.startDate,
//     });

//     const {
//       total_interest,
//       total_receive,
//     } = await installmentRemaining({
//       type_interest: loanPlan.type_interest,
//       amount: totalAmount,
//       rate: interestRate,
//       installment: selectedRate.installment,
//       start: obj.startDate,
//       created: obj.createDate,
//       given_at: 0,
//     });

//     let __createDate = obj?.createDate ? new Date(obj.createDate) : null;
//     let __startDate = obj?.startDate ? new Date(obj.startDate) : null;
//     let __endDate = new Date(__startDate);
//     __endDate.setMonth(
//       __endDate.getMonth() + Number(selectedRate.installment - 1)
//     );

//     // สร้างสินเชื่อ
//     const loan = new Loan();
//     loan.loan_number = await generateLoanNumber(_planId);
//     loan.startDate = __startDate;
//     loan.endDate = __endDate;
//     loan.user_id = obj.user_id;
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
//     loan.approved_at = __createDate;
//     loan.installment_start = __createDate;
//     loan.installment_due = __startDate;
//     loan.status = loan_status.Pending;

//     loan.reference = generateReference(new Date(), obj.user_id);
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

//     return res.success("บันทึกการขอสินเชื่อสำเร็จ");
//   } catch (err) {
//     console.log(err);
//     return res.error(err.detail || err.routine);
//   }
// };






// export const editInstallment = async (req, res) => {
//   const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
//   const _loanId = parseInt(obj.loan_id) || -1;

//   try {
//     const loan = await orm(Loan).findOne({
//       where: {
//         id: _loanId,
//         approved_at: Not(IsNull()),
//         status: Not(loan_status.Pending),
//       },
//     });
//     if (!loan) return res.error("Loan not found");
//     else if (loan.status === loan_status.Paid)
//       return res.error("รายการนี้ชำระสินเชื่อครบจำนวนแล้ว");
//     else if (loan.status === loan_status.Rejected)
//       return res.error("รายการนี้ถูกปฎิเศษ");
//     else if (loan.status === loan_status.Bad)
//       return res.error("รายการนี้ถูกปรับเป็นหนี้สูญ");

//     const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id } });

//     const user = await orm(Users).findOne({ where: { id: loan.user_id } });
//     if (!user) return res.error("ลูกหนี้ไม่มีอยู่ในระบบ");

//     let paidAmount = Number(obj.paidAmount);
//     if (paidAmount <= 0) return res.error("ยอดชำระต้องไม่น้อยกว่า 0");

//     const paidDate = obj.paymentDate ? obj.paymentDate : null;
//     if (
//       new Date(loan.installment_start).getTime() > new Date(paidDate).getTime()
//     )
//       return res.error("ไม่สามารถชำระค่าบริการ ในวันที่ ต่ำกว่าวันนับชำระได้");

//     const interestRate =
//       Number(loan.loan_interest) + Number(plan.application_percent_charge);

//     const applicationAnnualRate = Number(plan.application_percent_charge) / 100;

//     const beforeRemaining = Number(loan.remaining);

//     const {
//       delay_days,
//       delay_charge,
//       principle,
//       interest,
//       interest_due,
//       paid_principle,
//       paid_interest,
//       days,
//       daysInYear,
//       principle_remaining,
//       interest_remaining,
//       installment,
//       ...props
//     } = paymentCalculator({
//       type_interest: plan.type_interest,
//       amount: loan.amount,
//       remaining: loan.remaining,
//       interest_rate: interestRate,
//       total_installment: loan.total_installment,
//       installment_start: loan.installment_start,
//       installment_due: loan.installment_due,
//       payment_date: paidDate,
//       pay: paidAmount,
//       interest_stack: loan.overdue_balance,
//       installment: Number(loan.given_installment) + 1,
//       pay_days: 30,
//       delay_days: plan.delay_value,
//       delay_charge: plan.fixed_charge,
//     });

//     if (principle_remaining < 0)
//       return res.error("กรุณาชำระจำนวนที่ถูกต้อง และ ไม่เกินยอดคงเหลือ");

//     const applicationFee =
//       (beforeRemaining * (applicationAnnualRate * days)) / daysInYear;

//     let _installment = await orm(Installment).findOne({
//       where: { isPaid: false, loan_id: loan.id },
//       order: { created_at: "DESC" },
//     });
//     if (!_installment) _installment = new Installment();
//     const beforeInterest = Number(_installment.interest_installment || 0);
//     _installment.receipt_number = _installment.receipt_number;
//     _installment.plan_id = plan.id;
//     _installment.user_id = loan.user_id;
//     _installment.loan_id = loan.id;
//     _installment.loan_number = loan.loan_number;
//     _installment.installment_date = new Date(loan.installment_due);
//     _installment.start_date = loan.installment_start;
//     _installment.per_installment = loan.per_installment;
//     _installment.amount = loan.amount;
//     _installment.remaining = principle_remaining;
//     _installment.overdue_balance = interest_remaining;
//     _installment.outstanding_balance = principle_remaining;
//     _installment.installment = installment;
//     _installment.total_installment = loan.total_installment;
//     _installment.isPaid = true;
//     _installment.given_at = obj.paymentDate
//       ? new Date(obj.paymentDate)
//       : new Date();
//     _installment.paid = paidAmount;
//     _installment.delay_days = delay_days > 0 ? delay_days : 0;

//     _installment.principle_paid = paid_principle;
//     _installment.interest_paid = paid_interest;
//     _installment.delay_charge_paid = delay_charge;
//     _installment.paid_by = `${user.firstname} - ${user.lastname}`;
//     _installment.per_installment = loan.per_installment;
//     _installment.principle_installment = principle;
//     _installment.interest_installment = interest;
//     _installment.interest_due = interest_due;

//     if (obj.type === "cash") {
//       _installment.type = "เงินสด";
//       _installment.cash = paidAmount;
//     } else {
//       _installment.transfer_payment = paidAmount;
//     }

//     if (applicationFee < 0) {
//       _installment.application_charge = 0;
//     } else {
//       _installment.application_charge =
//         Math.round((applicationFee + Number.EPSILON) * 100) / 100;
//     }

//     await orm(Installment).save(_installment);

//     const tax = new Tax();
//     tax.user_id = loan.user_id;
//     tax.loan_id = loan.id;
//     tax.loan_number = loan.loan_number;
//     tax.principle = paid_principle;
//     tax.interest = paid_interest;
//     tax.interest_rate = loan.loan_interest;
//     tax.installment_id = _installment.id;

//     tax.tax_business =
//       Math.round(((paid_interest * 3) / 100 + Number.EPSILON) * 100) / 100;
//     tax.tax_local =
//       Math.round(
//         ((((paid_interest * 3) / 100) * 10) / 100 + Number.EPSILON) * 100
//       ) / 100;
//     tax.total_tax =
//       Math.round((tax.tax_business + tax.tax_local + Number.EPSILON) * 100) /
//       100;
//     await orm(Tax).save(tax);
//     const startInstallment = loan.approved_at;
//     if (days >= 0) {
//       let _nextStart = new Date(loan.installment_due);
//       let _nextDue = new Date(loan.installment_due);
//       loan.given_installment = installment;
//       // if (days >= 25) {
//       _nextDue.setMonth(_nextDue.getMonth() + 1);
//       loan.installment_start = _nextStart;
//       loan.installment_due = _nextDue;

//       loan.last_alert_date = _nextDue;
//       loan.given_installment = installment;
//       // }
//     }

//     loan.principle = principle_remaining;
//     loan.remaining = principle_remaining;

//     loan.overdue_balance = interest_remaining;
//     loan.total_paid = Number(loan.total_paid) + Number(paidAmount);
//     if (principle_remaining <= 0) {
//       loan.status = loan_status.Paid;
//       loan.closed_at = paidDate;
//     }


//     if (
//       loan.given_installment >= loan.total_installment &&
//       loan.remaining > 0
//     ) {
//       const _installment = new Installment();
//       const {
//         delay_days,
//         delay_charge,
//         principle,
//         interest,
//         interest_due,
//         paid_principle,
//         paid_interest,
//         days,
//         daysInYear,
//         principle_remaining,
//         interest_remaining,
//         installment,
//         ...props
//       } = paymentCalculator({
//         type_interest: plan.type_interest,
//         amount: loan.amount,
//         remaining: loan.remaining,
//         interest_rate: interestRate,
//         total_installment: loan.total_installment,
//         installment_start: loan.installment_start,
//         installment_due: loan.installment_due,
//         payment_date: loan.installment_due,
//         pay: loan.remaining,
//         interest_stack: loan.overdue_balance,
//         installment: Number(loan.given_installment) + 1,
//         pay_days: 30,
//         delay_days: plan.delay_value,
//         delay_charge: plan.fixed_charge,
//       });

//       _installment.receipt_number = await generateReceiptNumber(plan.id);
//       _installment.plan_id = plan.id;
//       _installment.user_id = loan.user_id;
//       _installment.loan_id = loan.id;
//       _installment.loan_number = loan.loan_number;
//       _installment.installment_date = loan.installment_due;
//       _installment.start_date = loan.installment_start;
//       _installment.per_installment = loan.remaining;
//       _installment.amount = loan.amount;
//       _installment.remaining = 0;
//       _installment.overdue_balance = interest_remaining;
//       _installment.installment = installment;
//       _installment.total_installment = loan.total_installment;
//       _installment.isPaid = false;
//       _installment.paid = Number(loan.remaining) + paid_interest;
//       _installment.delay_days = delay_days > 0 ? delay_days : 0;
//       _installment.principle_installment = principle;
//       _installment.interest_installment = interest;
//       _installment.principle_paid = loan.remaining;
//       _installment.interest_paid = paid_interest;
//       _installment.delay_charge_paid = delay_charge;
//       _installment.paid_by = `${user.firstname} - ${user.lastname}`;

//       _installment.interest_due = interest_due;
//       _installment.total_interest =
//         interest + loan.overdue_balance - paid_interest;
//       _installment.principle_next_due = null;
//       _installment.interest_next_due = null;
//       _installment.total_amount_next_due = null;
//       _installment.installment_next_due = null;

//       _installment.transfer_payment = 0;

//       if (applicationFee < 0) {
//         _installment.application_charge = 0;
//       } else {
//         _installment.application_charge =
//           Math.round((applicationFee + Number.EPSILON) * 100) / 100;
//       }

//       await orm(Installment).save(_installment);
//       loan.given_installment = installment;
//       loan.installment_start = _installment.start_date;
//       loan.installment_due = _installment.installment_date;
//     } else {
//       await (async (lastPaid) => {

//         const { total_interest, installment: valueInstallment } =
//           await installmentRemaining({
//             loan_id: _loanId,
//             amount: loan.amount,
//             rate: interestRate,
//             installment: loan.total_installment,
//             start: loan.startDate,
//             created: startInstallment,
//             given_at: Number(loan.given_installment),
//             lastPaid: lastPaid,
//             paidDate: paidDate,
//             type_interest: plan.type_interest,
//           });
//         const [firstInstallment, nextInstallment] = valueInstallment;

//         const lastInstallment =
//           Number(loan.given_installment) + 1 == Number(loan.total_installment);
//         // console.log(valueInstallment.length)
//         if (valueInstallment.length && firstInstallment.remaining >= 0) {
//           loan.given_installment = installment;
//           const _installment = new Installment();
//           _installment.receipt_number = await generateReceiptNumber(plan.id);
//           _installment.plan_id = plan.id;
//           _installment.user_id = loan.user_id;
//           _installment.loan_id = loan.id;
//           _installment.loan_number = loan.loan_number;
//           _installment.installment_date = new Date(loan.installment_due);
//           _installment.start_date = loan.installment_start;
//           _installment.per_installment = loan.per_installment;
//           _installment.amount = loan.amount;
//           _installment.remaining = firstInstallment.remaining;
//           _installment.overdue_balance = interest_remaining;
//           _installment.outstanding_balance = firstInstallment.remaining;
//           _installment.installment = installment + 1;
//           _installment.total_installment = loan.total_installment;
//           _installment.isPaid = false;
//           // _installment.given_at = new Date();
//           _installment.paid = firstInstallment.amount;
//           _installment.delay_days = delay_days > 0 ? delay_days : 0;
//           _installment.per_installment = loan.per_installment;
//           _installment.principle_installment = firstInstallment.principle;
//           _installment.interest_installment = firstInstallment.interest;
//           _installment.principle_paid = firstInstallment.principle;
//           _installment.interest_paid = firstInstallment.interest;
//           _installment.delay_charge_paid = delay_charge;
//           _installment.paid_by = `${user.firstname} - ${user.lastname}`;

//           _installment.interest_due = firstInstallment.interest;

//           _installment.total_interest = (total_interest + interest_remaining) - firstInstallment.interest;
//           if (nextInstallment) {
//             _installment.principle_next_due = lastInstallment
//               ? loan.remaining
//               : nextInstallment.remaining;
//             _installment.interest_next_due = nextInstallment.interest;
//             _installment.total_amount_next_due = nextInstallment.remaining;
//             _installment.installment_next_due = nextInstallment.date;
//           }

//           _installment.transfer_payment = 0;

//           if (applicationFee < 0) {
//             _installment.application_charge = 0;
//           } else {
//             _installment.application_charge =
//               Math.round((applicationFee + Number.EPSILON) * 100) / 100;
//           }

//           await orm(Installment).save(_installment);
//         }
//         await (async () => {
//           let _installment = await orm(Installment).findOne({
//             where: { isPaid: true, loan_id: loan.id },
//             order: { created_at: "DESC" },
//           });

//           _installment.total_interest =
//             (beforeInterest + total_interest + interest_remaining) - paid_interest;

//           _installment.principle_next_due = firstInstallment
//             ? firstInstallment.principle
//             : null;
//           _installment.interest_next_due = firstInstallment
//             ? firstInstallment.interest
//             : null;
//           _installment.total_amount_next_due = firstInstallment
//             ? firstInstallment.amount
//             : null;
//           _installment.installment_next_due = firstInstallment
//             ? firstInstallment.date
//             : null;
//           await orm(Installment).save(_installment);
//         })();
//       })(_installment.paid);
//     }
//     await orm(Loan).save(loan);
//     const orders = [
//       {
//         name: "เงินต้น",
//         amount: `${paid_principle.toLocaleString("th-TH", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })} บาท`,
//       },
//       {
//         name: "ดอกเบี้ย",
//         amount: `${paid_interest.toLocaleString("th-TH", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })} บาท`,
//       },
//       {
//         name: "ค่าทวงถาม",
//         amount: `${delay_charge.toLocaleString("th-TH", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })} บาท`,
//       },
//     ];
//     const totalAmount = paid_principle + paid_interest + delay_charge;
//     const sendTotal = `${totalAmount.toLocaleString("th-TH", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })} บาท`;
//     const formattedInstallmentDate = new Intl.DateTimeFormat("th-TH", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     }).format(obj.paymentDate ? new Date(obj.paymentDate) : new Date());

//     const bill = _installment.receipt_number;
//     if (user.la == "enable")
//       Line_SendSlip(
//         user.line_id,
//         plan.name,
//         bill,
//         loan.loan_number,
//         formattedInstallmentDate,
//         `${loan.given_installment}/${loan.total_installment}`,
//         orders,
//         sendTotal,
//         `${user.firstname} ${user.lastname}`
//       );

//     // if (user.email) {
//     //   const subject = "ใบเสร็จการชำระเงิน";
//     //   const htmlContent = payment_notificate(
//     //     user,
//     //     loan,
//     //     plan.name,
//     //     orders,
//     //     sendTotal,
//     //     formattedInstallmentDate,
//     //     bill
//     //   );
//     //   sendNotificationEmail(user.email, subject, htmlContent, user.id);
//     // }

//     return res.success("Payment recorded successfully", {
//       ..._installment,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.error(err.detail || err.routine);
//   }
// };




// ฟังก์ชันหลักสำหรับการชำระเงิน
export const payment = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const _loanId = parseInt(obj.loan_id) || -1;

  try {
    // ตรวจสอบข้อมูลสินเชื่อ
    const loan = await orm(Loan).findOne({
      where: {
        id: _loanId,
        approved_at: Not(IsNull()),
        status: Not(loan_status.Pending),
      },
    });
    if (!loan) return res.error("Loan not found");
    else if (loan.status === loan_status.Paid)
      return res.error("รายการนี้ชำระสินเชื่อครบจำนวนแล้ว");
    else if (loan.status === loan_status.Rejected)
      return res.error("รายการนี้ถูกปฎิเศษ");
    else if (loan.status === loan_status.Bad)
      return res.error("รายการนี้ถูกปรับเป็นหนี้สูญ");

    const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id } });
    const user = await orm(Users).findOne({ where: { id: loan.user_id } });
    if (!user) return res.error("ลูกหนี้ไม่มีอยู่ในระบบ");

    // ตรวจสอบข้อมูลการชำระ
    let paidAmount = Number(obj.paidAmount);
    if (paidAmount <= 0) return res.error("ยอดชำระต้องไม่น้อยกว่า 0");

    const paidDate = obj.paymentDate ? obj.paymentDate : null;
    // if (new Date(loan.installment_start).getTime() > new Date(paidDate).getTime())
    //   return res.error("ไม่สามารถชำระค่าบริการ ในวันที่ ต่ำกว่าวันนับชำระได้");

    // // คำนวณวันกำหนดการชำระลบด้วย 5 วัน
    // const fiveDaysBeforeInstallmentDue = new Date(loan.installment_due);
    // fiveDaysBeforeInstallmentDue.setDate(fiveDaysBeforeInstallmentDue.getDate() - 5);

    // // ตรวจสอบว่า วันที่ชำระ ต้องไม่น้อยกว่าวันกำหนดการชำระลบด้วย 5 วัน
    // if (new Date(paidDate).getTime() < fiveDaysBeforeInstallmentDue.getTime()) {
    //     return res.error("ไม่สามารถชำระค่าบริการก่อนถึงวันกำหนด 5 วันได้");
    // }

    // คำนวณอัตราดอกเบี้ย
    const interestRate = Number(loan.loan_interest) + Number(plan.application_percent_charge);
    const applicationAnnualRate = Number(plan.application_percent_charge) / 100;
    const beforeRemaining = Number(loan.remaining);

    // เลือกฟังก์ชันคำนวณตามประเภทดอกเบี้ย
    let calculator;
    if (plan.type_interest === "flatrate") {
      calculator = flatrateCalculator({
        amount: loan.amount,
        remaining: loan.remaining,
        interest_rate: interestRate,
        total_installment: loan.total_installment,
        installment_start: loan.installment_start,
        payment_date: paidDate,
        pay: paidAmount,
        interest_stack: loan.overdue_balance,
        installment: Number(loan.given_installment) + 1,
        pay_days: 30,
        delay_days: plan.delay_value,
        delay_charge: plan.fixed_charge,
      });
    } else {
      calculator = effectiverateCalculator({
        amount: loan.amount,
        remaining: loan.remaining,
        interest_rate: interestRate,
        total_installment: loan.total_installment,
        installment_start: loan.installment_start,
        payment_date: paidDate,
        pay: paidAmount,
        interest_stack: loan.overdue_balance,
        installment: Number(loan.given_installment) + 1,
        pay_days: 30,
        delay_days: plan.delay_value,
        delay_charge: plan.fixed_charge,
      });
    }

    const {
      delay_days,
      delay_charge,
      principle,
      interest,
      paid_principle,
      paid_interest,
      days,
      daysInYear,
      total_principle,
      principle_remaining,
      interest_remaining,
      installment,
      mini_pay,
      ...props
    } = calculator;

    if (calculator.principle_remaining < 0)
      return res.error("กรุณาชำระจำนวนที่ถูกต้อง และ ไม่เกินยอดคงเหลือ");

    if (plan.type_interest === 'flatrate') {
      if (loan.given_installment + 1 < loan.total_installment &&
        paidAmount > Number(loan.per_installment) +
        Number(loan.overdue_balance) +
        Number(calculator.delay_charge)
      ) {
        return res.error('ไม่สามารถชำระเกินยอดที่กำหนดได้')
      }
    }

    if (paidAmount < calculator.mini_pay) return res.error("ไม่สามารถชำระน้อยกว่ายอดขั้นต่ำได้");

    // คำนวณค่าธรรมเนียม
    const applicationFee = (beforeRemaining * (applicationAnnualRate * calculator.days)) / calculator.daysInYear;

    // บันทึกข้อมูลการชำระ
    let _installment = await orm(Installment).findOne({
      where: { isPaid: false, loan_id: loan.id },
      order: { created_at: "DESC" },
    });
    if (!_installment) _installment = new Installment();

    const beforeInterest = Number(_installment.interest_installment || 0);

    // อัพเดทข้อมูล installment
    _installment.receipt_number = _installment.receipt_number;
    _installment.plan_id = plan.id;
    _installment.user_id = loan.user_id;
    _installment.loan_id = loan.id;
    _installment.loan_number = loan.loan_number;
    _installment.installment_date = new Date(loan.installment_due);
    _installment.start_date = loan.installment_start;
    _installment.per_installment = loan.per_installment;
    _installment.amount = loan.amount;
    _installment.remaining = calculator.principle_remaining;
    _installment.principle = Number(loan.principle) - calculator.paid_principle
    _installment.overdue_balance = calculator.interest_remaining;
    _installment.outstanding_balance = calculator.principle_remaining;
    _installment.installment = calculator.installment;
    _installment.total_installment = loan.total_installment;
    _installment.isPaid = true;
    _installment.given_at = obj.paymentDate ? new Date(obj.paymentDate) : new Date();
    _installment.paid = paidAmount;
    _installment.delay_days = calculator.delay_days > 0 ? calculator.delay_days : 0;
    _installment.principle_paid = calculator.paid_principle;
    _installment.interest_paid = calculator.paid_interest;
    _installment.delay_charge_paid = calculator.delay_charge;
    _installment.paid_by = `${user.firstname} - ${user.lastname}`;
    _installment.per_installment = loan.per_installment;
    _installment.principle_installment = calculator.principle;
    _installment.interest_installment = calculator.interest;
    _installment.interest_due = plan.type_interest === "flatrate" ? 0 : calculator.interest_due;

    if (Number(loan.given_installment + 1) === Number(loan.total_installment) && Number(loan.principle) - calculator.paid_principle > 0) {
      let nextDue = new Date(loan.installment_due);
      nextDue.setMonth(nextDue.getMonth() + 1);

      _installment.principle_next_due = Number(loan.principle) - calculator.paid_principle;
      _installment.interest_next_due = null;
      _installment.total_amount_next_due = Number(loan.principle) - calculator.paid_principle;
      _installment.installment_next_due = nextDue;
    } else if (Number(loan.given_installment + 1) > Number(loan.total_installment) && Number(loan.principle) - calculator.paid_principle > 0) {
      let nextDue = new Date(loan.installment_due);
      nextDue.setMonth(nextDue.getMonth() + 1);

      _installment.principle_next_due = Number(loan.principle) - calculator.paid_principle;
      _installment.interest_next_due = calculator.paid_interest;
      _installment.total_amount_next_due = Number(loan.principle) - calculator.paid_principle;
      _installment.installment_next_due = nextDue;
    }
    // บันทึกประเภทการชำระ
    if (obj.type === "cash") {
      _installment.type = "เงินสด";
      _installment.cash = paidAmount;
    } else {
      _installment.transfer_payment = paidAmount;
    }

    // บันทึกค่าธรรมเนียม
    if (applicationFee < 0) {
      _installment.application_charge = 0;
    } else {
      _installment.application_charge =
        Math.round((applicationFee + Number.EPSILON) * 100) / 100;
    }

    // บันทึกข้อมูลภาษี
    const tax = new Tax();
    tax.user_id = loan.user_id;
    tax.loan_id = loan.id;
    tax.loan_number = loan.loan_number;
    tax.principle = calculator.paid_principle;
    tax.interest = calculator.paid_interest;
    tax.interest_rate = loan.loan_interest;
    tax.installment_id = _installment.id;
    tax.tax_business = Math.round(((calculator.paid_interest * 3) / 100 + Number.EPSILON) * 100) / 100;
    tax.tax_local = Math.round(((((calculator.paid_interest * 3) / 100) * 10) / 100 + Number.EPSILON) * 100) / 100;
    tax.total_tax = Math.round((tax.tax_business + tax.tax_local + Number.EPSILON) * 100) / 100;

    // อัพเดทวันที่ชำระงวดถัดไป
    // if (days >= 0) {
    let _nextStart = new Date(loan.installment_due);
    let _nextDue = new Date(loan.installment_due);
    _nextDue.setMonth(_nextDue.getMonth() + 1);

    loan.installment_start = _nextStart;
    loan.installment_due = _nextDue;

    loan.last_alert_date = _nextDue;
    loan.given_installment = calculator.installment;
    // }

    // อัพเดทข้อมูลสินเชื่อ
    if (plan.type_interest === 'flatrate') {
      loan.principle = Number(loan.principle) - calculator.paid_principle
    } else {
      loan.principle = calculator.principle_remaining;
    }
    loan.remaining = calculator.principle_remaining;
    loan.interest = Number(loan.interest) - calculator.paid_interest
    loan.overdue_balance = calculator.interest_remaining;
    loan.total_paid = Number(loan.total_paid) + Number(paidAmount);
    loan.charge_per_installment = calculator.delay_charge

    // ตรวจสอบการชำระครบ
    if (calculator.principle_remaining <= 0) {
      loan.status = loan_status.Paid;
      loan.closed_at = paidDate;
      if (plan.type_interest === "flatrate") {
        let cal = Number(loan.total_installment) - (Number(loan.given_installment) - 1);
        const multiplier = cal > 0 ? cal : 1;
        _installment.interest_paid = calculator.paid_interest * multiplier;
      }
    }

    // บันทึก installment และ tax
    await orm(Installment).save(_installment);
    await orm(Tax).save(tax);

    // ตรวจสอบกรณีที่ชำระงวดสุดท้ายแต่ยังมียอดคงเหลือ
    if (loan.given_installment >= loan.total_installment && loan.remaining > 0) {
      let calculator
      const _installment = new Installment();
      if (plan.type_interest === "flatrate") {
        calculator = flatrateCalculator({
          amount: loan.amount,
          remaining: loan.remaining,
          interest_rate: interestRate,
          total_installment: loan.total_installment,
          installment_start: loan.installment_start,
          payment_date: loan.installment_due,
          pay: loan.remaining,
          interest_stack: loan.overdue_balance,
          installment: Number(loan.given_installment) + 1,
          pay_days: 30,
          delay_days: plan.delay_value,
          delay_charge: plan.fixed_charge,
        })
      } else {
        calculator = effectiverateCalculator({
          amount: loan.amount,
          remaining: loan.remaining,
          interest_rate: interestRate,
          total_installment: loan.total_installment,
          installment_start: loan.installment_start,
          payment_date: loan.installment_due,
          pay: loan.remaining,
          interest_stack: loan.overdue_balance,
          installment: Number(loan.given_installment) + 1,
          pay_days: 30,
          delay_days: plan.delay_value,
          delay_charge: plan.fixed_charge,
        })
      }

      const {
        delay_days,
        delay_charge,
        principle,
        interest,
        paid_principle,
        paid_interest,
        interest_due,
        principle_remaining,
        interest_remaining,
        installment,
        ...props
      } = calculator;

      _installment.receipt_number = await generateReceiptNumber(plan.id);
      _installment.plan_id = plan.id;
      _installment.user_id = loan.user_id;
      _installment.loan_id = loan.id;
      _installment.loan_number = loan.loan_number;
      _installment.installment_date = loan.installment_due;
      _installment.start_date = loan.installment_start;
      _installment.per_installment = loan.remaining;
      _installment.amount = loan.amount;
      _installment.remaining = 0;
      _installment.principle = 0
      _installment.overdue_balance = calculator.interest_remaining;
      _installment.installment = calculator.installment;
      _installment.total_installment = loan.total_installment;
      _installment.isPaid = false;
      _installment.paid = Number(loan.remaining) + calculator.paid_interest;
      _installment.delay_days = calculator.delay_days > 0 ? calculator.delay_days : 0;
      _installment.principle_installment = calculator.principle;
      _installment.interest_installment = calculator.interest;
      _installment.principle_paid = loan.remaining;
      _installment.interest_paid = calculator.paid_interest;
      _installment.delay_charge_paid = calculator.delay_charge;
      _installment.paid_by = `${user.firstname} - ${user.lastname}`;
      _installment.interest_due = plan.type_interest === "flatrate" ? 0 : calculator.interest_due;
      _installment.total_interest = calculator.interest + loan.overdue_balance - calculator.paid_interest;
      _installment.principle_next_due = null;
      _installment.interest_next_due = null;
      _installment.total_amount_next_due = null;
      _installment.installment_next_due = null;
      _installment.transfer_payment = 0;

      if (applicationFee < 0) {
        _installment.application_charge = 0;
      } else {
        _installment.application_charge =
          Math.round((applicationFee + Number.EPSILON) * 100) / 100;
      }

      await orm(Installment).save(_installment);
      loan.given_installment = calculator.installment;
      loan.installment_start = _installment.start_date;
      loan.installment_due = _installment.installment_date;
    } else {
      // คำนวณงวดที่เหลือ
      await (async (lastPaid) => {
        const startInstallment = loan.approved_at;
        let total_interest, valueInstallment;

        if (plan.type_interest === "flatrate") {
          const result = await flatrateInstallment({
            loan_id: _loanId,
            amount: loan.amount,
            rate: interestRate,
            installment: loan.total_installment,
            start: loan.startDate,
            created: startInstallment,
            given_at: Number(loan.given_installment),
            lastPaid: lastPaid - Number(loan.charge_per_installment),
            delay_charge: Number(loan.charge_per_installment)
          });
          total_interest = result.total_interest;
          valueInstallment = result.installment;
        } else {
          const result = await effevtiverateInstallment({
            loan_id: _loanId,
            amount: loan.amount,
            rate: interestRate,
            installment: loan.total_installment,
            start: loan.startDate,
            created: startInstallment,
            given_at: Number(loan.given_installment),
            lastPaid: lastPaid - Number(loan.charge_per_installment),
            delay_charge: Number(loan.charge_per_installment),
            paidDate: paidDate,
          });
          total_interest = result.total_interest;
          valueInstallment = result.installment;
        }

        const [firstInstallment, nextInstallment] = valueInstallment;
        const lastInstallment = Number(loan.given_installment) + 1 == Number(loan.total_installment);

        if (valueInstallment.length && firstInstallment.remaining >= 0) {
          loan.given_installment = installment;
          const _installment = new Installment();
          _installment.receipt_number = await generateReceiptNumber(plan.id);
          _installment.plan_id = plan.id;
          _installment.user_id = loan.user_id;
          _installment.loan_id = loan.id;
          _installment.loan_number = loan.loan_number;
          _installment.installment_date = new Date(loan.installment_due);
          _installment.start_date = loan.installment_start;
          _installment.per_installment = loan.per_installment;
          _installment.amount = loan.amount;
          _installment.remaining = firstInstallment.remaining;
          _installment.principle = Number(loan.principle) - firstInstallment.principle;
          _installment.overdue_balance = interest_remaining;
          _installment.outstanding_balance = firstInstallment.remaining;
          _installment.installment = installment + 1;
          _installment.total_installment = loan.total_installment;
          _installment.isPaid = false;
          _installment.paid = firstInstallment.amount;
          _installment.delay_days = delay_days > 0 ? delay_days : 0;
          _installment.per_installment = loan.per_installment;
          _installment.principle_installment = lastInstallment ? loan.remaining : firstInstallment.principle;
          _installment.interest_installment = firstInstallment.interest;
          _installment.principle_paid = lastInstallment ? loan.remaining : firstInstallment.principle;
          _installment.interest_paid = firstInstallment.interest;
          _installment.delay_charge_paid = 0;
          _installment.paid_by = `${user.firstname} - ${user.lastname}`;

          if (plan.type_interest === "flatrate") {
            // คำนวณดอกเบี้ยรวม
            const totalInterest = loan.amount * (Number(loan.loan_interest) / 100) * (loan.total_installment / 12);
            const interestPerInstallment = Math.round((totalInterest / loan.total_installment + Number.EPSILON) * 100) / 100;

            const paidInstallments = Number(loan.given_installment);
            const remainingInterest = totalInterest - (interestPerInstallment * (paidInstallments + 1));

            _installment.interest_due = 0;
            _installment.total_interest = remainingInterest;
          } else {
            _installment.interest_due = firstInstallment.interest;
            _installment.total_interest = (total_interest + interest_remaining) - firstInstallment.interest;
          }

          if (nextInstallment) {
            _installment.principle_next_due = lastInstallment
              ? loan.remaining
              : nextInstallment.principle;
            _installment.interest_next_due = nextInstallment.interest;
            _installment.total_amount_next_due = lastInstallment ? Number(loan.remaining) + nextInstallment.interest : nextInstallment.amount;
            _installment.installment_next_due = nextInstallment.date;
          }

          _installment.transfer_payment = 0;
          _installment.application_charge = applicationFee < 0 ? 0 :
            Math.round((applicationFee + Number.EPSILON) * 100) / 100;

          await orm(Installment).save(_installment);
        }

        // อัพเดท installment ล่าสุด
        await (async () => {
          let _installment = await orm(Installment).findOne({
            where: { isPaid: true, loan_id: loan.id },
            order: { created_at: "DESC" },
          });

          if (plan.type_interest === "flatrate") {
            _installment.total_interest = total_interest;
          } else {
            _installment.total_interest = (beforeInterest + total_interest + interest_remaining) - paid_interest;
          }
          _installment.principle_next_due = firstInstallment
            ? firstInstallment.principle
            : null;
          _installment.interest_next_due = firstInstallment
            ? firstInstallment.interest
            : null;
          _installment.total_amount_next_due = firstInstallment
            ? firstInstallment.amount
            : null;
          _installment.installment_next_due = firstInstallment
            ? firstInstallment.date
            : null;

          await orm(Installment).save(_installment);
        })();
      })(_installment.paid);
    }

    await orm(Loan).save(loan);

    // สร้างข้อมูลสำหรับส่งใบเสร็จ
    const orders = [
      {
        name: "เงินต้น",
        amount: `${paid_principle.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} บาท`,
      },
      {
        name: "ดอกเบี้ย",
        amount: `${paid_interest.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} บาท`,
      },
      {
        name: "ค่าทวงถาม",
        amount: `${delay_charge.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} บาท`,
      },
    ];

    const totalAmount = paid_principle + paid_interest + delay_charge;
    const sendTotal = `${totalAmount.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} บาท`;

    const formattedInstallmentDate = new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(obj.paymentDate ? new Date(obj.paymentDate) : new Date());


    if (user.la == "enable") {
      Line_SendSlip(
        user.line_id,
        plan.name,
        _installment.receipt_number,
        loan.loan_number,
        formattedInstallmentDate,
        `${loan.given_installment}/${loan.total_installment}`,
        orders,
        sendTotal,
        `${user.firstname} ${user.lastname}`
      );
    }

    // if (user.email) {
    //   const subject = "ใบเสร็จการชำระเงิน";
    //   const htmlContent = payment_notificate(
    //     user,
    //     loan,
    //     plan.name,
    //     orders,
    //     sendTotal,
    //     formattedInstallmentDate,
    //     bill
    //   );
    //   sendNotificationEmail(user.email, subject, htmlContent, user.id);
    // }

    return res.success("บันทึกรายการชำระสำเร็จ", {
      ..._installment,
    });
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};