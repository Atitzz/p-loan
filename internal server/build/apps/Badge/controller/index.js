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
exports.badge = void 0;
var typeorm_1 = require("typeorm");
var data_source_1 = require("../../../data-source");
var contactus_1 = require("../../ContactUS/entities/contactus");
var loan_1 = require("../../Loan/entities/loan");
var loan_contract_1 = require("../../Loan_non_user/entities/loan_contract");
var entities_1 = require("../../Users/entities");
var badge = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loan_new, loan_due, user_mobile_unverfied, user_kyc_unverfied, user_kyc_pending, loan_apply_now, contact_us, loans, users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({ where: { status: "Pending" } })];
            case 1:
                loan_new = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({ where: { installment_due: (0, typeorm_1.LessThanOrEqual)(new Date()),
                            status: "Running", } })];
            case 2:
                loan_due = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({ where: { sv: "unverified" } })];
            case 3:
                user_mobile_unverfied = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({ where: { kyc: "unverified" } })];
            case 4:
                user_kyc_unverfied = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({ where: { kyc: "pending" } })];
            case 5:
                user_kyc_pending = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_contract_1.LoanContractNonUser).count({ where: { is_read: "0" } })];
            case 6:
                loan_apply_now = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(contactus_1.ContactUS).count({ where: { is_read: "0" } })];
            case 7:
                contact_us = _a.sent();
                loans = loan_new > 0 || loan_due > 0 ? 1 : 0;
                users = user_mobile_unverfied > 0 || user_kyc_unverfied > 0 || user_kyc_pending > 0 ? 1 : 0;
                return [2 /*return*/, res.success("Dashboard", {
                        loans: loans,
                        users: users,
                        loan_new: loan_new,
                        loan_due: loan_due,
                        user_mobile_unverfied: user_mobile_unverfied,
                        user_kyc_unverfied: user_kyc_unverfied,
                        user_kyc_pending: user_kyc_pending,
                        loan_apply_now: loan_apply_now,
                        contact_us: contact_us
                    })];
        }
    });
}); };
exports.badge = badge;
