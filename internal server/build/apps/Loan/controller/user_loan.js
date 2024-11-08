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
exports.removeUser = exports.payment = exports.getPaymentDetails = exports.installmentAll = exports.installments = exports.due_installment = exports.myloanContract = exports.my_loan = exports.get_applicationForm = exports.takeLoan = exports.category_plan = void 0;
var data_source_1 = require("../../../data-source");
var loan_1 = require("../entities/loan");
var loan_plan_1 = require("../entities/loan_plan");
var index_1 = require("../../../Utils/index");
var loan_installment_1 = require("../entities/loan_installment");
var enum_1 = require("../../Utils/enum");
var entities_1 = require("../../Users/entities");
var File_Manager_1 = require("../../FileManager/entities/File_Manager");
var loan_applicationform_1 = require("../entities/loan_applicationform");
var loan_category_1 = require("../entities/loan_category");
var typeorm_1 = require("typeorm");
var dotenv = require("dotenv");
var loan_contract_1 = require("../entities/loan_contract");
var entities_2 = require("../../KYC/entities");
var tax_1 = require("../entities/tax");
var index_2 = require("../../../Utils/index");
var calurate_1 = require("./calurate");
var entities_3 = require("../../Users_AccessToken/entities");
var entities_4 = require("../../UserSMS/entities");
var __1 = require("../../..");
// import { LoanContract } from "../entities/loan_contract";
dotenv.config();
var category_plan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, categoryIds, plans_1, categoryPlans, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_category_1.LoanCategory).find({})];
            case 1:
                categories = _a.sent();
                categoryIds = categories.map(function (category) { return category.id; });
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).find({
                        where: { category_id: (0, typeorm_1.In)(categoryIds) },
                    })];
            case 2:
                plans_1 = _a.sent();
                categoryPlans = categories.map(function (category) {
                    var created_at = category.created_at, updated_at = category.updated_at, deleted_at = category.deleted_at, restCategory = __rest(category, ["created_at", "updated_at", "deleted_at"]);
                    var filteredPlans = plans_1
                        .filter(function (plan) { return plan.category_id === category.id; })
                        .map(function (plan) {
                        var created_at = plan.created_at, updated_at = plan.updated_at, deleted_at = plan.deleted_at, restPlan = __rest(plan, ["created_at", "updated_at", "deleted_at"]);
                        return restPlan;
                    });
                    return __assign(__assign({}, restCategory), { plans: filteredPlans });
                });
                return [2 /*return*/, res.success("Get categories and plans", categoryPlans)];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.category_plan = category_plan;
var takeLoan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, created_at, updated_at, deleted_at, obj, _planId, user, loanPlan_1, selectedInstallment_1, selectedRate_1, interestRate_1, applicationForms_2, _i, applicationForms_1, field, fieldValue, totalAmount, loanParts, createLoan, reference, loan_document_max, i, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at"]);
                _planId = parseInt(obj.plan_id) || -1;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: req.user.id } })];
            case 2:
                user = _b.sent();
                if (user && user.kyc !== "verified")
                    return [2 /*return*/, res.error("กรุณายืนยันตัวตน")];
                if (!user)
                    return [2 /*return*/, res.error("ไม่พบผู้ใช้")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: _planId } })];
            case 3:
                loanPlan_1 = _b.sent();
                if (!loanPlan_1)
                    return [2 /*return*/, res.error("ไม่พบแผนสินเชื่อ")];
                if (Number(obj.amount) < loanPlan_1.minimum_amount ||
                    Number(obj.amount) > loanPlan_1.maximum_amount)
                    return [2 /*return*/, res.error("\u0E22\u0E2D\u0E14\u0E01\u0E39\u0E49\u0E15\u0E49\u0E2D\u0E07\u0E2D\u0E22\u0E39\u0E48\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 ".concat(Number(loanPlan_1.minimum_amount), " - ").concat(Number(loanPlan_1.maximum_amount)))];
                selectedInstallment_1 = parseInt(obj.installment);
                selectedRate_1 = loanPlan_1.rate.find(function (r) { return Number(r.installment) === selectedInstallment_1; });
                if (!selectedRate_1)
                    return [2 /*return*/, res.error("โปรดเลือกจำนวนงวดตามที่กำหนด")];
                interestRate_1 = Number(selectedRate_1.interest_rate) +
                    Number(loanPlan_1.application_percent_charge);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).find({
                        where: { plan_id: _planId },
                        order: { index: "ASC" },
                    })];
            case 4:
                applicationForms_2 = _b.sent();
                for (_i = 0, applicationForms_1 = applicationForms_2; _i < applicationForms_1.length; _i++) {
                    field = applicationForms_1[_i];
                    fieldValue = obj.appForm[field.field_name];
                    if (field.is_required.toLowerCase() === "required" && !fieldValue) {
                        return [2 /*return*/, res.error("\u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E30\u0E1A\u0E38 ".concat(field.label))];
                    }
                }
                totalAmount = Number(obj.amount);
                loanParts = [];
                while (totalAmount > 0) {
                    if (totalAmount > 50000) {
                        loanParts.push(50000);
                        totalAmount -= Number(50000);
                    }
                    else {
                        loanParts.push(totalAmount);
                        totalAmount = 0;
                    }
                }
                createLoan = function (amount, reference, loan_ducument, loan_ducument_max) { return __awaiter(void 0, void 0, void 0, function () {
                    var interestRateToUse, __createDate, __startDate, __endDate, addInterrest, _a, nor_pay, principle_remaining, _b, total_interest, total_receive, valueInstallment, totalAmount, loan, _c, formData, fileUploads, _i, applicationForms_3, field, fieldValue, _d, allowedExtensions, processedImage, fileManager, _e, fileUploads_1, file, data;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                interestRateToUse = interestRate_1;
                                // กำหนดดอกเบี้ย 28% สำหรับสินเชื่อที่ 2
                                if (interestRate_1 > 32) {
                                    // ถ้าเกิน 30% ให้กำหนดอัตราดอกเบี้ยสำหรับสินเชื่อที่ 2 เป็น 28%
                                    if (loan_ducument === 2) {
                                        interestRateToUse = 28;
                                    }
                                }
                                __createDate = new Date();
                                __startDate = new Date(__createDate);
                                __startDate.setDate(5);
                                __startDate.setMonth(__startDate.getMonth() + 1);
                                __endDate = new Date(__startDate);
                                __endDate.setMonth(__endDate.getMonth() + Number(selectedRate_1.installment - 1));
                                addInterrest = 0;
                                if (loanPlan_1.type_interest == "flatrate")
                                    addInterrest =
                                        (Number(amount) * (Number(interestRate_1) / 100) * (selectedInstallment_1 / 12));
                                _a = (0, calurate_1.paymentCalculator)({
                                    type_interest: loanPlan_1.type_interest,
                                    amount: amount,
                                    remaining: Number(amount) + addInterrest,
                                    interest_rate: interestRateToUse,
                                    total_installment: selectedRate_1.installment,
                                    installment_start: __createDate,
                                    payment_date: __startDate.toISOString().split('T')[0],
                                }), nor_pay = _a.nor_pay, principle_remaining = _a.principle_remaining;
                                _b = (0, calurate_1.remainingCalcurate)({
                                    type_interest: loanPlan_1.type_interest,
                                    amount: amount,
                                    rate: interestRateToUse,
                                    installment: selectedRate_1.installment,
                                    start: __startDate,
                                    created: __createDate,
                                    given_at: 0,
                                }), total_interest = _b.total_interest, total_receive = _b.total_receive, valueInstallment = _b.installment;
                                totalAmount = Number(amount);
                                loan = new loan_1.Loan();
                                _c = loan;
                                return [4 /*yield*/, (0, index_2.generateLoanNumber)(_planId)];
                            case 1:
                                _c.loan_number = _f.sent();
                                loan.startDate = __startDate;
                                loan.endDate = __endDate;
                                loan.user_id = req.user.id;
                                loan.plan_id = _planId;
                                loan.amount = totalAmount;
                                loan.per_installment = nor_pay;
                                loan.total_installment = selectedInstallment_1;
                                loan.delay_value = loanPlan_1.delay_value;
                                loan.delay_charge = loanPlan_1.fixed_charge;
                                loan.overdue_balance = 0;
                                loan.receivable =
                                    loanPlan_1.type_interest == "flatrate"
                                        ? Number(amount) *
                                            ((Number(interestRateToUse) / 100 / 12) * selectedRate_1.installment +
                                                1)
                                        : total_receive;
                                loan.remaining = principle_remaining;
                                loan.principle = totalAmount;
                                loan.interest =
                                    loanPlan_1.type_interest == "flatrate"
                                        ? Number(amount) *
                                            ((Number(interestRateToUse) / 100 / 12) * selectedRate_1.installment)
                                        : total_interest;
                                // loan.approved_at = __createDate;
                                // if (Date.now() >= __startDate.getTime()) loan.status = loan_status.Due;
                                // else loan.status = loan_status.Pending;
                                loan.status = enum_1.loan_status.Pending;
                                loan.installment_start = __createDate;
                                loan.installment_due = __startDate;
                                loan.reference = reference;
                                loan.last_alert_date = __startDate;
                                loan.loan_ducument = loan_ducument;
                                loan.loan_ducument_max = loan_ducument_max;
                                loan.guarantee = obj.guarantee;
                                loan.loan_interest = interestRateToUse;
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
                            case 2:
                                _f.sent();
                                formData = {};
                                fileUploads = [];
                                _i = 0, applicationForms_3 = applicationForms_2;
                                _f.label = 3;
                            case 3:
                                if (!(_i < applicationForms_3.length)) return [3 /*break*/, 10];
                                field = applicationForms_3[_i];
                                fieldValue = obj.appForm[field.field_name];
                                _d = field.type.toLowerCase();
                                switch (_d) {
                                    case "file": return [3 /*break*/, 4];
                                    case "select": return [3 /*break*/, 7];
                                }
                                return [3 /*break*/, 8];
                            case 4:
                                if (!fieldValue) return [3 /*break*/, 6];
                                allowedExtensions = field.extensions;
                                if (!(0, index_2.validateMimetype)(fieldValue, allowedExtensions)) {
                                    return [2 /*return*/, res.error("\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A ".concat(field.label, ". \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E44\u0E1F\u0E25\u0E4C\u0E17\u0E35\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15: ").concat(allowedExtensions.join(', ')))];
                                }
                                return [4 /*yield*/, (0, index_1.reSizeBase64)(fieldValue)];
                            case 5:
                                processedImage = _f.sent();
                                fileManager = new File_Manager_1.File_Manager();
                                fileManager.ref_id = loan.id;
                                fileManager.folder_id = "loan_".concat(loan.id);
                                fileManager.name = "".concat(field.field_name);
                                fileManager.base64 = processedImage;
                                fileUploads.push(fileManager);
                                formData[field.field_name] = { ref_id: fileManager.ref_id, name: fileManager.name };
                                _f.label = 6;
                            case 6: return [3 /*break*/, 9];
                            case 7:
                                if (Array.isArray(field.options) &&
                                    field.options.includes(fieldValue)) {
                                    formData[field.field_name] = fieldValue;
                                }
                                else {
                                    return [2 /*return*/, res.error("\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A ".concat(field.field_name))];
                                }
                                return [3 /*break*/, 9];
                            case 8:
                                formData[field.field_name] = fieldValue;
                                _f.label = 9;
                            case 9:
                                _i++;
                                return [3 /*break*/, 3];
                            case 10:
                                loan.application_form = JSON.stringify(formData);
                                return [4 /*yield*/, loan.createLog(req, "create", "loan", obj)];
                            case 11:
                                _f.sent();
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
                            case 12:
                                _f.sent();
                                _e = 0, fileUploads_1 = fileUploads;
                                _f.label = 13;
                            case 13:
                                if (!(_e < fileUploads_1.length)) return [3 /*break*/, 16];
                                file = fileUploads_1[_e];
                                return [4 /*yield*/, (0, data_source_1.orm)(File_Manager_1.File_Manager).save(file)];
                            case 14:
                                _f.sent();
                                _f.label = 15;
                            case 15:
                                _e++;
                                return [3 /*break*/, 13];
                            case 16:
                                data = new loan_contract_1.LoanContract();
                                data.user_id = req.user.id;
                                data.loan_id = loan.id;
                                data.installment_start = loan.startDate;
                                data.installment_end = loan.endDate;
                                data.stamp =
                                    loanPlan_1.stamp == 0 ? 0 : Number(loan.amount) / Number(loanPlan_1.stamp);
                                data.document = Number(loanPlan_1.document);
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_contract_1.LoanContract).save(data)];
                            case 17:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                reference = (0, index_2.generateReference)(new Date(), req.user.id);
                loan_document_max = loanParts.length;
                i = 0;
                _b.label = 5;
            case 5:
                if (!(i < loanParts.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, createLoan(loanParts[i], reference, i + 1, loan_document_max)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7:
                i++;
                return [3 /*break*/, 5];
            case 8:
                // if (user.email) {
                //   try {
                //     const subject = "การขอสินเชื่อสำเร็จ";
                //     const htmlContent = takeloan_notificate(user, obj, loanPlan, interestRate);
                //     sendNotificationEmail(user.email, subject, htmlContent, obj.user_id);
                //   } catch (error) {
                //     return res.error("การขอสินเชื่อสำเร็จ แต่การส่งอีเมลแจ้งล้มเหลว");
                //   }
                // }
                __1.io.emit('loans', { action: 1 });
                return [2 /*return*/, res.success("บันทึกการขอสินเชื่อสำเร็จ")];
            case 9:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.takeLoan = takeLoan;
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
var get_applicationForm = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var plan_id, _planId, plan, form, cutfield, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                plan_id = req.params.plan_id;
                _planId = parseInt(plan_id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: _planId } })];
            case 2:
                plan = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).find({
                        where: { plan_id: plan.plan_id },
                        order: { index: "ASC" },
                    })];
            case 3:
                form = _a.sent();
                cutfield = form.map(function (data) {
                    var created_at = data.created_at, updated_at = data.updated_at, deleted_at = data.deleted_at, res = __rest(data, ["created_at", "updated_at", "deleted_at"]);
                    return res;
                });
                return [2 /*return*/, res.success("Detail Loan", { applicationForm: cutfield })];
            case 4:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.get_applicationForm = get_applicationForm;
var my_loan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var search, status, userId, whereClause, parameters, loanQuery, loanResults, loanResult, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                search = req.query.search;
                status = req.params.status;
                userId = req.user.id;
                whereClause = " WHERE l.user_id = ? ";
                parameters = [userId];
                if (status && status.toLowerCase() === "due") {
                    whereClause += " AND LOWER(l.status) = LOWER(?)";
                    parameters.push("due");
                }
                else if (status && status.toLowerCase() === "running") {
                    whereClause += "\n            AND (\n                LOWER(l.status) = 'running' OR LOWER(l.status) = 'due'\n            )\n        ";
                }
                else if (status && status.toLowerCase() === "all") {
                    whereClause += "\n            AND (\n                LOWER(l.status) = 'running' OR LOWER(l.status) = 'due'\n            )\n        ";
                }
                if (search) {
                    whereClause +=
                        " AND (LOWER(l.loan_number) LIKE LOWER(?) OR LOWER(lp.name) LIKE LOWER(?))";
                    parameters.push("%".concat(search, "%"), "%".concat(search, "%"));
                }
                loanQuery = "\n        SELECT \n        l.*,\n        l.id AS loan_id,\n        lp.name as planname, \n        lp.rate AS plan_rate,\n        lp.application_percent_charge,\n        lp.delay_value,\n        lp.fixed_charge,\n        lp.type_interest,\n        l.installment_due as next_installment\n        FROM loan l\n        LEFT JOIN loan_plan lp ON lp.id = l.plan_id\n        ".concat(whereClause, " \n        ");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(loanQuery, parameters)];
            case 2:
                loanResults = _a.sent();
                if (loanResults.length === 0)
                    return [2 /*return*/, res.error("Loan not found")];
                loanResult = loanResults.map(function (loan) {
                    var rateArray = loan.plan_rate;
                    var totalInstallment = Number(loan.total_installment);
                    var matchedRate = rateArray.find(function (rateItem) { return Number(rateItem.installment) === totalInstallment; });
                    if (matchedRate) {
                        loan.interest_rate = Number(matchedRate.interest_rate) + Number(loan.application_percent_charge);
                    }
                    var loan_summary = {
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
                    };
                    var application_form = loan.application_form, plan_rate = loan.plan_rate, application_percent_charge = loan.application_percent_charge, filteredLoan = __rest(loan, ["application_form", "plan_rate", "application_percent_charge"]);
                    return __assign(__assign({}, filteredLoan), loan_summary);
                });
                // const loansWithPaymentLink = loanResult.map(loan => {
                //     loan.payment_link = `loan/pay/${loan.loan_id}/${loan.next_installment_id}`;
                //     return loan;
                // });
                return [2 /*return*/, res.success("Get Loan Detail", loanResult)];
            case 3:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.my_loan = my_loan;
var myloanContract = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loan_id, _loanId, user, loan, loanContract, detail, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loan_id = req.params.loan_id;
                _loanId = parseInt(loan_id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: req.user.id } })];
            case 2:
                user = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({
                        where: { user_id: req.user.id, id: _loanId },
                    })];
            case 3:
                loan = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_contract_1.LoanContract).findOne({
                        where: { user_id: req.user.id, loan_id: _loanId },
                    })];
            case 4:
                loanContract = _a.sent();
                if (!loan)
                    return [2 /*return*/, res.error("ยังไม่มีสินเชื่อที่อนุมัติ")];
                if (!loanContract)
                    return [2 /*return*/, res.error("ไม่พบสัญญากู้")];
                detail = {
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
                return [2 /*return*/, res.success("My loan id", detail)];
            case 5:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.myloanContract = myloanContract;
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
var due_installment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loan_id, _loanId, userId, loan_2, loanPlan, installments_1, interestRate_2, __array, __installment_per_month_1, __amount, totalInterest_1, totalAmount_1, remainingAmount_1, nextDate_1, __rate, __diff, __pill, __diff2, __pill2, totalAmount_2, nextDate_2, loan_summary, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loan_id = req.params.loan_id;
                _loanId = parseInt(loan_id) || -1;
                userId = req.user.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({
                        where: { id: _loanId, user_id: userId },
                    })];
            case 2:
                loan_2 = _a.sent();
                if (!loan_2)
                    return [2 /*return*/, res.error("Loan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({
                        where: { id: loan_2.plan_id },
                    })];
            case 3:
                loanPlan = _a.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error("Loan Plan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                        where: { loan_id: loan_2.id },
                    })];
            case 4:
                installments_1 = _a.sent();
                interestRate_2 = Number(loan_2.loan_interest) +
                    Number(loanPlan.application_percent_charge);
                __array = void 0;
                __amount = Number(loan_2.amount);
                if (loanPlan.type_interest === 'flatrate') {
                    totalInterest_1 = __amount * (interestRate_2 / 100) * (loan_2.total_installment / 12);
                    totalAmount_1 = __amount + totalInterest_1;
                    __installment_per_month_1 =
                        Math.round((totalAmount_1 / loan_2.total_installment + Number.EPSILON) * 100) / 100;
                    remainingAmount_1 = totalAmount_1;
                    nextDate_1 = new Date(loan_2.installment_start);
                    __array = Array.from({ length: Number(loan_2.total_installment) }).map(function (_, i) {
                        var currentDate = new Date(loan_2.installment_due);
                        currentDate.setMonth(currentDate.getMonth() + i);
                        var timeDifference = currentDate.getTime() - nextDate_1.getTime();
                        nextDate_1 = currentDate;
                        var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        var __principle, __interest, __amount_per_month;
                        if (i === Number(loan_2.total_installment) - 1) {
                            // งวดสุดท้าย
                            __amount_per_month =
                                Math.round((remainingAmount_1 + Number.EPSILON) * 100) / 100;
                            __interest =
                                Math.round((totalInterest_1 / loan_2.total_installment + Number.EPSILON) * 100) / 100;
                            __principle =
                                Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) / 100;
                        }
                        else {
                            __amount_per_month = __installment_per_month_1;
                            __interest =
                                Math.round((totalInterest_1 / loan_2.total_installment + Number.EPSILON) * 100) / 100;
                            __principle =
                                Math.round((__amount_per_month - __interest + Number.EPSILON) * 100) / 100;
                        }
                        remainingAmount_1 =
                            Math.round((remainingAmount_1 - __amount_per_month + Number.EPSILON) * 100) / 100;
                        return {
                            date: currentDate,
                            amount: __amount_per_month,
                            interest: __interest,
                            principle: __principle,
                            remaining: Math.max(0, remainingAmount_1),
                            receive: Math.round((totalAmount_1 - remainingAmount_1 + Number.EPSILON) * 100) / 100,
                            days: daysPassed,
                        };
                    });
                }
                else {
                    __rate = Number(interestRate_2) / 100 / 12;
                    __diff = Number(loan_2.amount) * __rate;
                    __pill = Math.pow(1 + __rate, loan_2.total_installment);
                    __diff2 = __diff * __pill;
                    __pill2 = __pill - 1;
                    __installment_per_month_1 = __diff2 / __pill2;
                    totalAmount_2 = Number(loan_2.remaining);
                    nextDate_2 = new Date(loan_2.installment_start);
                    __array = Array.from({ length: Number(loan_2.total_installment) }).map(function (_, i) {
                        var currentDate = new Date(loan_2.installment_due);
                        currentDate.setMonth(currentDate.getMonth() + i);
                        var timeDifference = currentDate.getTime() - nextDate_2.getTime();
                        nextDate_2 = currentDate;
                        var daysPassed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                        var year = currentDate.getFullYear();
                        var daysInYear = (0, calurate_1.getDaysInYear)(year);
                        var __interest = (totalAmount_2 * (Number(interestRate_2) / 100) * daysPassed) / daysInYear;
                        var __principle = __installment_per_month_1 - __interest <= 0
                            ? 0
                            : __installment_per_month_1 - __interest;
                        if (i === Number(loan_2.total_installment) - 1) {
                            __principle = totalAmount_2;
                        }
                        else if (__principle > totalAmount_2)
                            __principle = totalAmount_2;
                        else if (totalAmount_2 === 0)
                            return {
                                date: currentDate,
                                amount: 0,
                                interest: 0,
                                principle: 0,
                                remaining: 0,
                                receive: totalAmount_2,
                                days: 0,
                            };
                        totalAmount_2 = totalAmount_2 - __principle;
                        var __receive = Number(loan_2.amount) - totalAmount_2;
                        var __amount = __principle + __interest;
                        return {
                            date: currentDate,
                            amount: Math.round((__amount + Number.EPSILON) * 100) / 100,
                            interest: Math.round((__interest + Number.EPSILON) * 100) / 100,
                            principle: Math.round((__principle + Number.EPSILON) * 100) / 100,
                            remaining: Math.round((totalAmount_2 + Number.EPSILON) * 100) / 100,
                            receive: Math.round((__receive + Number.EPSILON) * 100) / 100,
                            days: daysPassed,
                        };
                    });
                }
                loan_summary = {
                    loan_number: loan_2.loan_number,
                    plan: loanPlan.name,
                    amount: Number(loan_2.amount),
                    per_installment: Number(loan_2.per_installment),
                    total_installment: Number(loan_2.total_installment),
                    given_installment: Number(loan_2.given_installment + 1),
                    receivable: Number(loan_2.receivable),
                    delay_value: Number(loanPlan.delay_value),
                    total_paid: Number(loan_2.total_paid),
                    remaining: Number(loan_2.remaining),
                    installment_start: loan_2.installment_start,
                    installment_due: loan_2.installment_due,
                    interestRate: interestRate_2,
                    overdue_balance: Number(loan_2.overdue_balance),
                    status: loan_2.status,
                    pay_days: 30,
                    delay_days: loanPlan.delay_days,
                    delay_charge: loanPlan.delay_charge,
                };
                return [2 /*return*/, res.success("Get installment LoanId", { loan_summary: loan_summary, installment: __array })];
            case 5:
                err_6 = _a.sent();
                console.log(err_6);
                return [2 /*return*/, res.error(err_6.detail || err_6.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.due_installment = due_installment;
var installments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loan_id, _loanId, userId, loan_3, loanPlan, installments_2, selectedRate, interestRate, loan_summary, notApprove, updatedInstallments, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loan_id = req.params.loan_id;
                _loanId = parseInt(loan_id) || -1;
                userId = req.user.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({
                        where: { id: _loanId, user_id: userId },
                    })];
            case 2:
                loan_3 = _a.sent();
                if (!loan_3)
                    return [2 /*return*/, res.error("Loan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({
                        where: { id: loan_3.plan_id },
                    })];
            case 3:
                loanPlan = _a.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error("Loan Plan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                        where: { loan_id: loan_3.id },
                        // take: perPage,
                        // skip: offset,
                    })];
            case 4:
                installments_2 = _a.sent();
                selectedRate = loanPlan.rate.find(function (r) { return Number(r.installment) === loan_3.total_installment; });
                interestRate = Number(selectedRate.interest_rate) +
                    Number(loanPlan.application_percent_charge);
                loan_summary = {
                    loan_number: loan_3.loan_number,
                    plan: loanPlan.name,
                    amount: Number(loan_3.amount),
                    per_installment: Number(loan_3.per_installment),
                    total_installment: Number(loan_3.total_installment),
                    given_installment: Number(loan_3.given_installment + 1),
                    receivable: Number(loan_3.receivable),
                    delay_value: Number(loanPlan.delay_value),
                    total_paid: Number(loan_3.total_paid),
                    remaining: Number(loan_3.remaining),
                    installment_start: loan_3.installment_start,
                    installment_due: loan_3.installment_due,
                    interestRate: interestRate,
                    overdue_balance: Number(loan_3.overdue_balance),
                    status: loan_3.status,
                    pay_days: 30,
                    delay_days: loanPlan.delay_days,
                    delay_charge: loanPlan.delay_charge,
                };
                notApprove = {
                    id: loan_3.id,
                    loan_number: loan_3.loan_number,
                    plan: loanPlan.name,
                    amount: 0,
                    per_installment: 0,
                    delay_charge: 0,
                    total_installment: loan_3.total_installment,
                };
                updatedInstallments = [];
                if (loan_3.status == enum_1.loan_status.Running) {
                    updatedInstallments = installments_2;
                }
                else {
                    updatedInstallments = [notApprove];
                }
                return [2 /*return*/, res.success("Get installment LoanId", {
                        loan_summary: loan_summary,
                        installment: updatedInstallments,
                    })];
            case 5:
                err_7 = _a.sent();
                console.log(err_7);
                return [2 /*return*/, res.error(err_7.detail || err_7.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.installments = installments;
var installmentAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, page, limit, status, perPage, offset, userId, loans, planIds, loanIds, plans, planMap_1, allInstallments, totalInstallmentsMap_1, paidInstallmentsMap_1, filteredInstallments_1, installmentData_1, paginatedInstallments, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, page = _a.page, limit = _a.limit;
                status = req.params.status;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                userId = req.user.id;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).find({ where: { user_id: userId } })];
            case 2:
                loans = _b.sent();
                if (!loans.length)
                    return [2 /*return*/, res.error("No loans found")];
                planIds = loans.map(function (loan) { return loan.plan_id; });
                loanIds = loans.map(function (loan) { return loan.id; });
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).find({ where: { id: (0, typeorm_1.In)(planIds) } })];
            case 3:
                plans = _b.sent();
                planMap_1 = plans.reduce(function (map, plan) {
                    map[plan.id] = plan.name;
                    return map;
                }, {});
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                        where: { loan_id: (0, typeorm_1.In)(loanIds) },
                        order: { installment_date: "ASC" },
                    })];
            case 4:
                allInstallments = _b.sent();
                totalInstallmentsMap_1 = {};
                paidInstallmentsMap_1 = {};
                allInstallments.forEach(function (installment) {
                    if (!totalInstallmentsMap_1[installment.loan_id]) {
                        totalInstallmentsMap_1[installment.loan_id] = 0;
                        paidInstallmentsMap_1[installment.loan_id] = [];
                    }
                    totalInstallmentsMap_1[installment.loan_id]++;
                    if (installment.isPaid) {
                        paidInstallmentsMap_1[installment.loan_id].push(installment);
                    }
                });
                filteredInstallments_1 = allInstallments;
                if (status && status.toLowerCase() === "paid") {
                    filteredInstallments_1 = allInstallments.filter(function (installment) { return installment.isPaid; });
                }
                else if (status && status.toLowerCase() === "due") {
                    filteredInstallments_1 = allInstallments.filter(function (installment) { return !installment.isPaid; });
                }
                installmentData_1 = [];
                loans.forEach(function (loan) {
                    var loanInstallments = filteredInstallments_1.filter(function (inst) { return inst.loan_id === loan.id; });
                    loanInstallments.forEach(function (installment, index) {
                        var installmentNumber = index + 1;
                        if (status && status.toLowerCase() === "paid") {
                            installmentNumber =
                                paidInstallmentsMap_1[loan.id].findIndex(function (inst) { return inst.id === installment.id; }) + 1;
                        }
                        else if (status && status.toLowerCase() === "due") {
                            installmentNumber = paidInstallmentsMap_1[loan.id].length + index + 1;
                        }
                        installmentData_1.push(__assign(__assign({}, installment), { plan_name: planMap_1[loan.plan_id], loan_number: loan.loan_number, installment_number: installmentNumber, total_installments: totalInstallmentsMap_1[loan.id] }));
                    });
                });
                paginatedInstallments = installmentData_1.slice(offset, offset + perPage);
                return [2 /*return*/, res.success("Get Installment all", paginatedInstallments, installmentData_1.length)];
            case 5:
                err_8 = _b.sent();
                console.log(err_8);
                return [2 /*return*/, res.status(500).json({ error: err_8.detail || err_8.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.installmentAll = installmentAll;
var getPaymentDetails = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _loanId, _installmentId, loan_4, plan, paymentDetails_1, allInstallments, installment, installmentIndex, currentDate, installmentDate, delayDays, startDate, lastPayment, days, delayValue, fixedCharge, delayCharge, monthsLate, remainingPerInstallment, selectedRate, interestRate, currentInterest, closeloan, paymentDetails, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _loanId = parseInt(req.params.loan_id) || -1;
                _installmentId = parseInt(req.params.installment_id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({ where: { id: _loanId } })];
            case 2:
                loan_4 = _a.sent();
                if (!loan_4)
                    return [2 /*return*/, res.error("Loan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: loan_4.plan_id } })];
            case 3:
                plan = _a.sent();
                if (loan_4.approved_at === null) {
                    paymentDetails_1 = {
                        loan_id: loan_4.id,
                        plan_name: plan.name,
                        loan_number: loan_4.loan_number,
                        installment_date: null,
                        per_installment: 0,
                        delay_charge: 0,
                        totalpay: 0,
                        total_installments: loan_4.total_installment,
                    };
                    return [2 /*return*/, res.success("Get Payment Details", paymentDetails_1)];
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                        where: { loan_id: _loanId },
                        order: { installment_date: "ASC" },
                    })];
            case 4:
                allInstallments = _a.sent();
                installment = allInstallments.find(function (inst) { return inst.id === _installmentId; });
                installmentIndex = allInstallments.findIndex(function (inst) { return inst.id === _installmentId; }) + 1;
                currentDate = new Date();
                installmentDate = new Date(installment.installment_date);
                delayDays = Math.max(0, Math.ceil((currentDate.getTime() - installmentDate.getTime()) /
                    (1000 * 60 * 60 * 24)));
                startDate = void 0;
                if (!(loan_4.given_installment === 0)) return [3 /*break*/, 5];
                // งวดแรก ใช้ approve_at
                startDate = new Date(loan_4.approved_at);
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).findOne({
                    where: { loan_id: loan_4.id },
                    order: { given_at: "DESC" },
                })];
            case 6:
                lastPayment = _a.sent();
                startDate = new Date(lastPayment.given_at);
                _a.label = 7;
            case 7:
                days = Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                delayValue = parseInt(plan.delay_value);
                fixedCharge = Number(plan.fixed_charge);
                delayCharge = 0;
                if (delayDays > delayValue) {
                    monthsLate = Math.floor((delayDays - delayValue) / 30) + 1;
                    delayCharge = fixedCharge * monthsLate;
                }
                installment.delay_charge = delayCharge;
                // ถ้าจ่ายค่าล่าช้าแล้ว ให้ delayCharge = 0
                if (installment.delay_charge_paid >= installment.delay_charge) {
                    delayCharge = 0;
                }
                remainingPerInstallment = 0;
                if (installment.paid === 0) {
                    remainingPerInstallment =
                        Number(installment.per_installment) +
                            delayCharge +
                            Number(installment.overdue_balance);
                }
                else {
                    remainingPerInstallment =
                        Number(loan_4.per_installment) -
                            (Number(installment.paid) -
                                (Number(installment.paid) >= Number(installment.delay_charge)
                                    ? delayCharge
                                    : 0));
                }
                selectedRate = plan.rate.find(function (r) { return Number(r.installment) === loan_4.total_installment; });
                interestRate = selectedRate.interest_rate + Number(plan.application_percent_charge);
                currentInterest = Number(loan_4.principle) * (((interestRate / 100) * days) / 366);
                closeloan = Number(loan_4.principle) + currentInterest;
                paymentDetails = {
                    loan_id: loan_4.id,
                    installment_id: installment.id,
                    plan_name: plan.name,
                    loan_number: loan_4.loan_number,
                    installment_date: installment.installment_date,
                    per_installment: remainingPerInstallment > 0 ? remainingPerInstallment : 0,
                    overdue_balance: loan_4.overdue_balance,
                    delay_charge: delayCharge,
                    delay_days: delayDays,
                    totalpay: (remainingPerInstallment > 0 ? remainingPerInstallment : 0) +
                        Number(loan_4.overdue_balance) +
                        delayCharge,
                    installment_number: installmentIndex,
                    total_installments: loan_4.total_installment,
                    closeLoan: closeloan,
                };
                return [2 /*return*/, res.success("Get Payment Details", paymentDetails)];
            case 8:
                err_9 = _a.sent();
                console.log(err_9);
                return [2 /*return*/, res.error(err_9.detail || err_9.routine)];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.getPaymentDetails = getPaymentDetails;
var payment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
            return [2 /*return*/, res.success("Comming Soon")];
        }
        catch (err) {
            console.log(err);
            return [2 /*return*/, res.error(err.detail || err.routine)];
        }
        return [2 /*return*/];
    });
}); };
exports.payment = payment;
var removeUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, user_1, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = req.params.user_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: user_id } })];
            case 2:
                user_1 = _a.sent();
                if (!user_1)
                    return [2 /*return*/, res.error("ไม่พบผู้ใช้")];
                return [4 /*yield*/, data_source_1.AppDataSource.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                        var loans, _i, loans_1, loan, loanContracts, installments_3, taxes, userAccessToken, userKyc, smsVerify;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, transactionManager.find(loan_1.Loan, {
                                        where: { user_id: user_id },
                                    })];
                                case 1:
                                    loans = _a.sent();
                                    _i = 0, loans_1 = loans;
                                    _a.label = 2;
                                case 2:
                                    if (!(_i < loans_1.length)) return [3 /*break*/, 11];
                                    loan = loans_1[_i];
                                    return [4 /*yield*/, transactionManager.find(loan_contract_1.LoanContract, {
                                            where: { loan_id: loan.id },
                                        })];
                                case 3:
                                    loanContracts = _a.sent();
                                    return [4 /*yield*/, transactionManager.find(loan_installment_1.Installment, {
                                            where: { loan_id: loan.id },
                                        })];
                                case 4:
                                    installments_3 = _a.sent();
                                    return [4 /*yield*/, transactionManager.find(tax_1.Tax, {
                                            where: { loan_id: loan.id },
                                        })];
                                case 5:
                                    taxes = _a.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_contract_1.LoanContract, loanContracts)];
                                case 6:
                                    _a.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_installment_1.Installment, installments_3)];
                                case 7:
                                    _a.sent();
                                    // await transactionManager.remove(LoanGuarantee, guarantees);
                                    return [4 /*yield*/, transactionManager.remove(tax_1.Tax, taxes)];
                                case 8:
                                    // await transactionManager.remove(LoanGuarantee, guarantees);
                                    _a.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_1.Loan, loan)];
                                case 9:
                                    _a.sent();
                                    _a.label = 10;
                                case 10:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 11: return [4 /*yield*/, transactionManager.findOne(entities_3.UsersAccessToken, { where: { userid: user_id } })];
                                case 12:
                                    userAccessToken = _a.sent();
                                    if (!userAccessToken) return [3 /*break*/, 14];
                                    return [4 /*yield*/, transactionManager.remove(entities_3.UsersAccessToken, userAccessToken)];
                                case 13:
                                    _a.sent();
                                    _a.label = 14;
                                case 14: return [4 /*yield*/, transactionManager.findOne(entities_2.Users_KYC, {
                                        where: { user_id: user_id },
                                    })];
                                case 15:
                                    userKyc = _a.sent();
                                    if (!userKyc) return [3 /*break*/, 17];
                                    return [4 /*yield*/, transactionManager.remove(entities_2.Users_KYC, userKyc)];
                                case 16:
                                    _a.sent();
                                    _a.label = 17;
                                case 17: return [4 /*yield*/, transactionManager.findOne(entities_4.Users_SMS, {
                                        where: { mobile: user_1.mobile },
                                    })];
                                case 18:
                                    smsVerify = _a.sent();
                                    if (!smsVerify) return [3 /*break*/, 20];
                                    return [4 /*yield*/, transactionManager.remove(entities_4.Users_SMS, smsVerify)];
                                case 19:
                                    _a.sent();
                                    _a.label = 20;
                                case 20: return [4 /*yield*/, transactionManager.remove(entities_1.Users, user_1)];
                                case 21:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                return [2 /*return*/, res.success("ลบผู้ใช้และข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว")];
            case 4:
                err_10 = _a.sent();
                console.log(err_10);
                return [2 /*return*/, res.error(err_10.detail || err_10.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.removeUser = removeUser;
