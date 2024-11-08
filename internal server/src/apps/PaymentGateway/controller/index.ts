import axios from "axios";
import {
  isValidDecimalNumber,
  processQRCodeFromImage,
  randomNumber,
  writeFile,
  generateReceiptNumber
} from "../../../Utils";
import { QRPayment } from "../entities/qrpayment";
import { orm } from "../../../data-source";
import { Loan } from "../../Loan/entities/loan";
import { loan_status } from "../../Utils/enum";
import { LoanPlan } from "../../Loan/entities/loan_plan";
import { Users } from "../../Users/entities";
import {
  paymentCalculator,
  // remainingCalcurate,
  installmentRemaining,
  flatrateCalculator,
  effectiverateCalculator,
  flatrateInstallment,
  effevtiverateInstallment
} from "../../Loan/controller/calurate";
import { Installment } from "../../Loan/entities/loan_installment";
import * as path from "path";
import * as sharp from "sharp";
import {
  payment_notificate,
  sendNotificationEmail,
} from "../../Notification/controller";
import { Line_SendSlip } from "../../Line_Message/module";
import { Tax } from "../../Loan/entities/tax";
import * as moment from "moment-timezone";
import { whitelist } from "../../../Utils/whitelist";
export const callback = async (req, res) => {
  console.log(req.body)
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  const result = await payment(req.body, clientIp);
  await orm(QRPayment).save(result);
  return res.success("Callback received");
};

// const payment = async (props) => {
//   const { refno, orderno, merchantid, cardtype, total, status, statusname } =
//     props;
//   const _founded = await orm(QRPayment).findOne({
//     where: { referenceNo: refno },
//   });

//   if (!_founded) {
//     const faill = await orm(QRPayment).save({
//       referenceNo: refno,
//       orderNo: orderno,
//       merchantid: merchantid,
//       cardtype: cardtype,
//       total: total,
//       callback: status,
//       statusname: statusname,
//       update_installment: "error",
//       message: "ไม่พบข้อมูล QR ที่ระบุ",
//     });
//     return faill;
//   }
//   if (_founded.update_installment == "success") return _founded;
//   _founded.merchantid = merchantid;
//   _founded.cardtype = cardtype;
//   _founded.callback = statusname;
//   _founded.received = total;
//   try {
//     const loan = await orm(Loan).findOne({
//       where: {
//         loan_number: _founded.loan_number,
//       },
//     });

//     if (!loan) {
//       _founded.update_installment = "error";
//       _founded.message = "ไม่พบเลขที่สัญญา";
//       return _founded;
//     }
//     const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id } });
//     if (!plan) {
//       _founded.update_installment = "error";
//       _founded.message = "ไม่พบแผนสินเชื่อ";
//       return _founded;
//     }
//     const user = await orm(Users).findOne({ where: { id: loan.user_id } });
//     if (!user) {
//       return _founded;
//     }

//     let paidAmount = Number(total);
//     if (paidAmount <= 0) {
//       _founded.update_installment = "error";
//       _founded.message = "ยอดชำระต้องไม่น้อยกว่า 0";
//       return _founded;
//     }

//     const paidDate = new Date().toISOString();

//     // คำนวนยอด
//     const selectedRate = plan.rate.find(
//       (r) => Number(r.installment) === loan.total_installment
//     );
//     const interestRate =
//       Number(selectedRate.interest_rate) +
//       Number(plan.application_percent_charge);
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

//     const { total_interest, installment: valueInstallment } =
//       remainingCalcurate({
//         amount: loan.amount,
//         rate: interestRate,
//         installment: loan.total_installment,
//         start: loan.startDate,
//         created: loan.approved_at,
//         given_at: Number(loan.given_installment),
//       });

//     const [firstInstallment, next, next2] = valueInstallment;

//     if (principle_remaining < 0) {
//       _founded.update_installment = "error";
//       _founded.message = "กรุณาชำระจำนวนที่ถูกต้อง และ ไม่เกินยอดคงเหลือ";
//       return _founded;
//     }

//     const applicationFee =
//       (beforeRemaining * (applicationAnnualRate * days)) / daysInYear;

//     let _installment = await orm(Installment).findOne({
//       where: { isPaid: false, loan_id: loan.id },
//       order: { created_at: "DESC" },
//     });
//     if (!_installment) _installment = new Installment();
//     _installment.qrcode = _founded.image;
//     _installment.barcode = _founded.barcode;
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
//     _installment.installment = installment;
//     _installment.total_installment = loan.total_installment;
//     _installment.isPaid = true;
//     _installment.given_at = new Date();
//     _installment.paid = paidAmount;
//     _installment.delay_days = delay_days > 0 ? delay_days : 0;
//     _installment.per_installment = loan.per_installment;
//     _installment.principle_installment = principle;
//     _installment.interest_installment = interest;
//     _installment.principle_paid = paid_principle;
//     _installment.interest_paid = paid_interest;
//     _installment.delay_charge_paid = delay_charge;
//     _installment.paid_by = `${user.firstname} - ${user.lastname}`;

//     _installment.interest_due = interest_due;
//     _installment.total_interest = total_interest + interest_remaining + (interest - interest_due);
//     _installment.principle_next_due = firstInstallment ? firstInstallment.principle : null;
//     _installment.interest_next_due = firstInstallment
//       ? firstInstallment.interest + interest_remaining
//       : null;
//     _installment.total_amount_next_due = firstInstallment
//       ? firstInstallment.amount + interest_remaining
//       : null;
//     _installment.installment_next_due = firstInstallment
//       ? firstInstallment.date
//       : null;

//     _installment.transfer_payment = paidAmount;

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
//     tax.interest_rate = selectedRate.interest_rate;
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

//     if (days >= 0) {
//       let _nextStart = new Date(loan.installment_due);
//       let _nextDue = new Date(loan.installment_due);
//       loan.given_installment = installment;
//       if (days >= 25) {
//         _nextDue.setMonth(_nextDue.getMonth() + 1);
//         loan.installment_start = _nextStart;
//         loan.installment_due = _nextDue;

//         loan.last_alert_date = _nextDue;
//         loan.given_installment = installment;
//       }
//     }

//     loan.principle = principle_remaining;
//     loan.remaining = principle_remaining;

//     loan.overdue_balance = interest_remaining;
//     loan.total_paid = Number(loan.total_paid) + Number(paidAmount);

//     if (principle_remaining <= 0) {
//       loan.status = loan_status.Paid;
//       loan.closed_at = paidDate;
//     }
//     await orm(Loan).save(loan);

//     if (loan.given_installment >= loan.total_installment && loan.remaining > 0) {
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
//       _installment.installment_date = loan.installment_due
//       _installment.start_date = loan.installment_start;
//       _installment.per_installment = loan.remaining;
//       _installment.amount = loan.amount;
//       _installment.remaining = principle_remaining;
//       _installment.overdue_balance = interest_remaining;
//       _installment.installment = installment;
//       _installment.total_installment = loan.total_installment;
//       _installment.isPaid = false;
//       _installment.paid = loan.remaining;
//       _installment.delay_days = delay_days > 0 ? delay_days : 0;
//       _installment.principle_installment = principle;
//       _installment.interest_installment = interest;
//       _installment.principle_paid = paid_principle;
//       _installment.interest_paid = paid_interest;
//       _installment.delay_charge_paid = delay_charge;
//       _installment.paid_by = `${user.firstname} - ${user.lastname}`;

//       _installment.interest_due = interest_due;
//       _installment.total_interest = interest + loan.overdue_balance;
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

//       loan.installment_start = _installment.start_date;
//       loan.installment_due = _installment.installment_date;
//       await orm(Loan).save(loan);
//     } else {
//       await (async (remaining) => {
//         if (!next) return
//         const _installment = new Installment();
//         const {
//           delay_days,
//           delay_charge,
//           principle,
//           interest,
//           interest_due,
//           paid_principle,
//           paid_interest,
//           days,
//           daysInYear,
//           principle_remaining,
//           interest_remaining,
//           installment,
//           ...props
//         } = paymentCalculator({
//           amount: loan.amount,
//           remaining: loan.remaining,
//           interest_rate: interestRate,
//           total_installment: loan.total_installment,
//           installment_start: loan.installment_start,
//           installment_due: loan.installment_due,
//           payment_date: loan.installment_due,
//           pay: next.amount,
//           interest_stack: loan.overdue_balance,
//           installment: Number(loan.given_installment) + 1,
//           pay_days: 30,
//           delay_days: plan.delay_value,
//           delay_charge: plan.fixed_charge,
//         });

//         _installment.qrcode = _founded.image;
//         _installment.barcode = _founded.barcode;
//         _installment.receipt_number = await generateReceiptNumber(plan.id);
//         _installment.plan_id = plan.id;
//         _installment.user_id = loan.user_id;
//         _installment.loan_id = loan.id;
//         _installment.loan_number = loan.loan_number;
//         _installment.installment_date = new Date(loan.installment_due);
//         _installment.start_date = loan.installment_start;
//         _installment.per_installment = loan.per_installment;
//         _installment.amount = loan.amount;
//         _installment.remaining = principle_remaining;
//         _installment.overdue_balance = interest_remaining;
//         _installment.installment = installment;
//         _installment.total_installment = loan.total_installment;
//         _installment.isPaid = false;
//         // _installment.given_at = new Date();
//         _installment.paid = next.amount;
//         _installment.delay_days = delay_days > 0 ? delay_days : 0;
//         _installment.per_installment = loan.per_installment;
//         _installment.principle_installment = principle;
//         _installment.interest_installment = interest;
//         _installment.principle_paid = paid_principle;
//         _installment.interest_paid = paid_interest;
//         _installment.delay_charge_paid = delay_charge;
//         _installment.paid_by = `${user.firstname} - ${user.lastname}`;

//         _installment.interest_due = interest_due;
//         _installment.total_interest = total_interest + interest_remaining + (interest - interest_due);
//         _installment.principle_next_due = next ? next.principle : null;
//         _installment.interest_next_due = next
//           ? next.interest + interest_remaining
//           : null;
//         _installment.total_amount_next_due = next
//           ? next.amount + interest_remaining
//           : null;
//         _installment.installment_next_due = next
//           ? next.date
//           : null;

//         _installment.transfer_payment = 0;

//         if (applicationFee < 0) {
//           _installment.application_charge = 0;
//         } else {
//           _installment.application_charge =
//             Math.round((applicationFee + Number.EPSILON) * 100) / 100;
//         }

//         await orm(Installment).save(_installment);
//       })(principle_remaining);
//     }
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
//     }).format(new Date());

//     const bill = _installment.receipt_number;
//     if (user.line_id != "")
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

//     {
//       _founded.update_installment = "success";
//       _founded.message = "";
//       return _founded;
//     }
//   } catch (err) {
//     console.log(err);

//     _founded.update_installment = "error";
//     _founded.message = "โค๊ดในระบบมีปัญหา";
//     return _founded;
//   }
// };


const payment = async (props, clientIp) => {
  const { refno, orderno, merchantid, cardtype, total, status, statusname } =
    props;
  const _founded = await orm(QRPayment).findOne({
    where: { referenceNo: refno },
  });
  console.log("transfer payment runing...")
  if (!_founded) {

    const faill = await orm(QRPayment).save({
      referenceNo: refno,
      orderNo: orderno,
      merchantid: merchantid,
      cardtype: cardtype,
      total: total,
      callback: status,
      statusname: statusname,
      update_installment: "error",
      message: "ไม่พบข้อมูล QR ที่ระบุ",
    });
    if (!whitelist[clientIp])
      faill.message += `, IP นี้ไม่ได้รับอนุญาติ ${clientIp}`;

    if (String(merchantid) != String(process.env.PAYSOLUTION_MERCHANTID))
      _founded.message += `, รหัสร้านค้าไม่ถูกต้อง ${merchantid}`;
    return faill;
  }
  if (String(merchantid) != String(process.env.PAYSOLUTION_MERCHANTID)) {
    _founded.update_installment = "error";
    _founded.message = `รหัสร้านค้าไม่ถูกต้อง ${merchantid}`;
    return _founded;
  }

  if (!whitelist[clientIp]) {
    _founded.update_installment = "error";
    _founded.message = `IP นี้ไม่ได้รับอนุญาติ ${clientIp}`;
    return _founded;
  }
  if (_founded.update_installment == "success") return _founded;
  _founded.merchantid = merchantid;
  _founded.cardtype = cardtype;
  _founded.callback = statusname;
  _founded.received = total;
  try {
    const loan = await orm(Loan).findOne({
      where: {
        loan_number: _founded.loan_number,
      },
    });

    if (!loan) {
      _founded.update_installment = "error";
      _founded.message = "ไม่พบเลขที่สัญญา";
      return _founded;
    }
    const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id } });
    if (!plan) {
      _founded.update_installment = "error";
      _founded.message = "ไม่พบแผนสินเชื่อ";
      return _founded;
    }
    const user = await orm(Users).findOne({ where: { id: loan.user_id } });
    if (!user) {
      return _founded;
    }

    let paidAmount = Number(total);
    if (paidAmount <= 0) {
      _founded.update_installment = "error";
      _founded.message = "ยอดชำระต้องไม่น้อยกว่า 0";
      return _founded;
    }

    const paidDate = new Date().toISOString();

    // คำนวณวันกำหนดการชำระลบด้วย 5 วัน
    // const fiveDaysBeforeInstallmentDue = new Date(loan.installment_due);
    // fiveDaysBeforeInstallmentDue.setDate(fiveDaysBeforeInstallmentDue.getDate() - 5);

    // // ตรวจสอบว่า วันที่ชำระ ต้องไม่น้อยกว่าวันกำหนดการชำระลบด้วย 5 วัน
    // if (new Date(paidDate).getTime() < fiveDaysBeforeInstallmentDue.getTime()) {
    //   _founded.update_installment = "error";
    //   _founded.message = "ไม่สามารถชำระค่าบริการก่อนถึงวันกำหนด 5 วันได้";
    //   return _founded;
    // }

    // คำนวนยอด
    // const selectedRate = plan.rate.find(
    //   (r) => Number(r.installment) === loan.total_installment
    // );
    // const interestRate =
    //   Number(selectedRate.interest_rate) +
    //   Number(plan.application_percent_charge);

    const interestRate =
      Number(loan.loan_interest) + Number(plan.application_percent_charge);
    const applicationAnnualRate = Number(plan.application_percent_charge) / 100;

    const beforeRemaining = Number(loan.remaining);

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
      ...props
    } = calculator;

    if (calculator.principle_remaining < 0) {
      _founded.update_installment = "error";
      _founded.message = "กรุณาชำระจำนวนที่ถูกต้อง และ ไม่เกินยอดคงเหลือ";
      return _founded;
    }

    if (plan.type_interest === 'flatrate') {
      if (loan.given_installment + 1 < loan.total_installment &&
        paidAmount > Number(loan.per_installment) +
        Number(loan.overdue_balance) +
        Number(calculator.delay_charge)
      ) {
        _founded.update_installment = "error";
        _founded.message = "ไม่สามารถชำระเกินยอดที่กำหนดได้";
        return _founded;
      }
    }

    if (paidAmount < calculator.mini_pay) {
      _founded.update_installment = "error";
      _founded.message = "ไม่สามารถชำระน้อยกว่ายอดขั้นต่ำได้";
      return _founded;
    }

    const applicationFee =
      (beforeRemaining * (applicationAnnualRate * calculator.days)) / calculator.daysInYear;

    let _installment = await orm(Installment).findOne({
      where: { isPaid: false, loan_id: loan.id },
      order: { created_at: "DESC" },
    });
    if (!_installment) _installment = new Installment();
    const beforeInterest = Number(_installment.interest_installment || 0);
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
    _installment.given_at = new Date();
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
      _installment.interest_next_due = null;
      _installment.total_amount_next_due = Number(loan.principle) - calculator.paid_principle;
      _installment.installment_next_due = nextDue;
    }
    
    _installment.transfer_payment = paidAmount;

    if (applicationFee < 0) {
      _installment.application_charge = 0;
    } else {
      _installment.application_charge =
        Math.round((applicationFee + Number.EPSILON) * 100) / 100;
    }



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

    await orm(Installment).save(_installment);
    await orm(Tax).save(tax);

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
            loan_id: Number(loan.id),
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
            loan_id: Number(loan.id),
            amount: loan.amount,
            rate: interestRate,
            installment: loan.total_installment,
            start: loan.startDate,
            created: startInstallment,
            given_at: Number(loan.given_installment),
            lastPaid: lastPaid - Number(loan.charge_per_installment),
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
          _installment.principle_installment = firstInstallment.principle;
          _installment.interest_installment = firstInstallment.interest;
          _installment.principle_paid = firstInstallment.principle;
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
            _installment.total_amount_next_due = nextInstallment.remaining;
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
    }).format(new Date());

    const bill = _installment.receipt_number;
    if (user.line_id != "")
      Line_SendSlip(
        user.line_id,
        plan.name,
        bill,
        loan.loan_number,
        formattedInstallmentDate,
        `${loan.given_installment}/${loan.total_installment}`,
        orders,
        sendTotal,
        `${user.firstname} ${user.lastname}`
      );

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

    {
      _founded.update_installment = "success";
      _founded.message = "";
      return _founded;
    }
  } catch (err) {
    console.log(err);

    _founded.update_installment = "error";
    _founded.message = "โค๊ดในระบบมีปัญหา";
    return _founded;
  }
};


export const createPayment = async (req, res) => {
  const { loan_number, amount } = req.params;

  if (!isValidDecimalNumber(amount)) return res.error("จำนวนเงินไม่ถูกต้อง");
  const refno = String(new Date().getTime() / 10000).split(".")[1] + randomNumber(4)
  const encodedTotal = encodeURIComponent(amount);
  const encodedReferenceNo = encodeURIComponent(
    refno
  );
  await orm(QRPayment).save({
    referenceNo: refno,
    total: amount,
    merchantid: process.env.PAYSOLUTION_MERCHANTID,
    loan_number: loan_number,
  });
  return res.redirect(`${process.env.REDIRECT_URI}/payment/${loan_number}/${encodedReferenceNo}/${encodedTotal}`);

};


export const createPaymentAdmin = async (req, res) => {
  const { loan_number, amount } = req.params;
  const loan = await orm(Loan).findOne({ where: { loan_number: loan_number } });
  if (!loan) return res.redirect(process.env.REDIRECT_URI_OFFICE)
  const users = await orm(Users).findOne({ where: { id: loan.user_id } });
  if (!users) return res.redirect(process.env.REDIRECT_URI_OFFICE)
  if (!isValidDecimalNumber(amount)) return res.error("จำนวนเงินไม่ถูกต้อง");
  const refno = String(new Date().getTime() / 10000).split(".")[1] + randomNumber(4)
  const encodedTotal = encodeURIComponent(amount);
  const encodedEmail = encodeURIComponent(users.email);
  const encodedReferenceNo = encodeURIComponent(
    refno
  );
  await orm(QRPayment).save({
    referenceNo: refno,
    total: amount,
    merchantid: process.env.PAYSOLUTION_MERCHANTID,
    loan_number: loan_number,
  });
  return res.redirect(`${process.env.REDIRECT_URI_OFFICE}/payment/${loan_number}/${encodedReferenceNo}/${encodedTotal}/${encodedEmail}`);

};


export const createQR = async (req, res) => {
  const { loan_number, amount } = req.body;

  const haved = await orm(QRPayment).findOne({
    where: { loan_number, update_installment: "pending" },
    order: { created_at: "DESC" },
  });
  if (haved) {
    if (
      moment.tz(haved.expiredate, "Asia/Bangkok").toDate().getTime() >
      moment().tz("Asia/Bangkok").toDate().getTime() &&
      Number(haved.total) === Number(amount)
    ) {
      const { referenceNo, ...etc } = haved;
      return res.success("Success", etc);
    }
  }

  if (!isValidDecimalNumber(amount)) return res.error("จำนวนเงินไม่ถูกต้อง");
  try {
    const merchantID = encodeURIComponent(process.env.PAYSOLUTION_MERCHANTID);
    const productDetail = encodeURIComponent("QRPAYMENT");
    const customerEmail = encodeURIComponent("info@moneyforyou.co.th");
    const customerName = encodeURIComponent("moneyforyou");
    const encodedTotal = encodeURIComponent(amount);
    const encodedReferenceNo = encodeURIComponent(
      String(new Date().getTime() / 10000).split(".")[1] + randomNumber(4)
    );
    const url = `https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=${merchantID}&productDetail=${productDetail}&customerEmail=${customerEmail}&customerName=${customerName}&total=${encodedTotal}&referenceNo=${encodedReferenceNo}`;
    const paymentResponse = await axios.post(url, null, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + process.env.PAYSOLUTION_APIKEY,
      },
    });
    if (paymentResponse.data.status != "success")
      return res.error("Error creating");
    const base64Image = paymentResponse.data.data.image.split(";base64,").pop();
    const imageBuffer = Buffer.from(base64Image, "base64");
    const filename = `${paymentResponse.data.data.orderNo
      }-${new Date().getTime()}.png`;
    const uploadPath = path.join(
      __dirname,
      "../../../uploads/qrcode",
      filename
    );
    await sharp(imageBuffer).toFile(uploadPath);

    await processQRCodeFromImage(uploadPath, filename);
    const result = await orm(QRPayment).save({
      ...paymentResponse.data.data,
      image: `qrcode/${filename}`,
      barcode: `barcode/${filename}`,
      loan_number: loan_number,
    });
    const { referenceNo, ...etc } = result;
    return res.success("Success", etc);
  } catch (err) {
    console.log(err);
    return res.error("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก");
  }
};

export const LineCreateQR = async ({ loan_number, amount }) => {
  const haved = await orm(QRPayment).findOne({
    where: { loan_number, update_installment: "pending" },
    order: { created_at: "DESC" },
  });
  if (haved) {
    if (
      moment.tz(haved.expiredate, "Asia/Bangkok").toDate().getTime() >
      moment().tz("Asia/Bangkok").toDate().getTime() &&
      Number(haved.total) === Number(amount)
    ) {
      return `${process.env.USER_DOMAIN}/file/${haved.image}`;
    }
  }

  try {
    const merchantID = encodeURIComponent(process.env.PAYSOLUTION_MERCHANTID);
    const productDetail = encodeURIComponent("QRPAYMENT");
    const customerEmail = encodeURIComponent("info@moneyforyou.co.th");
    const customerName = encodeURIComponent("moneyforyou");
    const encodedTotal = encodeURIComponent(amount);
    const encodedReferenceNo = encodeURIComponent(
      String(new Date().getTime() / 10000).split(".")[1] + randomNumber(4)
    );
    const url = `https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=${merchantID}&productDetail=${productDetail}&customerEmail=${customerEmail}&customerName=${customerName}&total=${encodedTotal}&referenceNo=${encodedReferenceNo}`;
    const paymentResponse = await axios.post(url, null, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + process.env.PAYSOLUTION_APIKEY,
      },
    });
    if (paymentResponse.data.status != "success") {
      return false;
    }

    const base64Image = paymentResponse.data.data.image.split(";base64,").pop();
    const imageBuffer = Buffer.from(base64Image, "base64");
    const filename = `${paymentResponse.data.data.orderNo
      }-${new Date().getTime()}.png`;
    const uploadPath = path.join(
      __dirname,
      "../../../uploads/qrcode",
      filename
    );
    await sharp(imageBuffer).toFile(uploadPath);
    await processQRCodeFromImage(uploadPath, filename);
    const result = await orm(QRPayment).save({
      ...paymentResponse.data.data,
      image: `qrcode/${filename}`,
      barcode: `barcode/${filename}`,
      loan_number: loan_number,
    });
    return `${process.env.USER_DOMAIN}/file/${result.image}`;
  } catch (err) {
    console.log(err);
    return false;
  }
};
