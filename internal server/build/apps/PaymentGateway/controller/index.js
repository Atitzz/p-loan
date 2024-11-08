"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineCreateQR = exports.createQR = exports.createPaymentAdmin = exports.createPayment = exports.callback = void 0;
var axios_1 = require("axios");
var Utils_1 = require("../../../Utils");
var qrpayment_1 = require("../entities/qrpayment");
var data_source_1 = require("../../../data-source");
var loan_1 = require("../../Loan/entities/loan");
var enum_1 = require("../../Utils/enum");
var loan_plan_1 = require("../../Loan/entities/loan_plan");
var entities_1 = require("../../Users/entities");
var calurate_1 = require("../../Loan/controller/calurate");
var loan_installment_1 = require("../../Loan/entities/loan_installment");
var path = require("path");
var sharp = require("sharp");
var module_1 = require("../../Line_Message/module");
var tax_1 = require("../../Loan/entities/tax");
var moment = require("moment-timezone");
var whitelist_1 = require("../../../Utils/whitelist");
var callback = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var clientIp, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                return [4 /*yield*/, payment(req.body, clientIp)];
            case 1:
                result = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).save(result)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.success("Callback received")];
        }
    });
}); };
exports.callback = callback;
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
var payment = function (props, clientIp) { return __awaiter(void 0, void 0, void 0, function () {
    var refno, orderno, merchantid, cardtype, total, status, statusname, _founded, faill, loan_2, plan_1, user_1, paidAmount, paidDate_1, interestRate_1, applicationAnnualRate, beforeRemaining, calculator, delay_days_1, delay_charge, principle, interest, paid_principle, paid_interest_1, days, daysInYear, total_principle, principle_remaining, interest_remaining_1, installment_1, props_1, applicationFee_1, _installment, beforeInterest_1, nextDue, nextDue, tax, _nextStart, _nextDue, cal, multiplier, calculator_1, _installment_1, delay_days_2, delay_charge_1, principle_1, interest_1, paid_principle_1, paid_interest_2, interest_due, principle_remaining_1, interest_remaining_2, installment_2, props_2, _a, orders, totalAmount, sendTotal, formattedInstallmentDate, bill, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                refno = props.refno, orderno = props.orderno, merchantid = props.merchantid, cardtype = props.cardtype, total = props.total, status = props.status, statusname = props.statusname;
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).findOne({
                        where: { referenceNo: refno },
                    })];
            case 1:
                _founded = _b.sent();
                console.log("transfer payment runing...");
                if (!!_founded) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).save({
                        referenceNo: refno,
                        orderNo: orderno,
                        merchantid: merchantid,
                        cardtype: cardtype,
                        total: total,
                        callback: status,
                        statusname: statusname,
                        update_installment: "error",
                        message: "ไม่พบข้อมูล QR ที่ระบุ",
                    })];
            case 2:
                faill = _b.sent();
                if (!whitelist_1.whitelist[clientIp])
                    faill.message += ", IP \u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E34 ".concat(clientIp);
                if (String(merchantid) != String(process.env.PAYSOLUTION_MERCHANTID))
                    _founded.message += ", \u0E23\u0E2B\u0E31\u0E2A\u0E23\u0E49\u0E32\u0E19\u0E04\u0E49\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 ".concat(merchantid);
                return [2 /*return*/, faill];
            case 3:
                if (String(merchantid) != String(process.env.PAYSOLUTION_MERCHANTID)) {
                    _founded.update_installment = "error";
                    _founded.message = "\u0E23\u0E2B\u0E31\u0E2A\u0E23\u0E49\u0E32\u0E19\u0E04\u0E49\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 ".concat(merchantid);
                    return [2 /*return*/, _founded];
                }
                if (!whitelist_1.whitelist[clientIp]) {
                    _founded.update_installment = "error";
                    _founded.message = "IP \u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15\u0E34 ".concat(clientIp);
                    return [2 /*return*/, _founded];
                }
                if (_founded.update_installment == "success")
                    return [2 /*return*/, _founded];
                _founded.merchantid = merchantid;
                _founded.cardtype = cardtype;
                _founded.callback = statusname;
                _founded.received = total;
                _b.label = 4;
            case 4:
                _b.trys.push([4, 17, , 18]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({
                        where: {
                            loan_number: _founded.loan_number,
                        },
                    })];
            case 5:
                loan_2 = _b.sent();
                if (!loan_2) {
                    _founded.update_installment = "error";
                    _founded.message = "ไม่พบเลขที่สัญญา";
                    return [2 /*return*/, _founded];
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: loan_2.plan_id } })];
            case 6:
                plan_1 = _b.sent();
                if (!plan_1) {
                    _founded.update_installment = "error";
                    _founded.message = "ไม่พบแผนสินเชื่อ";
                    return [2 /*return*/, _founded];
                }
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan_2.user_id } })];
            case 7:
                user_1 = _b.sent();
                if (!user_1) {
                    return [2 /*return*/, _founded];
                }
                paidAmount = Number(total);
                if (paidAmount <= 0) {
                    _founded.update_installment = "error";
                    _founded.message = "ยอดชำระต้องไม่น้อยกว่า 0";
                    return [2 /*return*/, _founded];
                }
                paidDate_1 = new Date().toISOString();
                interestRate_1 = Number(loan_2.loan_interest) + Number(plan_1.application_percent_charge);
                applicationAnnualRate = Number(plan_1.application_percent_charge) / 100;
                beforeRemaining = Number(loan_2.remaining);
                calculator = void 0;
                if (plan_1.type_interest === "flatrate") {
                    calculator = (0, calurate_1.flatrateCalculator)({
                        amount: loan_2.amount,
                        remaining: loan_2.remaining,
                        interest_rate: interestRate_1,
                        total_installment: loan_2.total_installment,
                        installment_start: loan_2.installment_start,
                        payment_date: paidDate_1,
                        pay: paidAmount,
                        interest_stack: loan_2.overdue_balance,
                        installment: Number(loan_2.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                else {
                    calculator = (0, calurate_1.effectiverateCalculator)({
                        amount: loan_2.amount,
                        remaining: loan_2.remaining,
                        interest_rate: interestRate_1,
                        total_installment: loan_2.total_installment,
                        installment_start: loan_2.installment_start,
                        payment_date: paidDate_1,
                        pay: paidAmount,
                        interest_stack: loan_2.overdue_balance,
                        installment: Number(loan_2.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                delay_days_1 = calculator.delay_days, delay_charge = calculator.delay_charge, principle = calculator.principle, interest = calculator.interest, paid_principle = calculator.paid_principle, paid_interest_1 = calculator.paid_interest, days = calculator.days, daysInYear = calculator.daysInYear, total_principle = calculator.total_principle, principle_remaining = calculator.principle_remaining, interest_remaining_1 = calculator.interest_remaining, installment_1 = calculator.installment, props_1 = __rest(calculator, ["delay_days", "delay_charge", "principle", "interest", "paid_principle", "paid_interest", "days", "daysInYear", "total_principle", "principle_remaining", "interest_remaining", "installment"]);
                if (calculator.principle_remaining < 0) {
                    _founded.update_installment = "error";
                    _founded.message = "กรุณาชำระจำนวนที่ถูกต้อง และ ไม่เกินยอดคงเหลือ";
                    return [2 /*return*/, _founded];
                }
                if (plan_1.type_interest === 'flatrate') {
                    if (loan_2.given_installment + 1 < loan_2.total_installment &&
                        paidAmount > Number(loan_2.per_installment) +
                            Number(loan_2.overdue_balance) +
                            Number(calculator.delay_charge)) {
                        _founded.update_installment = "error";
                        _founded.message = "ไม่สามารถชำระเกินยอดที่กำหนดได้";
                        return [2 /*return*/, _founded];
                    }
                }
                if (paidAmount < calculator.mini_pay) {
                    _founded.update_installment = "error";
                    _founded.message = "ไม่สามารถชำระน้อยกว่ายอดขั้นต่ำได้";
                    return [2 /*return*/, _founded];
                }
                applicationFee_1 = (beforeRemaining * (applicationAnnualRate * calculator.days)) / calculator.daysInYear;
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).findOne({
                        where: { isPaid: false, loan_id: loan_2.id },
                        order: { created_at: "DESC" },
                    })];
            case 8:
                _installment = _b.sent();
                if (!_installment)
                    _installment = new loan_installment_1.Installment();
                beforeInterest_1 = Number(_installment.interest_installment || 0);
                _installment.receipt_number = _installment.receipt_number;
                _installment.plan_id = plan_1.id;
                _installment.user_id = loan_2.user_id;
                _installment.loan_id = loan_2.id;
                _installment.loan_number = loan_2.loan_number;
                _installment.installment_date = new Date(loan_2.installment_due);
                _installment.start_date = loan_2.installment_start;
                _installment.per_installment = loan_2.per_installment;
                _installment.amount = loan_2.amount;
                _installment.remaining = calculator.principle_remaining;
                _installment.principle = Number(loan_2.principle) - calculator.paid_principle;
                _installment.overdue_balance = calculator.interest_remaining;
                _installment.outstanding_balance = calculator.principle_remaining;
                _installment.installment = calculator.installment;
                _installment.total_installment = loan_2.total_installment;
                _installment.isPaid = true;
                _installment.given_at = new Date();
                _installment.paid = paidAmount;
                _installment.delay_days = calculator.delay_days > 0 ? calculator.delay_days : 0;
                _installment.principle_paid = calculator.paid_principle;
                _installment.interest_paid = calculator.paid_interest;
                _installment.delay_charge_paid = calculator.delay_charge;
                _installment.paid_by = "".concat(user_1.firstname, " - ").concat(user_1.lastname);
                _installment.per_installment = loan_2.per_installment;
                _installment.principle_installment = calculator.principle;
                _installment.interest_installment = calculator.interest;
                _installment.interest_due = plan_1.type_interest === "flatrate" ? 0 : calculator.interest_due;
                if (Number(loan_2.given_installment + 1) === Number(loan_2.total_installment) && Number(loan_2.principle) - calculator.paid_principle > 0) {
                    nextDue = new Date(loan_2.installment_due);
                    nextDue.setMonth(nextDue.getMonth() + 1);
                    _installment.principle_next_due = Number(loan_2.principle) - calculator.paid_principle;
                    _installment.interest_next_due = null;
                    _installment.total_amount_next_due = Number(loan_2.principle) - calculator.paid_principle;
                    _installment.installment_next_due = nextDue;
                }
                else if (Number(loan_2.given_installment + 1) > Number(loan_2.total_installment) && Number(loan_2.principle) - calculator.paid_principle > 0) {
                    nextDue = new Date(loan_2.installment_due);
                    nextDue.setMonth(nextDue.getMonth() + 1);
                    _installment.principle_next_due = Number(loan_2.principle) - calculator.paid_principle;
                    _installment.interest_next_due = null;
                    _installment.total_amount_next_due = Number(loan_2.principle) - calculator.paid_principle;
                    _installment.installment_next_due = nextDue;
                }
                _installment.transfer_payment = paidAmount;
                if (applicationFee_1 < 0) {
                    _installment.application_charge = 0;
                }
                else {
                    _installment.application_charge =
                        Math.round((applicationFee_1 + Number.EPSILON) * 100) / 100;
                }
                tax = new tax_1.Tax();
                tax.user_id = loan_2.user_id;
                tax.loan_id = loan_2.id;
                tax.loan_number = loan_2.loan_number;
                tax.principle = calculator.paid_principle;
                tax.interest = calculator.paid_interest;
                tax.interest_rate = loan_2.loan_interest;
                tax.installment_id = _installment.id;
                tax.tax_business = Math.round(((calculator.paid_interest * 3) / 100 + Number.EPSILON) * 100) / 100;
                tax.tax_local = Math.round(((((calculator.paid_interest * 3) / 100) * 10) / 100 + Number.EPSILON) * 100) / 100;
                tax.total_tax = Math.round((tax.tax_business + tax.tax_local + Number.EPSILON) * 100) / 100;
                _nextStart = new Date(loan_2.installment_due);
                _nextDue = new Date(loan_2.installment_due);
                _nextDue.setMonth(_nextDue.getMonth() + 1);
                loan_2.installment_start = _nextStart;
                loan_2.installment_due = _nextDue;
                loan_2.last_alert_date = _nextDue;
                loan_2.given_installment = calculator.installment;
                // }
                if (plan_1.type_interest === 'flatrate') {
                    loan_2.principle = Number(loan_2.principle) - calculator.paid_principle;
                }
                else {
                    loan_2.principle = calculator.principle_remaining;
                }
                loan_2.remaining = calculator.principle_remaining;
                loan_2.interest = Number(loan_2.interest) - calculator.paid_interest;
                loan_2.overdue_balance = calculator.interest_remaining;
                loan_2.total_paid = Number(loan_2.total_paid) + Number(paidAmount);
                loan_2.charge_per_installment = calculator.delay_charge;
                // ตรวจสอบการชำระครบ
                if (calculator.principle_remaining <= 0) {
                    loan_2.status = enum_1.loan_status.Paid;
                    loan_2.closed_at = paidDate_1;
                    if (plan_1.type_interest === "flatrate") {
                        cal = Number(loan_2.total_installment) - (Number(loan_2.given_installment) - 1);
                        multiplier = cal > 0 ? cal : 1;
                        _installment.interest_paid = calculator.paid_interest * multiplier;
                    }
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).save(_installment)];
            case 9:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(tax_1.Tax).save(tax)];
            case 10:
                _b.sent();
                if (!(loan_2.given_installment >= loan_2.total_installment && loan_2.remaining > 0)) return [3 /*break*/, 13];
                _installment_1 = new loan_installment_1.Installment();
                if (plan_1.type_interest === "flatrate") {
                    calculator_1 = (0, calurate_1.flatrateCalculator)({
                        amount: loan_2.amount,
                        remaining: loan_2.remaining,
                        interest_rate: interestRate_1,
                        total_installment: loan_2.total_installment,
                        installment_start: loan_2.installment_start,
                        payment_date: loan_2.installment_due,
                        pay: loan_2.remaining,
                        interest_stack: loan_2.overdue_balance,
                        installment: Number(loan_2.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                else {
                    calculator_1 = (0, calurate_1.effectiverateCalculator)({
                        amount: loan_2.amount,
                        remaining: loan_2.remaining,
                        interest_rate: interestRate_1,
                        total_installment: loan_2.total_installment,
                        installment_start: loan_2.installment_start,
                        payment_date: loan_2.installment_due,
                        pay: loan_2.remaining,
                        interest_stack: loan_2.overdue_balance,
                        installment: Number(loan_2.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                delay_days_2 = calculator_1.delay_days, delay_charge_1 = calculator_1.delay_charge, principle_1 = calculator_1.principle, interest_1 = calculator_1.interest, paid_principle_1 = calculator_1.paid_principle, paid_interest_2 = calculator_1.paid_interest, interest_due = calculator_1.interest_due, principle_remaining_1 = calculator_1.principle_remaining, interest_remaining_2 = calculator_1.interest_remaining, installment_2 = calculator_1.installment, props_2 = __rest(calculator_1, ["delay_days", "delay_charge", "principle", "interest", "paid_principle", "paid_interest", "interest_due", "principle_remaining", "interest_remaining", "installment"]);
                _a = _installment_1;
                return [4 /*yield*/, (0, Utils_1.generateReceiptNumber)(plan_1.id)];
            case 11:
                _a.receipt_number = _b.sent();
                _installment_1.plan_id = plan_1.id;
                _installment_1.user_id = loan_2.user_id;
                _installment_1.loan_id = loan_2.id;
                _installment_1.loan_number = loan_2.loan_number;
                _installment_1.installment_date = loan_2.installment_due;
                _installment_1.start_date = loan_2.installment_start;
                _installment_1.per_installment = loan_2.remaining;
                _installment_1.amount = loan_2.amount;
                _installment_1.remaining = 0;
                _installment_1.principle = 0;
                _installment_1.overdue_balance = calculator_1.interest_remaining;
                _installment_1.installment = calculator_1.installment;
                _installment_1.total_installment = loan_2.total_installment;
                _installment_1.isPaid = false;
                _installment_1.paid = Number(loan_2.remaining) + calculator_1.paid_interest;
                _installment_1.delay_days = calculator_1.delay_days > 0 ? calculator_1.delay_days : 0;
                _installment_1.principle_installment = calculator_1.principle;
                _installment_1.interest_installment = calculator_1.interest;
                _installment_1.principle_paid = loan_2.remaining;
                _installment_1.interest_paid = calculator_1.paid_interest;
                _installment_1.delay_charge_paid = calculator_1.delay_charge;
                _installment_1.paid_by = "".concat(user_1.firstname, " - ").concat(user_1.lastname);
                _installment_1.interest_due = plan_1.type_interest === "flatrate" ? 0 : calculator_1.interest_due;
                _installment_1.total_interest = calculator_1.interest + loan_2.overdue_balance - calculator_1.paid_interest;
                _installment_1.principle_next_due = null;
                _installment_1.interest_next_due = null;
                _installment_1.total_amount_next_due = null;
                _installment_1.installment_next_due = null;
                _installment_1.transfer_payment = 0;
                if (applicationFee_1 < 0) {
                    _installment_1.application_charge = 0;
                }
                else {
                    _installment_1.application_charge =
                        Math.round((applicationFee_1 + Number.EPSILON) * 100) / 100;
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).save(_installment_1)];
            case 12:
                _b.sent();
                loan_2.given_installment = calculator_1.installment;
                loan_2.installment_start = _installment_1.start_date;
                loan_2.installment_due = _installment_1.installment_date;
                return [3 /*break*/, 15];
            case 13: 
            // คำนวณงวดที่เหลือ
            return [4 /*yield*/, (function (lastPaid) { return __awaiter(void 0, void 0, void 0, function () {
                    var startInstallment, total_interest, valueInstallment, result, result, firstInstallment, nextInstallment, lastInstallment, _installment_2, _a, totalInterest, interestPerInstallment, paidInstallments, remainingInterest;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                startInstallment = loan_2.approved_at;
                                if (!(plan_1.type_interest === "flatrate")) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, calurate_1.flatrateInstallment)({
                                        loan_id: Number(loan_2.id),
                                        amount: loan_2.amount,
                                        rate: interestRate_1,
                                        installment: loan_2.total_installment,
                                        start: loan_2.startDate,
                                        created: startInstallment,
                                        given_at: Number(loan_2.given_installment),
                                        lastPaid: lastPaid - Number(loan_2.charge_per_installment),
                                        delay_charge: Number(loan_2.charge_per_installment)
                                    })];
                            case 1:
                                result = _b.sent();
                                total_interest = result.total_interest;
                                valueInstallment = result.installment;
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, (0, calurate_1.effevtiverateInstallment)({
                                    loan_id: Number(loan_2.id),
                                    amount: loan_2.amount,
                                    rate: interestRate_1,
                                    installment: loan_2.total_installment,
                                    start: loan_2.startDate,
                                    created: startInstallment,
                                    given_at: Number(loan_2.given_installment),
                                    lastPaid: lastPaid - Number(loan_2.charge_per_installment),
                                    paidDate: paidDate_1,
                                })];
                            case 3:
                                result = _b.sent();
                                total_interest = result.total_interest;
                                valueInstallment = result.installment;
                                _b.label = 4;
                            case 4:
                                firstInstallment = valueInstallment[0], nextInstallment = valueInstallment[1];
                                lastInstallment = Number(loan_2.given_installment) + 1 == Number(loan_2.total_installment);
                                if (!(valueInstallment.length && firstInstallment.remaining >= 0)) return [3 /*break*/, 7];
                                loan_2.given_installment = installment_1;
                                _installment_2 = new loan_installment_1.Installment();
                                _a = _installment_2;
                                return [4 /*yield*/, (0, Utils_1.generateReceiptNumber)(plan_1.id)];
                            case 5:
                                _a.receipt_number = _b.sent();
                                _installment_2.plan_id = plan_1.id;
                                _installment_2.user_id = loan_2.user_id;
                                _installment_2.loan_id = loan_2.id;
                                _installment_2.loan_number = loan_2.loan_number;
                                _installment_2.installment_date = new Date(loan_2.installment_due);
                                _installment_2.start_date = loan_2.installment_start;
                                _installment_2.per_installment = loan_2.per_installment;
                                _installment_2.amount = loan_2.amount;
                                _installment_2.remaining = firstInstallment.remaining;
                                _installment_2.principle = Number(loan_2.principle) - firstInstallment.principle;
                                _installment_2.overdue_balance = interest_remaining_1;
                                _installment_2.outstanding_balance = firstInstallment.remaining;
                                _installment_2.installment = installment_1 + 1;
                                _installment_2.total_installment = loan_2.total_installment;
                                _installment_2.isPaid = false;
                                _installment_2.paid = firstInstallment.amount;
                                _installment_2.delay_days = delay_days_1 > 0 ? delay_days_1 : 0;
                                _installment_2.per_installment = loan_2.per_installment;
                                _installment_2.principle_installment = firstInstallment.principle;
                                _installment_2.interest_installment = firstInstallment.interest;
                                _installment_2.principle_paid = firstInstallment.principle;
                                _installment_2.interest_paid = firstInstallment.interest;
                                _installment_2.delay_charge_paid = 0;
                                _installment_2.paid_by = "".concat(user_1.firstname, " - ").concat(user_1.lastname);
                                if (plan_1.type_interest === "flatrate") {
                                    totalInterest = loan_2.amount * (Number(loan_2.loan_interest) / 100) * (loan_2.total_installment / 12);
                                    interestPerInstallment = Math.round((totalInterest / loan_2.total_installment + Number.EPSILON) * 100) / 100;
                                    paidInstallments = Number(loan_2.given_installment);
                                    remainingInterest = totalInterest - (interestPerInstallment * (paidInstallments + 1));
                                    _installment_2.interest_due = 0;
                                    _installment_2.total_interest = remainingInterest;
                                }
                                else {
                                    _installment_2.interest_due = firstInstallment.interest;
                                    _installment_2.total_interest = (total_interest + interest_remaining_1) - firstInstallment.interest;
                                }
                                if (nextInstallment) {
                                    _installment_2.principle_next_due = lastInstallment
                                        ? loan_2.remaining
                                        : nextInstallment.principle;
                                    _installment_2.interest_next_due = nextInstallment.interest;
                                    _installment_2.total_amount_next_due = nextInstallment.remaining;
                                    _installment_2.installment_next_due = nextInstallment.date;
                                }
                                _installment_2.transfer_payment = 0;
                                _installment_2.application_charge = applicationFee_1 < 0 ? 0 :
                                    Math.round((applicationFee_1 + Number.EPSILON) * 100) / 100;
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).save(_installment_2)];
                            case 6:
                                _b.sent();
                                _b.label = 7;
                            case 7: 
                            // อัพเดท installment ล่าสุด
                            return [4 /*yield*/, (function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var _installment;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).findOne({
                                                    where: { isPaid: true, loan_id: loan_2.id },
                                                    order: { created_at: "DESC" },
                                                })];
                                            case 1:
                                                _installment = _a.sent();
                                                if (plan_1.type_interest === "flatrate") {
                                                    _installment.total_interest = total_interest;
                                                }
                                                else {
                                                    _installment.total_interest = (beforeInterest_1 + total_interest + interest_remaining_1) - paid_interest_1;
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
                                                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).save(_installment)];
                                            case 2:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); })()];
                            case 8:
                                // อัพเดท installment ล่าสุด
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                }); })(_installment.paid)];
            case 14:
                // คำนวณงวดที่เหลือ
                _b.sent();
                _b.label = 15;
            case 15: return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan_2)];
            case 16:
                _b.sent();
                orders = [
                    {
                        name: "เงินต้น",
                        amount: "".concat(paid_principle.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }), " \u0E1A\u0E32\u0E17"),
                    },
                    {
                        name: "ดอกเบี้ย",
                        amount: "".concat(paid_interest_1.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }), " \u0E1A\u0E32\u0E17"),
                    },
                    {
                        name: "ค่าทวงถาม",
                        amount: "".concat(delay_charge.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }), " \u0E1A\u0E32\u0E17"),
                    },
                ];
                totalAmount = paid_principle + paid_interest_1 + delay_charge;
                sendTotal = "".concat(totalAmount.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }), " \u0E1A\u0E32\u0E17");
                formattedInstallmentDate = new Intl.DateTimeFormat("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }).format(new Date());
                bill = _installment.receipt_number;
                if (user_1.line_id != "")
                    (0, module_1.Line_SendSlip)(user_1.line_id, plan_1.name, bill, loan_2.loan_number, formattedInstallmentDate, "".concat(loan_2.given_installment, "/").concat(loan_2.total_installment), orders, sendTotal, "".concat(user_1.firstname, " ").concat(user_1.lastname));
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
                    return [2 /*return*/, _founded];
                }
                return [3 /*break*/, 18];
            case 17:
                err_1 = _b.sent();
                console.log(err_1);
                _founded.update_installment = "error";
                _founded.message = "โค๊ดในระบบมีปัญหา";
                return [2 /*return*/, _founded];
            case 18: return [2 /*return*/];
        }
    });
}); };
var createPayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, loan_number, amount, refno, encodedTotal, encodedReferenceNo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, loan_number = _a.loan_number, amount = _a.amount;
                if (!(0, Utils_1.isValidDecimalNumber)(amount))
                    return [2 /*return*/, res.error("จำนวนเงินไม่ถูกต้อง")];
                refno = String(new Date().getTime() / 10000).split(".")[1] + (0, Utils_1.randomNumber)(4);
                encodedTotal = encodeURIComponent(amount);
                encodedReferenceNo = encodeURIComponent(refno);
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).save({
                        referenceNo: refno,
                        total: amount,
                        merchantid: process.env.PAYSOLUTION_MERCHANTID,
                        loan_number: loan_number,
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/, res.redirect("".concat(process.env.REDIRECT_URI, "/payment/").concat(loan_number, "/").concat(encodedReferenceNo, "/").concat(encodedTotal))];
        }
    });
}); };
exports.createPayment = createPayment;
var createPaymentAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, loan_number, amount, loan, users, refno, encodedTotal, encodedEmail, encodedReferenceNo;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, loan_number = _a.loan_number, amount = _a.amount;
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({ where: { loan_number: loan_number } })];
            case 1:
                loan = _b.sent();
                if (!loan)
                    return [2 /*return*/, res.redirect(process.env.REDIRECT_URI_OFFICE)];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan.user_id } })];
            case 2:
                users = _b.sent();
                if (!users)
                    return [2 /*return*/, res.redirect(process.env.REDIRECT_URI_OFFICE)];
                if (!(0, Utils_1.isValidDecimalNumber)(amount))
                    return [2 /*return*/, res.error("จำนวนเงินไม่ถูกต้อง")];
                refno = String(new Date().getTime() / 10000).split(".")[1] + (0, Utils_1.randomNumber)(4);
                encodedTotal = encodeURIComponent(amount);
                encodedEmail = encodeURIComponent(users.email);
                encodedReferenceNo = encodeURIComponent(refno);
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).save({
                        referenceNo: refno,
                        total: amount,
                        merchantid: process.env.PAYSOLUTION_MERCHANTID,
                        loan_number: loan_number,
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, res.redirect("".concat(process.env.REDIRECT_URI_OFFICE, "/payment/").concat(loan_number, "/").concat(encodedReferenceNo, "/").concat(encodedTotal, "/").concat(encodedEmail))];
        }
    });
}); };
exports.createPaymentAdmin = createPaymentAdmin;
var createQR = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, loan_number, amount, haved, referenceNo, etc, merchantID, productDetail, customerEmail, customerName, encodedTotal, encodedReferenceNo, url, paymentResponse, base64Image, imageBuffer, filename, uploadPath, result, referenceNo, etc, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, loan_number = _a.loan_number, amount = _a.amount;
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).findOne({
                        where: { loan_number: loan_number, update_installment: "pending" },
                        order: { created_at: "DESC" },
                    })];
            case 1:
                haved = _b.sent();
                if (haved) {
                    if (moment.tz(haved.expiredate, "Asia/Bangkok").toDate().getTime() >
                        moment().tz("Asia/Bangkok").toDate().getTime() &&
                        Number(haved.total) === Number(amount)) {
                        referenceNo = haved.referenceNo, etc = __rest(haved, ["referenceNo"]);
                        return [2 /*return*/, res.success("Success", etc)];
                    }
                }
                if (!(0, Utils_1.isValidDecimalNumber)(amount))
                    return [2 /*return*/, res.error("จำนวนเงินไม่ถูกต้อง")];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, , 8]);
                merchantID = encodeURIComponent(process.env.PAYSOLUTION_MERCHANTID);
                productDetail = encodeURIComponent("QRPAYMENT");
                customerEmail = encodeURIComponent("info@moneyforyou.co.th");
                customerName = encodeURIComponent("moneyforyou");
                encodedTotal = encodeURIComponent(amount);
                encodedReferenceNo = encodeURIComponent(String(new Date().getTime() / 10000).split(".")[1] + (0, Utils_1.randomNumber)(4));
                url = "https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=".concat(merchantID, "&productDetail=").concat(productDetail, "&customerEmail=").concat(customerEmail, "&customerName=").concat(customerName, "&total=").concat(encodedTotal, "&referenceNo=").concat(encodedReferenceNo);
                return [4 /*yield*/, axios_1.default.post(url, null, {
                        headers: {
                            Accept: "application/json",
                            Authorization: "Bearer " + process.env.PAYSOLUTION_APIKEY,
                        },
                    })];
            case 3:
                paymentResponse = _b.sent();
                if (paymentResponse.data.status != "success")
                    return [2 /*return*/, res.error("Error creating")];
                base64Image = paymentResponse.data.data.image.split(";base64,").pop();
                imageBuffer = Buffer.from(base64Image, "base64");
                filename = "".concat(paymentResponse.data.data.orderNo, "-").concat(new Date().getTime(), ".png");
                uploadPath = path.join(__dirname, "../../../uploads/qrcode", filename);
                return [4 /*yield*/, sharp(imageBuffer).toFile(uploadPath)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, Utils_1.processQRCodeFromImage)(uploadPath, filename)];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).save(__assign(__assign({}, paymentResponse.data.data), { image: "qrcode/".concat(filename), barcode: "barcode/".concat(filename), loan_number: loan_number }))];
            case 6:
                result = _b.sent();
                referenceNo = result.referenceNo, etc = __rest(result, ["referenceNo"]);
                return [2 /*return*/, res.success("Success", etc)];
            case 7:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก")];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createQR = createQR;
var LineCreateQR = function (_a) {
    var loan_number = _a.loan_number, amount = _a.amount;
    return __awaiter(void 0, void 0, void 0, function () {
        var haved, merchantID, productDetail, customerEmail, customerName, encodedTotal, encodedReferenceNo, url, paymentResponse, base64Image, imageBuffer, filename, uploadPath, result, err_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).findOne({
                        where: { loan_number: loan_number, update_installment: "pending" },
                        order: { created_at: "DESC" },
                    })];
                case 1:
                    haved = _b.sent();
                    if (haved) {
                        if (moment.tz(haved.expiredate, "Asia/Bangkok").toDate().getTime() >
                            moment().tz("Asia/Bangkok").toDate().getTime() &&
                            Number(haved.total) === Number(amount)) {
                            return [2 /*return*/, "".concat(process.env.USER_DOMAIN, "/file/").concat(haved.image)];
                        }
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, , 8]);
                    merchantID = encodeURIComponent(process.env.PAYSOLUTION_MERCHANTID);
                    productDetail = encodeURIComponent("QRPAYMENT");
                    customerEmail = encodeURIComponent("info@moneyforyou.co.th");
                    customerName = encodeURIComponent("moneyforyou");
                    encodedTotal = encodeURIComponent(amount);
                    encodedReferenceNo = encodeURIComponent(String(new Date().getTime() / 10000).split(".")[1] + (0, Utils_1.randomNumber)(4));
                    url = "https://apis.paysolutions.asia/tep/api/v2/promptpay?merchantID=".concat(merchantID, "&productDetail=").concat(productDetail, "&customerEmail=").concat(customerEmail, "&customerName=").concat(customerName, "&total=").concat(encodedTotal, "&referenceNo=").concat(encodedReferenceNo);
                    return [4 /*yield*/, axios_1.default.post(url, null, {
                            headers: {
                                Accept: "application/json",
                                Authorization: "Bearer " + process.env.PAYSOLUTION_APIKEY,
                            },
                        })];
                case 3:
                    paymentResponse = _b.sent();
                    if (paymentResponse.data.status != "success") {
                        return [2 /*return*/, false];
                    }
                    base64Image = paymentResponse.data.data.image.split(";base64,").pop();
                    imageBuffer = Buffer.from(base64Image, "base64");
                    filename = "".concat(paymentResponse.data.data.orderNo, "-").concat(new Date().getTime(), ".png");
                    uploadPath = path.join(__dirname, "../../../uploads/qrcode", filename);
                    return [4 /*yield*/, sharp(imageBuffer).toFile(uploadPath)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, (0, Utils_1.processQRCodeFromImage)(uploadPath, filename)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).save(__assign(__assign({}, paymentResponse.data.data), { image: "qrcode/".concat(filename), barcode: "barcode/".concat(filename), loan_number: loan_number }))];
                case 6:
                    result = _b.sent();
                    return [2 /*return*/, "".concat(process.env.USER_DOMAIN, "/file/").concat(result.image)];
                case 7:
                    err_3 = _b.sent();
                    console.log(err_3);
                    return [2 /*return*/, false];
                case 8: return [2 /*return*/];
            }
        });
    });
};
exports.LineCreateQR = LineCreateQR;
