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
exports.transactions_user = exports.transactions_dept = exports.transactions_admin = void 0;
var data_source_1 = require("../../../data-source");
var transactions_admin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, whereClause, parameters, countQuery, query, totalResult, _total, installment, total, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = '';
                parameters = [];
                if (search) {
                    whereClause += " WHERE (\n            LOWER(u.citizen_id) LIKE LOWER(?) \n            OR LOWER(l.loan_number) LIKE LOWER(?) \n            OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)\n        )";
                    parameters.push("%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"));
                }
                if (start && end) {
                    if (whereClause === '') {
                        whereClause += " WHERE i.given_at BETWEEN ? AND ?";
                    }
                    else {
                        whereClause += " AND i.given_at BETWEEN ? AND ?";
                    }
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                parameters.push(perPage, offset);
                countQuery = "\n        SELECT COUNT(*) as total\n        FROM loan_installment i\n        LEFT JOIN system_users u ON i.user_id = u.id\n        LEFT JOIN loan l ON l.id = i.loan_id\n        ".concat(whereClause);
                query = "\n        SELECT \n            i.*,\n            i.delay_charge_paid,\n            i.delay_charge_paid AS delay_charge_paid2,\n            i.delay_charge AS delay_charge,\n            i.delay_charge AS delay_charge2,\n            i.installment AS given_installment,\n            i.delay_days AS days,\n            l.total_installment,\n            l.closed_at, \n            u.username, \n            u.firstname, \n            u.lastname,\n            l.principle, \n            l.interest,\n            lp.application_percent_charge,\n            lp.rate\n        FROM \n            loan_installment i\n        LEFT JOIN \n            system_users u ON i.user_id = u.id\n        LEFT JOIN \n            loan l ON l.id = i.loan_id\n        LEFT JOIN \n            loan_plan lp ON lp.id = l.plan_id\n        ".concat(whereClause, "\n        ORDER BY \n            i.created_at DESC\n        LIMIT \n            ? OFFSET ?;\n        ");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 2:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 3:
                installment = _b.sent();
                if (installment.length === 0) {
                    return [2 /*return*/, res.error('ไม่พบรายการ')];
                }
                installment.forEach(function (loan) {
                    var _a;
                    var rateArray = loan.rate;
                    loan.interest_rate = Array.isArray(rateArray)
                        ? ((_a = rateArray.find(function (r) { return r.installment == loan.total_installment; })) === null || _a === void 0 ? void 0 : _a.interest_rate)
                        : 0;
                    delete loan.rate;
                });
                total = installment.reduce(function (acc, loan) {
                    acc.per_installment += Number(loan.per_installment || 0);
                    acc.principle_installment += Number(loan.principle_installment || 0);
                    acc.interest_installment += Number(loan.interest_installment || 0);
                    acc.paid += Number(loan.paid || 0);
                    acc.principle_paid += Number(loan.principle_paid || 0);
                    acc.interest_paid += Number(loan.interest_paid || 0);
                    acc.delay_charge += Number(loan.delay_charge || 0);
                    acc.application_charge += Number(loan.application_charge || 0);
                    acc.delay_charge2 += Number(loan.delay_charge2 || 0);
                    acc.delay_charge_paid += Number(loan.delay_charge_paid || 0);
                    acc.delay_charge_paid2 += Number(loan.delay_charge_paid2 || 0);
                    acc.cash += Number(loan.cash || 0);
                    acc.transfer_payment += Number(loan.transfer_payment || 0);
                    acc.overdue_balance += Number(loan.overdue_balance || 0);
                    return acc;
                }, {
                    per_installment: 0,
                    principle_installment: 0,
                    interest_installment: 0,
                    paid: 0,
                    principle_paid: 0,
                    interest_paid: 0,
                    delay_charge: 0,
                    application_charge: 0,
                    delay_charge2: 0,
                    delay_charge_paid: 0,
                    delay_charge_paid2: 0,
                    cash: 0,
                    transfer_payment: 0,
                    overdue_balance: 0
                });
                return [2 /*return*/, res.success('Get installment Success', { data: installment, total: total }, _total)];
            case 4:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.transactions_admin = transactions_admin;
var transactions_dept = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, whereClause, parameters, countQuery, query, totalResult, _total, installment, total, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = '';
                parameters = [];
                if (search) {
                    whereClause += " WHERE (\n            LOWER(u.citizen_id) LIKE LOWER(?) \n            OR LOWER(l.loan_number) LIKE LOWER(?) \n            OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)\n        )";
                    parameters.push("%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"));
                }
                if (start && end) {
                    if (whereClause === '') {
                        whereClause += " WHERE i.start_date BETWEEN ? AND ?";
                    }
                    else {
                        whereClause += " AND i.start_date BETWEEN ? AND ?";
                    }
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                parameters.push(perPage, offset);
                countQuery = "\n        SELECT COUNT(*) as total\n        FROM loan_installment i\n        LEFT JOIN system_users u ON i.user_id = u.id\n        LEFT JOIN loan l ON l.id = i.loan_id\n        ".concat(whereClause);
                query = "\n        SELECT \n            i.*,\n            i.delay_charge_paid,\n            i.delay_charge_paid AS delay_charge_paid2,\n            i.delay_charge AS delay_charge,\n            i.delay_charge AS delay_charge2,\n            i.installment AS given_installment,\n            i.delay_days AS days,\n            l.total_installment,\n            l.closed_at, \n            u.username, \n            u.firstname, \n            u.lastname,\n            l.principle, \n            l.interest,\n            lp.application_percent_charge,\n            lp.rate\n        FROM \n            loan_installment i\n        LEFT JOIN \n            system_users u ON i.user_id = u.id\n        LEFT JOIN \n            loan l ON l.id = i.loan_id\n        LEFT JOIN \n            loan_plan lp ON lp.id = l.plan_id\n        ".concat(whereClause, "\n        ORDER BY \n            i.created_at DESC\n        LIMIT \n            ? OFFSET ?;\n        ");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 2:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 3:
                installment = _b.sent();
                if (installment.length === 0) {
                    return [2 /*return*/, res.error('ไม่พบรายการ')];
                }
                installment.forEach(function (loan) {
                    var _a;
                    var rateArray = loan.rate;
                    loan.interest_rate = Array.isArray(rateArray)
                        ? ((_a = rateArray.find(function (r) { return r.installment == loan.total_installment; })) === null || _a === void 0 ? void 0 : _a.interest_rate)
                        : 0;
                    delete loan.rate;
                });
                total = installment.reduce(function (acc, loan) {
                    acc.per_installment += Number(loan.per_installment || 0);
                    acc.principle_installment += Number(loan.principle_installment || 0);
                    acc.interest_installment += Number(loan.interest_installment || 0);
                    acc.paid += Number(loan.paid || 0);
                    acc.principle_paid += Number(loan.principle_paid || 0);
                    acc.interest_paid += Number(loan.interest_paid || 0);
                    acc.delay_charge += Number(loan.delay_charge || 0);
                    acc.application_charge += Number(loan.application_charge || 0);
                    acc.delay_charge2 += Number(loan.delay_charge2 || 0);
                    acc.delay_charge_paid += Number(loan.delay_charge_paid || 0);
                    acc.delay_charge_paid2 += Number(loan.delay_charge_paid2 || 0);
                    acc.cash += Number(loan.cash || 0);
                    acc.transfer_payment += Number(loan.transfer_payment || 0);
                    acc.overdue_balance += Number(loan.overdue_balance || 0);
                    return acc;
                }, {
                    per_installment: 0,
                    principle_installment: 0,
                    interest_installment: 0,
                    paid: 0,
                    principle_paid: 0,
                    interest_paid: 0,
                    delay_charge: 0,
                    application_charge: 0,
                    delay_charge2: 0,
                    delay_charge_paid: 0,
                    delay_charge_paid2: 0,
                    cash: 0,
                    transfer_payment: 0,
                    overdue_balance: 0
                });
                return [2 /*return*/, res.success('Get installment Success', { data: installment, total: total }, _total)];
            case 4:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.transactions_dept = transactions_dept;
var transactions_user = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, search, page, limit, type, remark, perPage, offset, whereClause, parameters, countQuery, query, totalResult, _total, transactions, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.user.id;
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, type = _a.type, remark = _a.remark;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = 'WHERE u.id = ? ';
                parameters = [userId];
                if (search) {
                    whereClause += " AND (LOWER(t.trx) LIKE LOWER(?))";
                    parameters.push("%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"));
                }
                if (type && type.toLowerCase() !== 'all') {
                    whereClause += " AND LOWER(t.trx_type) = LOWER(?)";
                    parameters.push(type.toLowerCase());
                }
                if (remark && remark.toLowerCase() !== 'all') {
                    whereClause += " AND LOWER(t.remark) LIKE LOWER(?)";
                    parameters.push(remark.toLowerCase());
                }
                parameters.push(perPage, offset);
                countQuery = "\n        SELECT COUNT(*) as total\n        FROM loan_transaction t\n        LEFT JOIN system_users u ON t.user_id = u.id\n        ".concat(whereClause);
                query = "\n        SELECT \n            t.*,\n            u.username, u.firstname, u.lastname\n        FROM loan_transaction t\n        LEFT JOIN system_users u ON t.user_id = u.id\n        ".concat(whereClause, "\n        ORDER BY t.created_at DESC\n        LIMIT ? OFFSET ?\n        ");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 2:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 3:
                transactions = _b.sent();
                if (transactions.length === 0) {
                    return [2 /*return*/, res.error('No transactions found')];
                }
                return [2 /*return*/, res.success('Get Transactions Success', transactions, _total)];
            case 4:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.transactions_user = transactions_user;
