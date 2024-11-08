"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatrateInstallment = exports.flatrateCalculator = exports.effevtiverateInstallment = exports.installmentRemaining = exports.remainingCalcurate = exports.calcurator = exports.effectiverateCalculator = exports.paymentCalculator = exports.ApiCalcurator = exports.getDaysInYear = void 0;
var payment_1 = require("../../../components/payment");
var data_source_1 = require("../../../data-source");
var loan_installment_1 = require("../entities/loan_installment");
function getDaysInYear(year) {
    return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}
exports.getDaysInYear = getDaysInYear;
// วิธีการเรียกใช้
// const test = paymentCalculator(50000,50000,36,24,'2024-09-22','2024-09-23');
// console.log(test)
// paymentCalculator(จำนวนยอดกู้,ยอดกู้คงเหลือ,อัตราดอกเบี้ย (%),จำนวนงวดรวม,วันเริ่มนับชำระ,วันชำระจริง);
// export const paymentCalculator = ({
//   amount,
//   remaining,
//   interest_rate,
//   total_installment,
//   installment_start,
//   installment_due = null,
//   payment_date,
//   pay = 0,
//   interest_stack = 0,
//   installment = 1,
//   pay_days = 30,
//   delay_days = 15,
//   delay_charge = 50,
// }) => {
//   const __rate = Number(interest_rate) / 100 / 12;
//   const __diff = Number(amount) * __rate;
//   const __pill = Math.pow(1 + __rate, total_installment);
//   const __diff2 = __diff * __pill;
//   const __pill2 = __pill - 1;
//   const __installment_per_month = __diff2 / __pill2;
//   let startDate = new Date(installment_start || Date.now());
//   let currentDate = new Date(payment_date || Date.now());
//   let dueDate = installment_due ? new Date(installment_due) : currentDate;
//   const year = currentDate.getFullYear();
//   const daysInYear = getDaysInYear(year);
//   const timeDifference = currentDate.getTime() - startDate.getTime();
//   const dueDifference = dueDate.getTime() - startDate.getTime();
//   // nextDate = currentDate;
//   const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//   const daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));
//   let __delay_times = Math.floor(
//     (daysPassed - Number(pay_days)) / Number(delay_days)
//   );
//   __delay_times = __delay_times < 0 ? 0 : __delay_times;
//   let __delay_charge = __delay_times * Number(delay_charge);
//   let __delay_days = daysPassed - Number(pay_days);
//   let __interest =
//     (Number(remaining) * (Number(interest_rate) / 100) * daysPassed) /
//     daysInYear;
//   let __interest_due =
//     (Number(remaining) * (Number(interest_rate) / 100) * daysDue) / daysInYear;
//   if (__interest <= 0) __interest = 0;
//   let __principle =
//     __installment_per_month - (__interest + __delay_charge) <= 0
//       ? 0
//       : __installment_per_month - (__interest + __delay_charge);
//   if (Number(total_installment) <= Number(installment))
//     __principle = Number(remaining);
//   else if (__principle > Number(remaining)) __principle = Number(remaining);
//   const __max =
//     __principle + __interest + Number(interest_stack) + __delay_charge;
//   const __min = __interest;
//   const __nor = __max > Number(remaining) ? __max : __installment_per_month;
//   const __close = Number(remaining) + __interest + Number(interest_stack);
//   let __paid = 0;
//   let __interest_stack = Number(interest_stack);
//   let __paid_interest = 0;
//   const _r = __max - Number(pay) <= 0 ? 0 : __max - Number(pay);
//   if (_r === 0) {
//     __paid = Number(pay) - (__interest + Number(interest_stack));
//     __paid_interest = __interest + Number(interest_stack) - __delay_charge;
//     __interest_stack = 0;
//   } else if (_r > 0) {
//     if (_r > __principle) {
//       __interest_stack = _r - __principle;
//       __paid_interest = Number(pay) - __delay_charge;
//     } else {
//       __paid = __principle - _r;
//       __paid_interest = __interest + Number(interest_stack) - __delay_charge;
//       __interest_stack = 0;
//     }
//   }
//   let __remaining = Number(remaining) - __paid;
//   return {
//     days: daysPassed,
//     daysInYear: daysInYear,
//     principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
//     interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
//     interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
//     max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
//     mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
//     nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
//     close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
//     installment: installment,
//     total_installment: total_installment,
//     paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
//     paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
//     principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
//     interest_remaining:
//       Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
//     delay_charge: __delay_charge,
//     delay_times: __delay_times,
//     delay_days: __delay_days,
//   };
// };
var ApiCalcurator = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, remaining, interest_rate, total_installment, installment_date, payment_date, pay, interest_stack, installment, _b, type_interest, pay_days, delay_value, delay_charge, _calurate;
    return __generator(this, function (_c) {
        _a = req.body, amount = _a.amount, remaining = _a.remaining, interest_rate = _a.interest_rate, total_installment = _a.total_installment, installment_date = _a.installment_date, payment_date = _a.payment_date, pay = _a.pay, interest_stack = _a.interest_stack, installment = _a.installment, _b = _a.type_interest, type_interest = _b === void 0 ? "effectiverate" : _b, pay_days = _a.pay_days, delay_value = _a.delay_value, delay_charge = _a.delay_charge;
        _calurate = type_interest === 'effectiverate' ? (0, exports.effectiverateCalculator)({
            amount: amount,
            remaining: remaining,
            interest_rate: interest_rate,
            total_installment: total_installment,
            installment_start: installment_date,
            payment_date: payment_date,
            pay: pay,
            interest_stack: interest_stack,
            installment: installment,
            pay_days: pay_days,
            delay_days: delay_value,
            delay_charge: delay_charge,
        }) : (0, exports.flatrateCalculator)({
            amount: amount,
            remaining: remaining,
            interest_rate: interest_rate,
            total_installment: total_installment,
            installment_start: installment_date,
            payment_date: payment_date,
            pay: pay,
            interest_stack: interest_stack,
            installment: installment,
            pay_days: pay_days,
            delay_days: delay_value,
            delay_charge: delay_charge,
        });
        return [2 /*return*/, res.success("Success", _calurate)];
    });
}); };
exports.ApiCalcurator = ApiCalcurator;
// export const calcurator = async (req, res) => {
//   const { amount, rate, installment, start, created } = req.body;
//   const { t } = req.query;
//   const __rate = Number(rate) / 100 / 12;
//   const __diff =  Number(amount) * __rate;
//   const __pill =  Math.pow(1 + __rate, installment);
//   const __diff2 = __diff * __pill;
//   const __pill2 = __pill - 1;
//   const __installment_per_month =  __diff2 / __pill2;
//   let __totalInstallment = __installment_per_month * installment;
//   let totalAmount = Number(amount);
//   let nextDate = new Date(created || Date.now());
//   let __array = Array.from({ length: Number(installment) }).map((_, i) => {
//     let currentDate = new Date(start || Date.now());
//     currentDate.setMonth(currentDate.getMonth() + i);
//     const timeDifference = currentDate.getTime() - nextDate.getTime();
//     nextDate = currentDate;
//     const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//     const year = currentDate.getFullYear();
//     const daysInYear = getDaysInYear(year);
//     const __interest =
//       (totalAmount * (Number(rate) / 100) * daysPassed) / daysInYear;
//     let __principle =
//       __installment_per_month - __interest <= 0
//         ? 0
//         : __installment_per_month - __interest;
//     if (i === Number(installment) - 1) {
//       __principle = totalAmount;
//     } else if (__principle > totalAmount) __principle = totalAmount;
//     else if (totalAmount === 0)
//       return {
//         date: currentDate,
//         amount: 0,
//         interest: 0,
//         principle: 0,
//         remaining: 0,
//         receive: totalAmount,
//         days: 0,
//       };
//     totalAmount = totalAmount - __principle;
//     const __receive = Number(amount) - totalAmount;
//     const __amount = __principle + __interest;
//     return {
//       date: currentDate,
//       amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
//       interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
//       principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
//       remaining: Math.round((totalAmount + Number.EPSILON) * 100) / 100,
//       receive: Math.round((__receive + Number.EPSILON) * 100) / 100,
//       days: daysPassed,
//     };
//   });
//   if (t && !isNaN(t)) __array = __array.splice(t);
//   const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
//   __totalInstallment = __array.reduce((a, b) => a + b.principle + b.interest, 0);
//   return res.success("คำนวนสำเร็จ", {
//     amount: Math.round((amount + Number.EPSILON) * 100) / 100,
//     interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
//     total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
//     pay_per_month:
//       Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
//     total_receive:
//       Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
//     total_interest:
//       Math.round((interestRemaining + Number.EPSILON) * 100) /
//       100,
//     installment: __array,
//   });
// };
// export const remainingCalcurate = ({ amount, rate, installment, start, created,given_at }) => {
//   const __rate = Number(rate) / 100 / 12;
//   const __diff =  Number(amount) * __rate;
//   const __pill =  Math.pow(1 + __rate, installment);
//   const __diff2 = __diff * __pill;
//   const __pill2 = __pill - 1;
//   const __installment_per_month =  __diff2 / __pill2;
//   let __totalInstallment = __installment_per_month * installment;
//   let totalAmount = Number(amount);
//   let nextDate = new Date(created || Date.now());
//   let __array = Array.from({ length: Number(installment) }).map((_, i) => {
//     let currentDate = new Date(start || Date.now());
//     currentDate.setMonth(currentDate.getMonth() + i);
//     const timeDifference = currentDate.getTime() - nextDate.getTime();
//     nextDate = currentDate;
//     const daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//     const year = currentDate.getFullYear();
//     const daysInYear = getDaysInYear(year);
//     const __interest =
//       (totalAmount * (Number(rate) / 100) * daysPassed) / daysInYear;
//     let __principle =
//       __installment_per_month - __interest <= 0
//         ? 0
//         : __installment_per_month - __interest;
//     if (i === Number(installment) - 1) {
//       __principle = totalAmount;
//     } else if (__principle > totalAmount) __principle = totalAmount;
//     else if (totalAmount === 0)
//       return {
//         date: currentDate,
//         amount: 0,
//         interest: 0,
//         principle: 0,
//         remaining: 0,
//         receive: totalAmount,
//         days: 0,
//       };
//     totalAmount = totalAmount - __principle;
//     const __receive = Number(amount) - totalAmount;
//     const __amount = __principle + __interest;
//     return {
//       date: currentDate,
//       amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
//       interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
//       principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
//       remaining: Math.round((totalAmount + Number.EPSILON) * 100) / 100,
//       receive: Math.round((__receive + Number.EPSILON) * 100) / 100,
//       days: daysPassed,
//     };
//   });
//   if (given_at && !isNaN(given_at)) __array = __array.splice(given_at);
//   const interestRemaining = __array.reduce((a, b) => a + b.interest, 0);
//   __totalInstallment = __array.reduce((a, b) => a + b.principle + b.interest, 0);
//   return {
//     amount: Math.round((amount + Number.EPSILON) * 100) / 100,
//     interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
//     total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
//     pay_per_month:
//       Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
//     total_receive:
//       Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
//     total_interest:
//       Math.round((interestRemaining + Number.EPSILON) * 100) /
//       100,
//     installment: __array,
//   }
// };
function getDaysInYears(year) {
    return (year % 4 === 0 && year % 100 > 0) || year % 400 === 0 ? 366 : 365;
}
var paymentCalculator = function (_a) {
    var _b = _a.type_interest, type_interest = _b === void 0 ? "effectiverate" : _b, amount = _a.amount, remaining = _a.remaining, interest_rate = _a.interest_rate, total_installment = _a.total_installment, installment_start = _a.installment_start, _c = _a.installment_due, installment_due = _c === void 0 ? null : _c, payment_date = _a.payment_date, _d = _a.pay, pay = _d === void 0 ? 0 : _d, _e = _a.interest_stack, interest_stack = _e === void 0 ? 0 : _e, _f = _a.installment, installment = _f === void 0 ? 1 : _f, _g = _a.pay_days, pay_days = _g === void 0 ? 30 : _g, _h = _a.delay_days, delay_days = _h === void 0 ? 15 : _h, _j = _a.delay_charge, delay_charge = _j === void 0 ? 50 : _j;
    var __amount = Number(amount);
    var _remaining = Number(remaining);
    var __rate = Number(interest_rate) / 100 / 12;
    var __installment_per_month = 0;
    var __interest = 0;
    var __principle = 0;
    var __interest_due = 0;
    var total_principle = 0;
    if (type_interest === "flatrate") {
        // คำนวณดอกเบี้ยคงที่ (Flat Rate)
        var totalInterest = __amount * (Number(interest_rate) / 100) * (total_installment / 12);
        var totalAmount = __amount;
        __interest = totalInterest / total_installment;
        if (Number(installment) < Number(total_installment)) {
            __principle = totalAmount / total_installment;
        }
        __installment_per_month = Math.round((((totalAmount + totalInterest) / total_installment) + Number.EPSILON) * 100) /
            100;
        if (Number(pay) > 0 && Number(pay) < __interest) {
            __interest = Number(pay); // หักดอกเบี้ยเท่าที่จ่ายจริง
        }
        // คำนวณเงินต้นคงเหลือ
        var monthlyPrinciple = Math.round(((totalAmount / total_installment) + Number.EPSILON) * 100) / 100;
        var installmentPaid = installment - 1;
        var totalPrinciplePaid = installmentPaid * monthlyPrinciple;
        total_principle = Math.round(((totalAmount - totalPrinciplePaid) + Number.EPSILON) * 100) / 100;
        // งวดสุดท้าย
        if (installment === total_installment ||
            __installment_per_month > _remaining)
            __installment_per_month =
                Math.round((_remaining + Number.EPSILON) * 100) /
                    100;
        // if(__installment_per_month >= _remaining) __interest = __interest*(Number(total_installment)-(Number(installment)-1))
        __principle = __installment_per_month - __interest;
    }
    else {
        __installment_per_month = (0, payment_1.pillComponent)(__amount, __rate, total_installment);
    }
    var startDate = new Date(installment_start || new Date().toISOString().split("T")[0]);
    var currentDate = new Date(new Date(payment_date).toISOString().split("T")[0] || new Date().toISOString().split("T")[0]);
    var dueDate = installment_due ? new Date(installment_due) : currentDate;
    // ใช้ UTC เพื่อตัดเวลาออก
    // const timeDifference = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
    //                      - Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    // const dueDifference = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate())
    //                     - Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    var timeDifference = currentDate.getTime() - startDate.getTime();
    var dueDifference = dueDate.getTime() - startDate.getTime();
    var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));
    var year = currentDate.getFullYear();
    var daysInYear = getDaysInYear(year);
    // คำนวณค่าปรับล่าช้า
    var __delay_times = Math.floor((daysPassed - Number(pay_days)) / Number(delay_days));
    __delay_times = __delay_times < 0 ? 0 : __delay_times;
    var __delay_charge = __delay_times * Number(delay_charge);
    var __delay_days = daysPassed - Number(pay_days);
    if (type_interest === "effectiverate") {
        // คำนวณดอกเบี้ยลดต้นลดดอก (Effective Rate)
        var __dailyInterestRate = Number(interest_rate) / 100 / daysInYear;
        __interest = Number(remaining) * __dailyInterestRate * daysPassed;
        __interest_due = Number(remaining) * __dailyInterestRate * daysDue;
        if (__interest <= 0)
            __interest = 0;
        __principle = __installment_per_month - __interest - __delay_charge;
        if (__principle <= 0)
            __principle = 0;
        if (Number(total_installment) <= Number(installment) ||
            __principle > Number(remaining)) {
            __principle = Number(remaining);
        }
    }
    var __max = __principle + __interest + Number(interest_stack) + __delay_charge;
    var __min = __interest;
    var __nor = Math.min(__max, __installment_per_month);
    var __close = _remaining + __interest + Number(interest_stack);
    if (type_interest === "flatrate" && _remaining <= __installment_per_month) {
        __close = _remaining + Number(interest_stack);
    }
    if (Number(total_installment) <= Number(installment) ||
        __principle > Number(remaining)) {
        __nor = __close;
    }
    var __paid = 0;
    var __interest_stack = Number(interest_stack);
    var __paid_interest = 0;
    var _r = Math.max(0, __max - Number(pay));
    if (_r === 0) {
        __paid = Number(pay) - (__interest + Number(interest_stack));
        __paid_interest = __interest + Number(interest_stack) - __delay_charge;
        __interest_stack = 0;
    }
    else if (_r > 0) {
        if (_r > __principle) {
            __interest_stack = _r - __principle;
            __paid_interest = Number(pay) - __delay_charge;
        }
        else {
            __paid = __principle - _r;
            __paid_interest = __interest + Number(interest_stack) - __delay_charge;
            __interest_stack = 0;
        }
    }
    var __remaining = _remaining - __paid;
    if (type_interest === "flatrate" && Number(pay) > 0) {
        __remaining = _remaining - (__paid + __interest);
        total_principle = total_principle - __paid;
    }
    // ปัดเศษผลลัพธ์สุดท้ายก่อนส่งคืน
    return {
        days: daysPassed,
        daysInYear: daysInYear,
        principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
        interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
        interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
        max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
        mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
        nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
        close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
        installment: installment,
        total_installment: total_installment,
        paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
        paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
        total_principle: Math.round((total_principle + Number.EPSILON) * 100) / 100,
        principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
        interest_remaining: Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
        delay_charge: Math.round((__delay_charge + Number.EPSILON) * 100) / 100,
        delay_times: __delay_times,
        delay_days: __delay_days,
    };
};
exports.paymentCalculator = paymentCalculator;
var effectiverateCalculator = function (_a) {
    var amount = _a.amount, remaining = _a.remaining, interest_rate = _a.interest_rate, total_installment = _a.total_installment, installment_start = _a.installment_start, _b = _a.installment_due, installment_due = _b === void 0 ? null : _b, payment_date = _a.payment_date, _c = _a.pay, pay = _c === void 0 ? 0 : _c, _d = _a.interest_stack, interest_stack = _d === void 0 ? 0 : _d, _e = _a.installment, installment = _e === void 0 ? 1 : _e, _f = _a.pay_days, pay_days = _f === void 0 ? 30 : _f, _g = _a.delay_days, delay_days = _g === void 0 ? 15 : _g, _h = _a.delay_charge, delay_charge = _h === void 0 ? 50 : _h;
    var __amount = Number(amount);
    var _remaining = Number(remaining);
    var __rate = Number(interest_rate) / 100 / 12;
    var __installment_per_month = 0;
    var __interest = 0;
    var __principle = 0;
    var __interest_due = 0;
    var total_principle = 0;
    __installment_per_month = (0, payment_1.pillComponent)(__amount, __rate, total_installment);
    var startDate = new Date(installment_start || new Date().toISOString().split("T")[0]);
    var currentDate = new Date(new Date(payment_date).toISOString().split("T")[0] || new Date().toISOString().split("T")[0]);
    var dueDate = installment_due ? new Date(installment_due) : currentDate;
    // ใช้ UTC เพื่อตัดเวลาออก
    // const timeDifference = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate())
    //                      - Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    // const dueDifference = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate())
    //                     - Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
    var timeDifference = currentDate.getTime() - startDate.getTime();
    var dueDifference = dueDate.getTime() - startDate.getTime();
    var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));
    var year = currentDate.getFullYear();
    var daysInYear = getDaysInYear(year);
    // คำนวณค่าปรับล่าช้า
    var __delay_times = Math.floor((daysPassed - Number(pay_days)) / Number(delay_days));
    __delay_times = __delay_times < 0 ? 0 : __delay_times;
    var __delay_charge = __delay_times * Number(delay_charge);
    var __delay_days = daysPassed - Number(pay_days);
    // คำนวณดอกเบี้ยลดต้นลดดอก (Effective Rate)
    var __dailyInterestRate = Number(interest_rate) / 100 / daysInYear;
    __interest = Number(remaining) * __dailyInterestRate * daysPassed;
    __interest_due = Number(remaining) * __dailyInterestRate * daysDue;
    if (__interest <= 0)
        __interest = 0;
    __principle = __installment_per_month - __interest;
    if (__principle <= 0)
        __principle = 0;
    if (Number(total_installment) <= Number(installment) ||
        __principle > Number(remaining)) {
        __principle = Number(remaining);
    }
    var __max = __principle + __interest + Number(interest_stack) + __delay_charge;
    var __min = __interest;
    var __nor = Math.min(__max, __installment_per_month);
    var __close = _remaining + __interest + Number(interest_stack) + __delay_charge;
    if (Number(total_installment) <= Number(installment) ||
        __principle > Number(remaining)) {
        __nor = __close;
    }
    var __paid = 0;
    var __interest_stack = Number(interest_stack);
    var __paid_interest = 0;
    var _r = Math.max(0, __max - Number(pay));
    if (_r === 0) {
        __paid = Number(pay) - (__interest + Number(interest_stack)) - __delay_charge;
        // __paid_interest = __interest + Number(interest_stack) - __delay_charge;
        __paid_interest = __interest + Number(interest_stack);
        __interest_stack = 0;
    }
    else if (_r > 0) {
        if (_r > __principle) {
            __interest_stack = _r - __principle;
            __paid_interest = Number(pay);
        }
        else {
            __paid = __principle - _r;
            __paid_interest = __interest + Number(interest_stack);
            __interest_stack = 0;
        }
    }
    var __remaining = _remaining - __paid;
    console.log('given_installment', installment);
    console.log('remaining', __remaining);
    console.log('principle', __principle);
    console.log('interest', __interest);
    console.log('principle_paid', __paid);
    console.log('interest_paid', __paid_interest);
    console.log('delay_charge', __delay_charge);
    console.log('interest_stack', interest_stack);
    // ปัดเศษผลลัพธ์สุดท้ายก่อนส่งคืน
    return {
        days: daysPassed,
        daysInYear: daysInYear,
        principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
        interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
        interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
        max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
        mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
        nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
        close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
        installment: installment,
        total_installment: total_installment,
        paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
        paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
        total_principle: Math.round((total_principle + Number.EPSILON) * 100) / 100,
        principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
        interest_remaining: Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
        delay_charge: Math.round((__delay_charge + Number.EPSILON) * 100) / 100,
        delay_times: __delay_times,
        delay_days: __delay_days,
    };
};
exports.effectiverateCalculator = effectiverateCalculator;
var calcurator = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, rate, installment, start, created, type_interest, given_at, paid, _b, t, loan_id, __rate, __amount, result, _c, __installment_per_month, __array, totalInterest_1, totalAmount_1, remainingAmount_1, nextDate_1, totalAmount_2, nextDate_2, interestRemaining, principalRemaining, __totalInstallment;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, amount = _a.amount, rate = _a.rate, installment = _a.installment, start = _a.start, created = _a.created, type_interest = _a.type_interest, given_at = _a.given_at, paid = _a.paid;
                _b = req.query, t = _b.t, loan_id = _b.loan_id;
                __rate = Number(rate) / 100 / 12;
                __amount = Number(amount);
                if (!loan_id) return [3 /*break*/, 5];
                if (!(type_interest === 'effectiverate')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports.effevtiverateInstallment)({
                        loan_id: loan_id,
                        amount: __amount,
                        rate: Number(rate),
                        installment: installment,
                        start: start,
                        created: created,
                        given_at: Number(given_at),
                        lastPaid: paid,
                    })];
            case 1:
                _c = _d.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, (0, exports.flatrateInstallment)({
                    loan_id: loan_id,
                    amount: __amount,
                    rate: Number(rate),
                    installment: installment,
                    start: start,
                    created: created,
                    given_at: Number(given_at),
                    lastPaid: paid,
                })];
            case 3:
                _c = _d.sent();
                _d.label = 4;
            case 4:
                result = _c;
                return [2 /*return*/, res.success("คำนวณสำเร็จ", result)];
            case 5:
                if (type_interest == "flatrate") {
                    totalInterest_1 = __amount * (Number(rate) / 100) * (installment / 12);
                    totalAmount_1 = __amount + totalInterest_1;
                    __installment_per_month =
                        Math.round((totalAmount_1 / installment + Number.EPSILON) * 100) / 100;
                    remainingAmount_1 = totalAmount_1;
                    nextDate_1 = new Date(created || Date.now());
                    __array = Array.from({ length: Number(installment) }).map(function (_, i) {
                        var currentDate = new Date(start || Date.now());
                        currentDate.setMonth(currentDate.getMonth() + i);
                        // const timeDifference =
                        //   Date.UTC(
                        //     currentDate.getUTCFullYear(),
                        //     currentDate.getUTCMonth(),
                        //     currentDate.getUTCDate()
                        //   ) -
                        //   Date.UTC(
                        //     nextDate.getUTCFullYear(),
                        //     nextDate.getUTCMonth(),
                        //     nextDate.getUTCDate()
                        //   );
                        var timeDifference = currentDate.getTime() - nextDate_1.getTime();
                        nextDate_1 = currentDate;
                        var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        var __principle, __interest, __amount_per_month;
                        if (i === Number(installment) - 1) {
                            // งวดสุดท้าย
                            __amount_per_month =
                                Math.round((remainingAmount_1 + Number.EPSILON) * 100) / 100;
                            __interest =
                                Math.round((totalInterest_1 / installment + Number.EPSILON) * 100) /
                                    100;
                            __principle =
                                Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
                                    100;
                        }
                        else {
                            __amount_per_month = __installment_per_month;
                            __interest =
                                Math.round((totalInterest_1 / installment + Number.EPSILON) * 100) /
                                    100;
                            __principle =
                                Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
                                    100;
                        }
                        remainingAmount_1 =
                            Math.round((remainingAmount_1 - __amount_per_month + Number.EPSILON) * 100) / 100;
                        return {
                            date: currentDate,
                            amount: __amount_per_month,
                            interest: __interest,
                            principle: __principle,
                            remaining: Math.max(0, remainingAmount_1),
                            receive: Math.round((totalAmount_1 - remainingAmount_1 + Number.EPSILON) * 100) /
                                100,
                            days: daysPassed,
                        };
                    });
                }
                else {
                    // คำนวณดอกเบี้ยแบบลดต้นลดดอก (Effective Rate)
                    __installment_per_month = (0, payment_1.pillComponent)(__amount, __rate, installment);
                    totalAmount_2 = __amount;
                    nextDate_2 = new Date(created || Date.now());
                    __array = Array.from({ length: Number(installment) }).map(function (_, i) {
                        var currentDate = new Date(start || Date.now());
                        currentDate.setMonth(currentDate.getMonth() + i);
                        var timeDifference = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()) -
                            Date.UTC(nextDate_2.getUTCFullYear(), nextDate_2.getUTCMonth(), nextDate_2.getUTCDate());
                        nextDate_2 = currentDate;
                        var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        var year = currentDate.getFullYear();
                        var daysInYear = getDaysInYears(year);
                        var __dailyInterestRate = Number(rate) / 100 / daysInYear;
                        var __interest = Math.round((totalAmount_2 * __dailyInterestRate * daysPassed + Number.EPSILON) *
                            100) / 100;
                        var __principle, __amount_per_month;
                        if (i === Number(installment) - 1) {
                            __principle = Math.round((totalAmount_2 + Number.EPSILON) * 100) / 100;
                            __amount_per_month =
                                Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
                        }
                        else {
                            __principle =
                                Math.round((__installment_per_month - __interest + Number.EPSILON) * 100) / 100;
                            __amount_per_month = __installment_per_month;
                        }
                        if (__principle > totalAmount_2)
                            __principle = totalAmount_2;
                        totalAmount_2 =
                            Math.round((totalAmount_2 - __principle + Number.EPSILON) * 100) / 100;
                        var __receive = Math.round((__amount - totalAmount_2 + Number.EPSILON) * 100) / 100;
                        return {
                            date: currentDate,
                            amount: __amount_per_month,
                            interest: __interest,
                            principle: __principle,
                            remaining: Math.max(0, totalAmount_2),
                            receive: __receive,
                            days: daysPassed,
                        };
                    });
                }
                if (t && !isNaN(t))
                    __array = __array.splice(t);
                interestRemaining = __array.reduce(function (a, b) { return a + b.interest; }, 0);
                principalRemaining = __array.reduce(function (a, b) { return a + b.principle; }, 0);
                __totalInstallment = Math.round((principalRemaining + interestRemaining + Number.EPSILON) * 100) / 100;
                return [2 /*return*/, res.success("คำนวณสำเร็จ", {
                        amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
                        interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
                        total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
                        pay_per_month: __installment_per_month,
                        total_receive: __totalInstallment,
                        total_interest: Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
                        installment: __array,
                        interest_type: type_interest || "effectiverate",
                    })];
        }
    });
}); };
exports.calcurator = calcurator;
var remainingCalcurate = function (_a) {
    var amount = _a.amount, rate = _a.rate, installment = _a.installment, start = _a.start, created = _a.created, given_at = _a.given_at, _b = _a.type_interest, type_interest = _b === void 0 ? "effectiverate" : _b;
    var __rate = Number(rate) / 100 / 12;
    var __amount = Number(amount);
    var __installment_per_month;
    var __array;
    if (type_interest === "flatrate") {
        // คำนวณดอกเบี้ยแบบคงที่ (Flat Rate)
        var totalInterest_2 = __amount * (Number(rate) / 100) * (installment / 12);
        var totalAmount_3 = __amount + totalInterest_2;
        __installment_per_month =
            Math.round((totalAmount_3 / installment + Number.EPSILON) * 100) / 100;
        var remainingAmount_2 = totalAmount_3;
        __array = Array.from({ length: Number(installment) }).map(function (_, i) {
            var currentDate = new Date(start || Date.now());
            currentDate.setMonth(currentDate.getMonth() + i);
            var __principle, __interest, __amount_per_month;
            if (i === Number(installment) - 1) {
                // งวดสุดท้าย
                __amount_per_month =
                    Math.round((remainingAmount_2 + Number.EPSILON) * 100) / 100;
                __interest =
                    Math.round((totalInterest_2 / installment + Number.EPSILON) * 100) /
                        100;
                __principle =
                    Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
                        100;
            }
            else {
                __amount_per_month = __installment_per_month;
                __interest =
                    Math.round((totalInterest_2 / installment + Number.EPSILON) * 100) /
                        100;
                __principle =
                    Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
                        100;
            }
            remainingAmount_2 =
                Math.round((remainingAmount_2 - __amount_per_month + Number.EPSILON) * 100) / 100;
            return {
                date: currentDate,
                amount: __amount_per_month,
                interest: __interest,
                principle: __principle,
                remaining: Math.max(0, remainingAmount_2),
                receive: Math.round((totalAmount_3 - remainingAmount_2 + Number.EPSILON) * 100) /
                    100,
                days: 30,
            };
        });
    }
    else {
        // คำนวณดอกเบี้ยแบบลดต้นลดดอก (Effective Rate)
        var __diff = __amount * __rate;
        var __pill = Math.pow(1 + __rate, installment);
        var __diff2 = __diff * __pill;
        var __pill2 = __pill - 1;
        __installment_per_month =
            Math.round((__diff2 / __pill2 + Number.EPSILON) * 100) / 100;
        var totalAmount_4 = __amount;
        var nextDate_3 = new Date(created || Date.now());
        __array = Array.from({ length: Number(installment) }).map(function (_, i) {
            var currentDate = new Date(start || Date.now());
            currentDate.setMonth(currentDate.getMonth() + i);
            var timeDifference = Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate()) -
                Date.UTC(nextDate_3.getUTCFullYear(), nextDate_3.getUTCMonth(), nextDate_3.getUTCDate());
            nextDate_3 = currentDate;
            var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            var year = currentDate.getFullYear();
            var daysInYear = getDaysInYears(year);
            var __dailyInterestRate = Number(rate) / 100 / daysInYear;
            var __interest = Math.round((totalAmount_4 * __dailyInterestRate * daysPassed + Number.EPSILON) *
                100) / 100;
            var __principle, __amount_per_month;
            if (i === Number(installment) - 1) {
                __principle = Math.round((totalAmount_4 + Number.EPSILON) * 100) / 100;
                __amount_per_month =
                    Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
            }
            else {
                __principle =
                    Math.round((__installment_per_month - __interest + Number.EPSILON) * 100) / 100;
                __amount_per_month = __installment_per_month;
            }
            if (__principle > totalAmount_4)
                __principle = totalAmount_4;
            totalAmount_4 =
                Math.round((totalAmount_4 - __principle + Number.EPSILON) * 100) / 100;
            var __receive = Math.round((__amount - totalAmount_4 + Number.EPSILON) * 100) / 100;
            return {
                date: currentDate,
                amount: __amount_per_month,
                interest: __interest,
                principle: __principle,
                remaining: Math.max(0, totalAmount_4),
                receive: __receive,
                days: daysPassed,
            };
        });
    }
    if (given_at && !isNaN(given_at))
        __array = __array.splice(given_at);
    var interestRemaining = __array.reduce(function (a, b) { return a + b.interest; }, 0);
    var principalRemaining = __array.reduce(function (a, b) { return a + b.principle; }, 0);
    var __totalInstallment = Math.round((principalRemaining + interestRemaining + Number.EPSILON) * 100) / 100;
    return {
        amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
        interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
        total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
        pay_per_month: __installment_per_month,
        total_receive: __totalInstallment,
        total_interest: Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
        installment: __array,
    };
};
exports.remainingCalcurate = remainingCalcurate;
var installmentRemaining = function (_a) {
    var _b = _a.loan_id, loan_id = _b === void 0 ? -1 : _b, amount = _a.amount, rate = _a.rate, installment = _a.installment, start = _a.start, created = _a.created, given_at = _a.given_at, _c = _a.lastPaid, lastPaid = _c === void 0 ? 0 : _c, _d = _a.paidDate, paidDate = _d === void 0 ? null : _d, _e = _a.type_interest, type_interest = _e === void 0 ? "effectiverate" : _e;
    return __awaiter(void 0, void 0, void 0, function () {
        var __rate, __amount, _installment, __installment_per_month, __array, totalInterest_3, totalAmount_5, remainingAmount_3, nextDate_4, totalAmount_6, nextDate_5, interestRemaining, __totalInstallment;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    __rate = Number(rate) / 100 / 12;
                    __amount = Number(amount);
                    return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                            where: { isPaid: true, loan_id: loan_id },
                            order: { created_at: "ASC" },
                        })];
                case 1:
                    _installment = _f.sent();
                    if (type_interest == "flatrate") {
                        totalInterest_3 = __amount * (Number(rate) / 100) * (installment / 12);
                        totalAmount_5 = __amount + totalInterest_3;
                        __installment_per_month =
                            Math.round((totalAmount_5 / installment + Number.EPSILON) * 100) / 100;
                        remainingAmount_3 = totalAmount_5;
                        nextDate_4 = new Date(new Date(created).toISOString().split("T")[0] ||
                            new Date().toISOString().split("T")[0]);
                        __array = Array.from({ length: Number(installment) }).map(function (_, i) {
                            var currentDate = new Date(start.split("T")[0] || new Date().toISOString().split("T")[0]);
                            currentDate.setMonth(currentDate.getMonth() + i);
                            var timeDifference = currentDate.getTime() - nextDate_4.getTime();
                            var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                            var __principle, __interest, __amount_per_month;
                            __interest =
                                Math.round((totalInterest_3 / installment + Number.EPSILON) * 100) / 100;
                            var pay = __installment_per_month;
                            if (i == given_at - 1 && lastPaid > 0) {
                                if (lastPaid > 0)
                                    pay = Number(lastPaid);
                            }
                            else if (_installment[i]) {
                                pay = Number(_installment[i].paid);
                            }
                            // งวดสุดท้าย
                            if (i === Number(installment) - 1) {
                                __amount_per_month =
                                    Math.round((remainingAmount_3 + Number.EPSILON) * 100) /
                                        100;
                            }
                            else if (pay > remainingAmount_3) {
                                __amount_per_month =
                                    Math.round((remainingAmount_3 + Number.EPSILON) * 100) /
                                        100;
                                // __interest = __interest + (__interest*(installment-given_at-1))
                            }
                            else
                                __amount_per_month = pay;
                            __principle =
                                Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
                                    100;
                            if (__principle < 0) {
                                __principle = 0;
                                __interest = 0;
                            }
                            remainingAmount_3 =
                                Math.round((remainingAmount_3 - __amount_per_month + Number.EPSILON) * 100) /
                                    100;
                            return {
                                date: currentDate,
                                amount: __amount_per_month,
                                interest: __interest,
                                principle: __principle,
                                remaining: Math.max(0, remainingAmount_3),
                                receive: Math.round((totalAmount_5 - remainingAmount_3 + Number.EPSILON) * 100) /
                                    100,
                                days: daysPassed,
                            };
                        });
                    }
                    else {
                        __installment_per_month = (0, payment_1.pillComponent)(__amount, __rate, installment);
                        totalAmount_6 = __amount;
                        nextDate_5 = new Date(new Date(created).toISOString().split("T")[0] ||
                            new Date().toISOString().split("T")[0]);
                        __array = Array.from({ length: Number(installment) }).map(function (_, i) {
                            var pay = __installment_per_month;
                            var currentDate = new Date(start.split("T")[0] || new Date().toISOString().split("T")[0]);
                            currentDate.setMonth(currentDate.getMonth() + i);
                            var timeDifference = currentDate.getTime() - nextDate_5.getTime();
                            if (i == given_at - 1 && lastPaid > 0) {
                                if (lastPaid > 0)
                                    pay = Number(lastPaid);
                                if (paidDate) {
                                    var pd = new Date(paidDate.split("T")[0]).getTime();
                                    timeDifference = pd - nextDate_5.getTime();
                                }
                            }
                            else if (_installment[i]) {
                                pay = Number(_installment[i].paid);
                                var pd = new Date(new Date(_installment[i].given_at).toISOString().split("T")[0]).getTime();
                                timeDifference = pd - nextDate_5.getTime();
                            }
                            nextDate_5 = currentDate;
                            var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                            var year = currentDate.getFullYear();
                            var daysInYear = getDaysInYear(year);
                            var __dailyInterestRate = Number(rate) / 100 / daysInYear;
                            var __interest = Math.round((totalAmount_6 * __dailyInterestRate * daysPassed + Number.EPSILON) *
                                100) / 100;
                            var __principle, __amount_per_month;
                            if (i === Number(installment) - 1) {
                                __principle = Math.round((totalAmount_6 + Number.EPSILON) * 100) / 100;
                                if (__principle <= 0)
                                    __principle = 0;
                                __amount_per_month =
                                    Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
                            }
                            else {
                                __principle =
                                    Math.round((pay - __interest + Number.EPSILON) * 100) / 100;
                                if (__principle <= 0)
                                    __principle = 0;
                                __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
                            }
                            if (__principle > totalAmount_6) {
                                __principle = totalAmount_6;
                                __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
                                // if (__amount_per_month <= 0) __amount_per_month = 0;
                            }
                            totalAmount_6 =
                                Math.round((totalAmount_6 - __principle + Number.EPSILON) * 100) / 100;
                            var __receive = Math.round((__amount - totalAmount_6 + Number.EPSILON) * 100) / 100;
                            console.log(currentDate, __amount_per_month, totalAmount_6, __receive, daysPassed, Number(rate) / 100, daysInYear, __interest);
                            return {
                                date: currentDate,
                                amount: __amount_per_month,
                                interest: __interest,
                                principle: __principle,
                                remaining: Math.max(0, totalAmount_6),
                                receive: __receive,
                                days: daysPassed,
                            };
                        });
                    }
                    if (given_at && !isNaN(given_at))
                        __array = __array.splice(given_at);
                    interestRemaining = __array.reduce(function (a, b) { return a + b.interest; }, 0);
                    __totalInstallment = __array.reduce(function (a, b) { return a + b.principle + b.interest; }, 0);
                    return [2 /*return*/, {
                            amount: Math.round((amount + Number.EPSILON) * 100) / 100,
                            interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
                            total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
                            pay_per_month: Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
                            total_receive: Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
                            total_interest: Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
                            installment: __array,
                        }];
            }
        });
    });
};
exports.installmentRemaining = installmentRemaining;
var effevtiverateInstallment = function (_a) {
    var _b = _a.loan_id, loan_id = _b === void 0 ? -1 : _b, amount = _a.amount, rate = _a.rate, installment = _a.installment, start = _a.start, created = _a.created, given_at = _a.given_at, _c = _a.lastPaid, lastPaid = _c === void 0 ? 0 : _c, _d = _a.delay_charge, delay_charge = _d === void 0 ? 0 : _d, _e = _a.paidDate, paidDate = _e === void 0 ? null : _e;
    return __awaiter(void 0, void 0, void 0, function () {
        var __rate, __amount, _installment, __installment_per_month, __array, totalAmount, nextDate, interestRemaining, __totalInstallment;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    __rate = Number(rate) / 100 / 12;
                    __amount = Number(amount);
                    return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                            where: { isPaid: true, loan_id: loan_id },
                            order: { created_at: "ASC" },
                        })];
                case 1:
                    _installment = _f.sent();
                    __installment_per_month = (0, payment_1.pillComponent)(__amount, __rate, installment);
                    totalAmount = __amount - delay_charge;
                    nextDate = new Date(new Date(created).toISOString().split("T")[0] ||
                        new Date().toISOString().split("T")[0]);
                    __array = Array.from({ length: Number(installment) }).map(function (_, i) {
                        var pay = __installment_per_month;
                        var currentDate = new Date(start.split("T")[0] || new Date().toISOString().split("T")[0]);
                        currentDate.setMonth(currentDate.getMonth() + i);
                        var timeDifference = currentDate.getTime() - nextDate.getTime();
                        if (i == given_at - 1 && lastPaid > 0) {
                            if (lastPaid > 0)
                                pay = Number(lastPaid) - Number(_installment[i].delay_charge_paid);
                            if (paidDate) {
                                var pd = new Date(paidDate.split("T")[0]).getTime();
                                timeDifference = pd - nextDate.getTime();
                            }
                        }
                        else if (_installment[i]) {
                            pay = Number(_installment[i].paid) - Number(_installment[i].delay_charge_paid);
                            var pd = new Date(new Date(_installment[i].given_at).toISOString().split("T")[0]).getTime();
                            timeDifference = pd - nextDate.getTime();
                        }
                        nextDate = currentDate;
                        var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        var year = currentDate.getFullYear();
                        var daysInYear = getDaysInYear(year);
                        var __dailyInterestRate = Number(rate) / 100 / daysInYear;
                        var __interest = Math.round((totalAmount * __dailyInterestRate * daysPassed + Number.EPSILON) *
                            100) / 100;
                        var __principle, __amount_per_month;
                        if (i === Number(installment) - 1) {
                            __principle = Math.round((totalAmount + Number.EPSILON) * 100) / 100;
                            if (__principle <= 0)
                                __principle = 0;
                            __amount_per_month =
                                Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
                        }
                        else {
                            __principle =
                                Math.round((pay - __interest + Number.EPSILON) * 100) / 100;
                            if (__principle <= 0)
                                __principle = 0;
                            __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
                        }
                        if (__principle > totalAmount) {
                            __principle = totalAmount;
                            __amount_per_month = Math.round((__principle + __interest + Number.EPSILON) * 100) / 100;
                            // if (__amount_per_month <= 0) __amount_per_month = 0;
                        }
                        totalAmount =
                            Math.round((totalAmount - __principle + Number.EPSILON) * 100) / 100;
                        var __receive = Math.round((__amount - totalAmount + Number.EPSILON) * 100) / 100;
                        console.log(currentDate, __amount_per_month, totalAmount, __receive, daysPassed, Number(rate) / 100, daysInYear, __interest);
                        return {
                            date: currentDate,
                            amount: __amount_per_month,
                            interest: __interest,
                            principle: __principle,
                            remaining: Math.max(0, totalAmount),
                            receive: __receive,
                            days: daysPassed,
                        };
                    });
                    if (given_at && !isNaN(given_at))
                        __array = __array.splice(given_at);
                    interestRemaining = __array.reduce(function (a, b) { return a + b.interest; }, 0);
                    __totalInstallment = __array.reduce(function (a, b) { return a + b.principle + b.interest; }, 0);
                    return [2 /*return*/, {
                            amount: Math.round((amount + Number.EPSILON) * 100) / 100,
                            interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
                            total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
                            pay_per_month: Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
                            total_receive: Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
                            total_interest: Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
                            installment: __array,
                        }];
            }
        });
    });
};
exports.effevtiverateInstallment = effevtiverateInstallment;
var flatrateCalculator = function (_a) {
    var amount = _a.amount, remaining = _a.remaining, interest_rate = _a.interest_rate, total_installment = _a.total_installment, installment_start = _a.installment_start, _b = _a.installment_due, installment_due = _b === void 0 ? null : _b, payment_date = _a.payment_date, _c = _a.pay, pay = _c === void 0 ? 0 : _c, _d = _a.interest_stack, interest_stack = _d === void 0 ? 0 : _d, _e = _a.installment, installment = _e === void 0 ? 1 : _e, _f = _a.pay_days, pay_days = _f === void 0 ? 30 : _f, _g = _a.delay_days, delay_days = _g === void 0 ? 15 : _g, _h = _a.delay_charge, delay_charge = _h === void 0 ? 50 : _h;
    var __amount = Number(amount);
    var _remaining = Number(remaining);
    var __rate = Number(interest_rate) / 100 / 12;
    var __installment_per_month = 0;
    var __interest = 0;
    var __principle = 0;
    var __interest_due = 0;
    var total_principle = 0;
    var __paid = 0;
    var __interest_stack = Number(interest_stack);
    var __paid_interest = 0;
    // คำนวณดอกเบี้ยคงที่ (Flat Rate)
    var totalInterest = __amount * (Number(interest_rate) / 100) * (total_installment / 12);
    var totalAmount = __amount;
    // __interest = totalInterest / total_installment;
    if (installment >= total_installment) {
        // คำนวณดอกเบี้ยที่ชำระไปแล้ว
        var paidInterest = (totalInterest / total_installment) * (installment - 1);
        if (paidInterest >= totalInterest) {
            // ถ้าดอกเบี้ยชำระครบแล้ว
            __paid_interest = 0;
            __interest = 0;
        }
        else {
            __interest = totalInterest - paidInterest;
        }
    }
    else {
        __interest = totalInterest / total_installment;
    }
    if (Number(installment) < Number(total_installment)) {
        __principle = totalAmount / total_installment;
    }
    __installment_per_month = Math.round((((totalAmount + totalInterest) / total_installment) + Number.EPSILON) * 100) /
        100;
    // คำนวณเงินต้นคงเหลือ
    var monthlyPrinciple = Math.round(((totalAmount / total_installment) + Number.EPSILON) * 100) / 100;
    var installmentPaid = installment - 1;
    var totalPrinciplePaid = installmentPaid * monthlyPrinciple;
    total_principle = Math.round(((totalAmount - totalPrinciplePaid) + Number.EPSILON) * 100) / 100;
    // งวดสุดท้าย
    if (installment === total_installment ||
        __installment_per_month > _remaining)
        __installment_per_month =
            Math.round((_remaining + Number.EPSILON) * 100) /
                100;
    __principle = __installment_per_month - __interest;
    var startDate = new Date(installment_start || new Date().toISOString().split("T")[0]);
    var currentDate = new Date(new Date(payment_date).toISOString().split("T")[0] || new Date().toISOString().split("T")[0]);
    var dueDate = installment_due ? new Date(installment_due) : currentDate;
    var timeDifference = currentDate.getTime() - startDate.getTime();
    var dueDifference = dueDate.getTime() - startDate.getTime();
    var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    var daysDue = Math.floor(dueDifference / (1000 * 60 * 60 * 24));
    var year = currentDate.getFullYear();
    var daysInYear = getDaysInYear(year);
    // คำนวณค่าปรับล่าช้า
    var __delay_times = Math.floor((daysPassed - Number(pay_days)) / Number(delay_days));
    __delay_times = __delay_times < 0 ? 0 : __delay_times;
    var __delay_charge = __delay_times * Number(delay_charge);
    var __delay_days = daysPassed - Number(pay_days);
    var __max = __principle + __interest + Number(interest_stack) + __delay_charge;
    var __min = __interest;
    var __nor = Math.min(__max, __installment_per_month);
    var __close = _remaining + __interest + Number(interest_stack) + __delay_charge;
    if (_remaining <= __installment_per_month) {
        __close = _remaining + Number(interest_stack) + __delay_charge;
    }
    if (Number(total_installment) <= Number(installment) ||
        __principle > Number(remaining)) {
        __nor = __close;
    }
    if (Number(pay) > 0 && Number(pay) < __min) {
        __interest = Number(pay); // หักดอกเบี้ยเท่าที่จ่ายจริง
    }
    var _r = Math.max(0, __max - Number(pay));
    if (_r === 0) {
        __paid = Number(pay) - (__interest + Number(interest_stack)) - __delay_charge;
        // __paid_interest = __interest + Number(interest_stack) - __delay_charge;
        __paid_interest = __interest + Number(interest_stack);
        __interest_stack = 0;
    }
    else if (_r > 0) {
        if (_r > __principle) {
            __interest_stack = _r - __principle;
            __paid_interest = Number(pay);
        }
        else {
            __paid = __principle - _r;
            __paid_interest = __interest + Number(interest_stack);
            __interest_stack = 0;
        }
    }
    var __remaining = _remaining - __paid;
    if (Number(pay) > 0) {
        __remaining = _remaining - (__paid + __interest);
        total_principle = total_principle - __paid;
    }
    // ปัดเศษผลลัพธ์สุดท้ายก่อนส่งคืน
    return {
        days: daysPassed,
        daysInYear: daysInYear,
        principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
        interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
        interest_due: Math.round((__interest_due + Number.EPSILON) * 100) / 100,
        max_pay: Math.round((__max + Number.EPSILON) * 100) / 100,
        mini_pay: Math.round((__min + Number.EPSILON) * 100) / 100,
        nor_pay: Math.round((__nor + Number.EPSILON) * 100) / 100,
        close_pay: Math.round((__close + Number.EPSILON) * 100) / 100,
        installment: installment,
        total_installment: total_installment,
        paid_interest: Math.round((__paid_interest + Number.EPSILON) * 100) / 100,
        paid_principle: Math.round((__paid + Number.EPSILON) * 100) / 100,
        total_principle: Math.round((total_principle + Number.EPSILON) * 100) / 100,
        principle_remaining: Math.round((__remaining + Number.EPSILON) * 100) / 100,
        interest_remaining: Math.round((__interest_stack + Number.EPSILON) * 100) / 100,
        delay_charge: Math.round((__delay_charge + Number.EPSILON) * 100) / 100,
        delay_times: __delay_times,
        delay_days: __delay_days,
    };
};
exports.flatrateCalculator = flatrateCalculator;
var flatrateInstallment = function (_a) {
    var _b = _a.loan_id, loan_id = _b === void 0 ? -1 : _b, amount = _a.amount, rate = _a.rate, installment = _a.installment, start = _a.start, created = _a.created, given_at = _a.given_at, _c = _a.lastPaid, lastPaid = _c === void 0 ? 0 : _c, _d = _a.delay_charge, delay_charge = _d === void 0 ? 0 : _d, _e = _a.paidDate, paidDate = _e === void 0 ? null : _e;
    return __awaiter(void 0, void 0, void 0, function () {
        var __rate, __amount, _installment, __installment_per_month, __array, totalInterest, totalAmount, remainingAmount, nextDate, interestRemaining, __totalInstallment;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    __rate = Number(rate) / 100 / 12;
                    __amount = Number(amount);
                    return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                            where: { isPaid: true, loan_id: loan_id },
                            order: { created_at: "ASC" },
                        })];
                case 1:
                    _installment = _f.sent();
                    totalInterest = __amount * (Number(rate) / 100) * (installment / 12);
                    totalAmount = __amount + totalInterest;
                    __installment_per_month =
                        Math.round((totalAmount / installment + Number.EPSILON) * 100) / 100;
                    remainingAmount = totalAmount - delay_charge;
                    nextDate = new Date(new Date(created).toISOString().split("T")[0] ||
                        new Date().toISOString().split("T")[0]);
                    __array = Array.from({ length: Number(installment) }).map(function (_, i) {
                        var currentDate = new Date(start.split("T")[0] || new Date().toISOString().split("T")[0]);
                        currentDate.setMonth(currentDate.getMonth() + i);
                        var timeDifference = currentDate.getTime() - nextDate.getTime();
                        var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        var __principle, __interest, __amount_per_month;
                        __interest =
                            Math.round((totalInterest / installment + Number.EPSILON) * 100) / 100;
                        var pay = __installment_per_month;
                        if (i == given_at - 1 && lastPaid > 0) {
                            if (lastPaid > 0)
                                pay = Number(lastPaid) - Number(_installment[i].delay_charge_paid);
                        }
                        else if (_installment[i]) {
                            pay = Number(_installment[i].paid) - Number(_installment[i].delay_charge_paid);
                        }
                        // งวดสุดท้าย
                        if (i === Number(installment) - 1) {
                            __amount_per_month =
                                Math.round((remainingAmount + Number.EPSILON) * 100) /
                                    100;
                        }
                        else if (pay > remainingAmount) {
                            __amount_per_month =
                                Math.round((remainingAmount + Number.EPSILON) * 100) /
                                    100;
                            // __interest = __interest + (__interest*(installment-given_at-1))
                        }
                        else
                            __amount_per_month = pay;
                        __principle =
                            Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) /
                                100;
                        if (__principle < 0) {
                            __principle = 0;
                            __interest = 0;
                        }
                        remainingAmount =
                            Math.round((remainingAmount - __amount_per_month + Number.EPSILON) * 100) /
                                100;
                        return {
                            date: currentDate,
                            amount: __amount_per_month,
                            interest: __interest,
                            principle: __principle,
                            remaining: Math.max(0, remainingAmount),
                            receive: Math.round((totalAmount - remainingAmount + Number.EPSILON) * 100) /
                                100,
                            days: daysPassed,
                        };
                    });
                    if (given_at && !isNaN(given_at))
                        __array = __array.splice(given_at);
                    interestRemaining = __array.reduce(function (a, b) { return a + b.interest; }, 0);
                    __totalInstallment = __array.reduce(function (a, b) { return a + b.principle + b.interest; }, 0);
                    return [2 /*return*/, {
                            amount: Math.round((amount + Number.EPSILON) * 100) / 100,
                            interest_rate: Math.round((rate + Number.EPSILON) * 100) / 100,
                            total_installment: Math.round((installment + Number.EPSILON) * 100) / 100,
                            pay_per_month: Math.round((__installment_per_month + Number.EPSILON) * 100) / 100,
                            total_receive: Math.round((__totalInstallment + Number.EPSILON) * 100) / 100,
                            total_interest: Math.round((interestRemaining + Number.EPSILON) * 100) / 100,
                            installment: __array,
                        }];
            }
        });
    });
};
exports.flatrateInstallment = flatrateInstallment;
