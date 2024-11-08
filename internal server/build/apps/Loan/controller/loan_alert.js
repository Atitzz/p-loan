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
exports.notificate_Due = exports.get_overDue = exports.get_beforeDue = void 0;
var typeorm_1 = require("typeorm");
var loan_plan_1 = require("../entities/loan_plan");
var data_source_1 = require("../../../data-source");
var loan_1 = require("../entities/loan");
var entities_1 = require("../../Users/entities");
var module_1 = require("../../Line_Message/module");
// ก่อนถึงกำหนดชำระ
var get_beforeDue = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, searchDay, page, limit, perPage, offset, today, whereClause, targetDate, endOfTargetDate, _total, loansDue, loans, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, searchDay = _a.searchDay, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                today = new Date();
                today.setHours(23, 59, 59, 999);
                whereClause = {
                    status: 'Running',
                    installment_due: (0, typeorm_1.MoreThanOrEqual)(today)
                };
                if (searchDay) {
                    targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() + parseInt(searchDay));
                    targetDate.setHours(0, 0, 0, 0);
                    endOfTargetDate = new Date(targetDate);
                    endOfTargetDate.setHours(23, 59, 59, 999);
                    whereClause = __assign(__assign({}, whereClause), { installment_due: (0, typeorm_1.Between)(targetDate, endOfTargetDate) });
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({ where: whereClause })];
            case 2:
                _total = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).find({
                        where: whereClause,
                        take: perPage,
                        skip: offset
                    })];
            case 3:
                loansDue = _b.sent();
                return [4 /*yield*/, Promise.all(loansDue.map(function (loan) { return __awaiter(void 0, void 0, void 0, function () {
                        var application_form, other, user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    application_form = loan.application_form, other = __rest(loan, ["application_form"]);
                                    return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan.user_id } })];
                                case 1:
                                    user = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, other), { user_name: "".concat(user.firstname, " ").concat(user.lastname) })];
                            }
                        });
                    }); }))];
            case 4:
                loans = _b.sent();
                return [2 /*return*/, res.success('รายการที่พบ', loans, _total)];
            case 5:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.get_beforeDue = get_beforeDue;
// เกินกำหนดชำระ
var get_overDue = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, searchMonth, page, limit, perPage, offset, today, whereClause, _total, loansDue, loans, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, searchMonth = _a.searchMonth, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                today = new Date();
                today.setHours(0, 0, 0, 0);
                whereClause = {
                    status: 'Running',
                    installment_due: (0, typeorm_1.LessThan)(today)
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({ where: whereClause })];
            case 2:
                _total = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).find({
                        where: whereClause,
                        take: perPage,
                        skip: offset
                    })];
            case 3:
                loansDue = _b.sent();
                return [4 /*yield*/, Promise.all(loansDue.map(function (loan) { return __awaiter(void 0, void 0, void 0, function () {
                        var application_form, other, installmentDue, today, overdueMonths, overdueDuration, user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    application_form = loan.application_form, other = __rest(loan, ["application_form"]);
                                    installmentDue = new Date(loan.installment_due);
                                    today = new Date();
                                    overdueMonths = (today.getFullYear() - installmentDue.getFullYear()) * 12 + (today.getMonth() - installmentDue.getMonth());
                                    overdueDuration = overdueMonths > 0 ? overdueMonths : 0;
                                    if (searchMonth && overdueDuration < Number(searchMonth)) {
                                        return [2 /*return*/, null];
                                    }
                                    return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan.user_id } })];
                                case 1:
                                    user = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, other), { user_name: "".concat(user.firstname, " ").concat(user.lastname), overdue_months: overdueDuration })];
                            }
                        });
                    }); }))];
            case 4:
                loans = _b.sent();
                loans = loans.filter(function (loan) { return loan !== null; });
                return [2 /*return*/, res.success('รายการที่พบ', loans, _total)];
            case 5:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.get_overDue = get_overDue;
var notificate_Due = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loanIds, today, loansDue, filteredLoans, userIds, planIds, users_1, plans_1, notificationResults, validResults, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loanIds = req.body.loanIds;
                if (!loanIds || !Array.isArray(loanIds) || loanIds.length === 0) {
                    return [2 /*return*/, res.error("กรุณาเลือกเงินกู้ที่ต้องการส่งแจ้งเตือน")];
                }
                today = new Date();
                today.setHours(0, 0, 0, 0);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).find({
                        where: {
                            id: (0, typeorm_1.In)(loanIds),
                            status: 'Running',
                        }
                    })];
            case 2:
                loansDue = _a.sent();
                if (loansDue.length === 0) {
                    return [2 /*return*/, res.error('ไม่พบรายการที่ต้องแจ้งเตือน')];
                }
                filteredLoans = loansDue.filter(function (loan) {
                    if (loan.last_alert_date) {
                        var lastNotified = new Date(loan.last_alert_date);
                        lastNotified.setHours(0, 0, 0, 0);
                        return lastNotified.getTime() !== today.getTime();
                    }
                    return true;
                });
                if (filteredLoans.length === 0) {
                    return [2 /*return*/, res.error('ได้ทำการแจ้งเตือนแล้วในวันนี้')];
                }
                userIds = loansDue.map(function (loan) { return loan.user_id; });
                planIds = loansDue.map(function (loan) { return loan.plan_id; });
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).find({
                        where: { id: (0, typeorm_1.In)(userIds) }
                    })];
            case 3:
                users_1 = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).find({ where: { id: (0, typeorm_1.In)(planIds) } })];
            case 4:
                plans_1 = _a.sent();
                return [4 /*yield*/, Promise.all(loansDue.map(function (loan) { return __awaiter(void 0, void 0, void 0, function () {
                        var user, plan, formattedPerInstallment, formattedInstallmentDate, formattedLoanAmount, formattedLoanRemaining;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    user = users_1.find(function (u) { return u.id === loan.user_id; });
                                    plan = plans_1.find(function (p) { return p.id === loan.plan_id; });
                                    formattedPerInstallment = "".concat(parseFloat(loan.per_installment).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), " \u0E1A\u0E32\u0E17");
                                    formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }).format(new Date(loan.installment_due));
                                    formattedLoanAmount = "".concat(parseFloat(loan.amount).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), " \u0E1A\u0E32\u0E17");
                                    formattedLoanRemaining = "".concat(parseFloat(loan.remaining).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), " \u0E1A\u0E32\u0E17");
                                    if (!user.line_id) {
                                        return [2 /*return*/, null];
                                    }
                                    return [4 /*yield*/, (0, module_1.Line_SendNotificateDue)(user.line_id, plan.name, loan.loan_number, formattedPerInstallment, formattedInstallmentDate, loan.given_installment + 1, loan.total_installment, formattedLoanAmount, formattedLoanRemaining)];
                                case 1:
                                    _a.sent();
                                    loan.last_alert_date = new Date();
                                    return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/, {
                                            loan_id: loan.id,
                                            line_id: user.line_id,
                                            plan_name: plan.name,
                                            loan_number: loan.loan_number,
                                            per_installment: formattedPerInstallment,
                                            installment_date: formattedInstallmentDate,
                                            given_installment: loan.given_installment + 1,
                                            total_installment: loan.total_installment,
                                            loan_amount: formattedLoanAmount,
                                            loan_remaining: formattedLoanRemaining
                                        }];
                            }
                        });
                    }); }))];
            case 5:
                notificationResults = _a.sent();
                validResults = notificationResults.filter(function (result) { return result !== null; });
                return [2 /*return*/, res.success('ส่งแจ้งเตือนสำเร็จ', validResults)];
            case 6:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.notificate_Due = notificate_Due;
// export const notificate_afterDue = async (req, res) => {
//     const { loanIds } = req.body;
//     if (!loanIds || !Array.isArray(loanIds) || loanIds.length === 0) {
//         return res.error("กรุณาเลือกเงินกู้ที่ต้องการส่งแจ้งเตือน");
//     }
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     try {
//         const loansDue = await orm(Loan).find({
//             where: {
//                 id: In(loanIds),
//                 status: 'Running',
//             }
//         });
//         if (loansDue.length === 0) {
//             return res.error('ไม่พบรายการที่ต้องแจ้งเตือน');
//         }
//         const filteredLoans = loansDue.filter(loan => {
//             if (loan.last_alert_date) {
//                 const lastNotified = new Date(loan.last_alert_date);
//                 lastNotified.setHours(0, 0, 0, 0);
//                 return lastNotified.getTime() !== today.getTime();
//             }
//             return true;
//         });
//         if (filteredLoans.length === 0) {
//             return res.error('ได้ทำการแจ้งเตือนแล้วในวันนี้');
//         }
//         const userIds = loansDue.map(loan => loan.user_id);
//         const planIds = loansDue.map(loan => loan.plan_id);
//         const users = await orm(Users).find({
//             where: { id: In(userIds) }
//         });
//         const plans = await orm(LoanPlan).find({ where: { id: In(planIds) } });
//         const notificationResults = await Promise.all(loansDue.map(async (loan) => {
//             const user = users.find(u => u.id === loan.user_id);
//             const plan = plans.find(p => p.id === loan.plan_id);
//             const formattedPerInstallment = `${parseFloat(loan.per_installment).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;
//             const formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric'
//             }).format(new Date(loan.installment_due));
//             if (!user.line_id) {
//                 return null;
//             }
//             await Line_SendNotificate(
//                 user.line_id,
//                 plan.name,
//                 loan.loan_number,
//                 formattedPerInstallment,
//                 formattedInstallmentDate,
//                 loan.given_installment + 1,
//                 loan.total_installment,
//             );
//             loan.last_alert_date = new Date();
//             await orm(Loan).save(loan);
//             return {
//                 loan_id: loan.id,
//                 line_id: user.line_id,
//                 plan_name: plan.name,
//                 loan_number: loan.loan_number,
//                 per_installment: formattedPerInstallment,
//                 installment_date: formattedInstallmentDate,
//                 given_installment: loan.given_installment + 1,
//                 total_installment: loan.total_installment
//             };
//         }));
//         const validResults = notificationResults.filter(result => result !== null);
//         return res.success('ส่งแจ้งเตือนสำเร็จ', validResults);
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// };
