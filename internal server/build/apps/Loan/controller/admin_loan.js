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
exports.payment = exports.takeLoan_admin = exports.removeLoan = exports.badLoan = exports.rejectLoan = exports.approveLoan = exports.get_installments = exports.edit_loanDetail = exports.get_loanDetail = exports.get_loans = exports.lastCustomer = exports.dashboardGraph = exports.dashboard = void 0;
var loan_plan_1 = require("../entities/loan_plan");
var data_source_1 = require("../../../data-source");
var loan_1 = require("../entities/loan");
var loan_installment_1 = require("../entities/loan_installment");
var enum_1 = require("../../Utils/enum");
var entities_1 = require("../../Users/entities");
var typeorm_1 = require("typeorm");
var loan_contract_1 = require("../entities/loan_contract");
var module_1 = require("../../Line_Message/module");
var File_Manager_1 = require("../../FileManager/entities/File_Manager");
var loan_applicationform_1 = require("../entities/loan_applicationform");
var index_1 = require("../../../Utils/index");
var calurate_1 = require("./calurate");
var tax_1 = require("../entities/tax");
var Utils_1 = require("../../../Utils");
var dashboard = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, month, year, currentDate, currentMonth, currentYear, hasDateFilter, queryMonth, queryYear, start, end, totalUser, activeUser, kycPending, mobileUnverify, dateFilter, allLoan, runningLoan, pendingLoan, rejectLoan_1, dueLoan, paidLoan, badLoan_1, query, result, totalPaidData, overdueBalanceData, categoriesData, dashboardData, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 13, , 14]);
                _a = req.query, month = _a.month, year = _a.year;
                currentDate = new Date();
                currentMonth = currentDate.getMonth() + 1;
                currentYear = currentDate.getFullYear();
                hasDateFilter = month && year;
                queryMonth = month ? parseInt(month) : currentMonth;
                queryYear = year ? parseInt(year) : currentYear;
                start = new Date(queryYear, queryMonth - 1, 1);
                end = new Date(queryYear, queryMonth, 0, 23, 59, 59);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({})];
            case 1:
                totalUser = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({
                        where: { line_id: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) },
                    })];
            case 2:
                activeUser = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({ where: { kyc: "pending" } })];
            case 3:
                kycPending = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({
                        where: { sv: "unverified" },
                    })];
            case 4:
                mobileUnverify = _b.sent();
                dateFilter = hasDateFilter ? { created_at: (0, typeorm_1.Between)(start, end) } : {};
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({
                        where: __assign({}, dateFilter),
                    })];
            case 5:
                allLoan = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({
                        where: __assign({ status: (0, typeorm_1.In)([enum_1.loan_status.Running]) }, dateFilter),
                    })];
            case 6:
                runningLoan = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({
                        where: __assign({ status: enum_1.loan_status.Pending }, dateFilter),
                    })];
            case 7:
                pendingLoan = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({
                        where: __assign({ status: enum_1.loan_status.Rejected }, dateFilter),
                    })];
            case 8:
                rejectLoan_1 = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({
                        where: __assign({ installment_due: (0, typeorm_1.LessThanOrEqual)(new Date()), status: enum_1.loan_status.Running }, dateFilter),
                    })];
            case 9:
                dueLoan = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({
                        where: __assign({ status: enum_1.loan_status.Paid }, dateFilter),
                    })];
            case 10:
                paidLoan = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).count({
                        where: __assign({ status: enum_1.loan_status.Bad }, dateFilter),
                    })];
            case 11:
                badLoan_1 = _b.sent();
                query = "\n            WITH months AS (\n                SELECT LAST_DAY(DATE(CONCAT(YEAR(CURDATE()), '-', m, '-01'))) AS end_date\n                FROM (SELECT 1 AS m UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL \n                      SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL \n                      SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12) AS months\n            ),\n            loan_data AS (\n                SELECT \n                    LAST_DAY(created_at) AS end_date,\n                    SUM(COALESCE(total_paid, 0)) AS total_paid,\n                    SUM(COALESCE(overdue_balance, 0)) AS overdue_balance\n                FROM \n                    loan\n                WHERE \n                    YEAR(created_at) = YEAR(CURDATE())\n                GROUP BY \n                    LAST_DAY(created_at)\n            )\n            SELECT \n                DATE_FORMAT(m.end_date, '%Y-%m-%d') AS end_date, -- \u0E41\u0E1B\u0E25\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1B\u0E47\u0E19\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\n                COALESCE(l.total_paid, 0) AS total_paid,\n                COALESCE(l.overdue_balance, 0) AS overdue_balance\n            FROM \n                months m\n            LEFT JOIN \n                loan_data l ON m.end_date = l.end_date\n            ORDER BY \n                m.end_date ASC;\n        ";
                return [4 /*yield*/, data_source_1.AppDataSource.query(query)];
            case 12:
                result = _b.sent();
                totalPaidData = result.map(function (row) { return row.total_paid; });
                overdueBalanceData = result.map(function (row) { return row.overdue_balance; });
                categoriesData = result.map(function (row) { return row.end_date; });
                dashboardData = {
                    totalUser: totalUser,
                    activeUser: activeUser,
                    kycPending: kycPending,
                    mobileUnverify: mobileUnverify,
                    allLoan: allLoan,
                    runningLoan: runningLoan,
                    pendingLoan: pendingLoan,
                    rejectLoan: rejectLoan_1,
                    dueLoan: dueLoan,
                    paidLoan: paidLoan,
                    badLoan: badLoan_1,
                    total_paid: totalPaidData,
                    overdue_balance: overdueBalanceData,
                    categories: categoriesData, // วันที่สิ้นเดือน
                };
                return [2 /*return*/, res.success("Dashboard", dashboardData)];
            case 13:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.dashboard = dashboard;
var dashboardGraph = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, start, end, currentDate, startDate, endDate, startDateString, endDateString, query, installmentData, allDates_1, d, totalPaidData_1, overdueBalanceData_1, outstandingBalanceData_1, graphResponseData, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, start = _a.start, end = _a.end;
                currentDate = new Date();
                startDate = start
                    ? new Date("".concat(start, "T00:00:00Z"))
                    : new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() - 1, currentDate.getUTCDate(), 0, 0, 0));
                endDate = end
                    ? new Date("".concat(end, "T23:59:59Z"))
                    : new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), currentDate.getUTCDate(), 23, 59, 59));
                startDateString = startDate.toISOString().split("T")[0];
                endDateString = endDate.toISOString().split("T")[0];
                query = "\n        SELECT \n          DATE(i.given_at) AS period,\n          SUM(i.paid) AS total_paid,\n          SUM(i.overdue_balance) AS overdue_balance,\n          SUM(IF(i.paid < i.per_installment, i.per_installment - i.paid, 0)) AS outstanding_balance\n        FROM loan_installment i\n        WHERE given_at BETWEEN ? AND ?\n        GROUP BY DATE(given_at)\n        ORDER BY DATE(given_at) ASC\n      ";
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, [
                        startDateString,
                        endDateString,
                    ])];
            case 1:
                installmentData = _b.sent();
                allDates_1 = [];
                for (d = new Date(startDate); d <= endDate; d.setUTCDate(d.getUTCDate() + 1)) {
                    allDates_1.push(new Date(d).toISOString().split("T")[0]);
                }
                totalPaidData_1 = Array(allDates_1.length).fill(0);
                overdueBalanceData_1 = Array(allDates_1.length).fill(0);
                outstandingBalanceData_1 = Array(allDates_1.length).fill(0);
                installmentData.forEach(function (row) {
                    var periodDate = new Date(row.period);
                    var periodUTC = new Date(Date.UTC(periodDate.getFullYear(), periodDate.getMonth(), periodDate.getDate()))
                        .toISOString()
                        .split("T")[0];
                    var dateIndex = allDates_1.indexOf(periodUTC);
                    if (dateIndex !== -1) {
                        totalPaidData_1[dateIndex] = row.total_paid;
                        overdueBalanceData_1[dateIndex] = row.overdue_balance;
                        outstandingBalanceData_1[dateIndex] = row.outstanding_balance;
                    }
                });
                graphResponseData = {
                    total_paid: totalPaidData_1,
                    overdue_balance: overdueBalanceData_1,
                    outstanding_balance: outstandingBalanceData_1,
                    categories: allDates_1,
                };
                return [2 /*return*/, res.success("Dashboard Graph", graphResponseData)];
            case 2:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.dashboardGraph = dashboardGraph;
var lastCustomer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, users, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).find({
                        where: { kyc: "verified" },
                        order: { created_at: "DESC" },
                        take: 10,
                    })];
            case 1:
                user = _a.sent();
                users = user.map(function (user) {
                    var password = user.password, detail = __rest(user, ["password"]);
                    return detail;
                });
                return [2 /*return*/, res.success("last user", users)];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.lastCustomer = lastCustomer;
// -------------------------------- loan status -------------------------------- //
var get_loans = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status, _a, search, page, limit, start, end, perPage, offset, whereClause, parameters, countQuery, loansQuery, totalResult, _total, loans, total_loan, total_sum, total, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                status = req.params.status;
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = "";
                parameters = [];
                if (status && status.toLowerCase() !== "all") {
                    if (status.toLowerCase() === "due") {
                        //   whereClause += " WHERE LOWER(l.status) = LOWER(?)";
                        whereClause = " WHERE ? >= l.installment_due AND l.status = 'Running'";
                        parameters.push(new Date().toISOString().split("T")[0]);
                    }
                    else if (status.toLowerCase() === "paid") {
                        whereClause += "\n              WHERE (\n                  LOWER(l.status) = 'Paid' OR LOWER(l.status) = 'Bad'\n              )\n          ";
                    }
                    else if (status.toLowerCase() === "running") {
                        whereClause += "\n              WHERE (\n                  LOWER(l.status) = 'Running'\n              )\n          ";
                    }
                    else {
                        whereClause += " WHERE LOWER(l.status) = LOWER(?)";
                        parameters.push(status);
                    }
                }
                if (start && end) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    if (status && status.toLowerCase() === "paid") {
                        whereClause += "l.closed_at BETWEEN ? AND ?";
                    }
                    else if (status && status.toLowerCase() === "due") {
                        whereClause += "l.installment_due BETWEEN ? AND ?";
                    }
                    else {
                        whereClause += "l.created_at BETWEEN ? AND ?";
                    }
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                else if (start) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    if (status && status.toLowerCase() === "paid") {
                        whereClause += "l.closed_at >= ?";
                    }
                    else if (status && status.toLowerCase() === "due") {
                        whereClause += "l.installment_due BETWEEN ? AND ?";
                    }
                    else {
                        whereClause += "l.created_at >= ?";
                    }
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                }
                else if (end) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    if (status && status.toLowerCase() === "paid") {
                        whereClause += "l.closed_at <= ?";
                    }
                    else if (status && status.toLowerCase() === "due") {
                        whereClause += "l.installment_due BETWEEN ? AND ?";
                    }
                    else {
                        whereClause += "l.created_at <= ?";
                    }
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                if (search) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    whereClause += "(LOWER(l.loan_number) LIKE LOWER(?) \n      OR LOWER(u.citizen_id) LIKE LOWER(?) \n      OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)\n      )";
                    parameters.push("%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"));
                }
                parameters.push(perPage, offset);
                countQuery = "\n          SELECT COUNT(*) AS total\n          FROM loan l\n          LEFT JOIN system_users u ON l.user_id = u.id\n          ".concat(whereClause, "\n      ");
                loansQuery = "\n      SELECT\n        l.id, \n        MAX(l.loan_number) as loan_number,\n        MAX(l.reference) as reference,\n        MAX(l.amount) as amount, \n        GREATEST(MAX(l.principle), 0) as remaining, \n        MAX(l.per_installment) as per_installment, \n        MAX(l.per_installment) as per_installment2, \n        MAX(l.total_installment) as total_installment, \n        MAX(l.given_installment) + 1 as given_installment, \n        MAX(l.day_tricker) as day_tricker,\n        MAX(l.status) as status, \n        MAX(l.created_at) as created_at, \n        MAX(l.startDate) as startDate,\n        MAX(l.endDate) as endDate,\n        MAX(l.approved_at) as approved_at,\n        GREATEST(MAX(l.total_paid), 0) as total_paid, \n        GREATEST(MAX(l.principle), 0) as principle, \n        GREATEST(MAX(l.interest), 0) as interest, \n        MAX(l.installment_due) as installment_due,\n        GREATEST(MAX(lp.application_fixed_charge), 0) as application_fixed_charge,         \n        GREATEST(MAX(lp.application_percent_charge), 0) as application_percent_charge,    \n        GREATEST(MAX(lp.fixed_charge), 0) as fixed_charge,                  \n        GREATEST(MAX(lp.fixed_charge2), 0) as fixed_charge2,                 \n        MAX(lc.installment_start) as loan_start,           \n        MAX(lc.installment_end) as loan_end,               \n        MAX(u.citizen_id) as citizen_id,\n        MAX(u.firstname) as firstname, \n        MAX(u.lastname) as lastname,\n        MAX(u.email) as email,\n        MAX(u.username) as username,\n        MAX(u.id) as user_id,\n        GREATEST(MAX(i.interest_paid), 0) as interest_paid, \n        GREATEST(MAX(i.principle_paid), 0) as principle_paid,                \n        GREATEST(MAX(i.principle_installment), 0) as principle_installment,         \n        GREATEST(MAX(i.interest_installment), 0) as interest_installment,\n        GREATEST(MAX(CASE WHEN i.installment = l.given_installment THEN i.paid ELSE 0 END), 0) as paid,\n        GREATEST(MAX(l.per_installment) - GREATEST(MAX(CASE WHEN i.installment = l.given_installment THEN i.paid ELSE 0 END), 0), 0) as outstanding_balance,\n        MIN(l.installment_due) as next_installment,\n        MAX(i.given_at) as last_payment_date,\n        l.closed_at,\n        MAX(l.loan_interest) as interest_rate,\n        CASE \n            WHEN lp.type_interest = 'flatrate' THEN GREATEST(MAX(l.interest), 0)\n            ELSE GREATEST(MAX(l.overdue_balance), 0) \n        END AS overdue_balance,\n        CASE \n            WHEN lp.type_interest = 'flatrate' THEN GREATEST(MAX(l.principle), 0) + GREATEST(MAX(l.interest), 0)\n            ELSE GREATEST(MAX(l.principle), 0) + GREATEST(MAX(l.overdue_balance), 0) \n        END AS total_remaining\n    FROM \n        loan l\n    LEFT JOIN \n        loan_plan lp ON lp.id = l.plan_id\n    LEFT JOIN \n        loan_contract lc ON lc.loan_id = l.id\n    LEFT JOIN \n        system_users u ON l.user_id = u.id\n    LEFT JOIN \n        loan_installment i ON i.loan_id = l.id\n    ".concat(whereClause, "\n    GROUP BY \n        l.id\n    ORDER BY \n        l.created_at DESC\n    LIMIT \n        ? OFFSET ?\n      ");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 2:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(loansQuery, parameters)];
            case 3:
                loans = _b.sent();
                loans.forEach(function (loan) {
                    loan.interest_rate = Number(loan.interest_rate) + Number(loan.application_percent_charge);
                });
                if (loans.length === 0)
                    return [2 /*return*/, res.error("ไม่พบรายการสินเชื่อ")];
                total_loan = loans.length;
                total_sum = loans.reduce(function (acc, loan) {
                    acc.amount += Number(loan.amount || 0);
                    acc.remaining += Number(loan.remaining || 0);
                    acc.overdue_balance += Number(loan.overdue_balance || 0);
                    acc.outstanding_balance += Number(loan.outstanding_balance || 0);
                    acc.per_installment += Number(loan.per_installment || 0);
                    acc.per_installment2 += Number(loan.per_installment2 || 0);
                    acc.paid += Number(loan.paid || 0);
                    acc.total_remaining += Number(loan.total_remaining || 0);
                    return acc;
                }, {
                    amount: 0,
                    remaining: 0,
                    overdue_balance: 0,
                    outstanding_balance: 0,
                    per_installment: 0,
                    per_installment2: 0,
                    paid: 0,
                    total_remaining: 0,
                });
                total = __assign({ total_loan: total_loan }, total_sum);
                return [2 /*return*/, res.success("Get Loan", { data: loans, total: total }, _total)];
            case 4:
                err_4 = _b.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.get_loans = get_loans;
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
var get_loanDetail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _loanId, query, result, loan, application_form, updatedApplicationForm, fileManagers, _loop_1, _i, _a, _b, key, value, error_1, detailLoan, err_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                _loanId = parseInt(id) || -1;
                query = "\n        SELECT l.*, lp.name as planname, lp.type_interest,\n        u.titlename, u.firstname, u.lastname, u.citizen_id, u.birthdate, u.address,\n        u.houseno, u.villageno, u.lane, u.road, u.subdistrict, u.district, u.province, u.zipcode,\n        u.job_company_name, u.job_houseno, u.job_villageno, u.job_lane, u.job_road, u.job_subdistrict,\n        u.job_district, u.job_province, u.job_zipcode\n        FROM loan l\n        LEFT JOIN loan_plan lp ON lp.id = l.plan_id\n        LEFT JOIN system_users u ON l.user_id = u.id\n        WHERE l.id = ? \n        ";
                _c.label = 1;
            case 1:
                _c.trys.push([1, 9, , 10]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, [_loanId])];
            case 2:
                result = _c.sent();
                if (result.length === 0)
                    return [2 /*return*/, res.error("Loan not found")];
                loan = result[0];
                application_form = {};
                updatedApplicationForm = {};
                if (!loan.application_form) return [3 /*break*/, 7];
                _c.label = 3;
            case 3:
                _c.trys.push([3, 5, , 6]);
                application_form = JSON.parse(loan.application_form);
                return [4 /*yield*/, (0, data_source_1.orm)(File_Manager_1.File_Manager).find({
                        where: { ref_id: loan.id },
                    })];
            case 4:
                fileManagers = _c.sent();
                _loop_1 = function (key, value) {
                    if (typeof value === "object" &&
                        "ref_id" in value &&
                        "name" in value) {
                        var fileReference_1 = value;
                        var fileManager = fileManagers.find(function (fm) { return fm.name === fileReference_1.name; });
                        if (fileManager) {
                            updatedApplicationForm[key] = __assign(__assign({}, fileReference_1), { base64: fileManager.base64 });
                        }
                        else {
                            updatedApplicationForm[key] = fileReference_1;
                        }
                    }
                    else {
                        updatedApplicationForm[key] = value;
                    }
                };
                for (_i = 0, _a = Object.entries(application_form); _i < _a.length; _i++) {
                    _b = _a[_i], key = _b[0], value = _b[1];
                    _loop_1(key, value);
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _c.sent();
                console.log("error", error_1);
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                updatedApplicationForm = {};
                _c.label = 8;
            case 8:
                detailLoan = __assign(__assign({}, loan), { profit: Number(loan.receivable) - Number(loan.amount), application_form: updatedApplicationForm });
                return [2 /*return*/, res.success("Get Loan Detail", detailLoan)];
            case 9:
                err_5 = _c.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.get_loanDetail = get_loanDetail;
var edit_loanDetail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _loanId, _a, guarantee, appForm, loan, currentForm, applicationForms, _i, applicationForms_1, field, fieldValue, base64Data, allowedExtensions, processedImage, fileManager, newFileManager, updatedFileManagers, response, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _loanId = parseInt(id) || -1;
                _a = req.body, guarantee = _a.guarantee, appForm = _a.appForm;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 17, , 18]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({ where: { id: _loanId } })];
            case 2:
                loan = _b.sent();
                if (!loan)
                    return [2 /*return*/, res.error("Loan not found")];
                if (guarantee) {
                    loan.guarantee = guarantee;
                }
                if (!appForm) return [3 /*break*/, 14];
                currentForm = JSON.parse(loan.application_form) || {};
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).find({
                        where: { plan_id: loan.plan_id },
                        order: { index: "ASC" },
                    })];
            case 3:
                applicationForms = _b.sent();
                _i = 0, applicationForms_1 = applicationForms;
                _b.label = 4;
            case 4:
                if (!(_i < applicationForms_1.length)) return [3 /*break*/, 13];
                field = applicationForms_1[_i];
                fieldValue = appForm[field.field_name];
                if (!(field.type.toLowerCase() === "file" && fieldValue)) return [3 /*break*/, 11];
                base64Data = void 0;
                if (typeof fieldValue === "string" &&
                    fieldValue.startsWith("data:")) {
                    base64Data = fieldValue;
                }
                else if (typeof fieldValue === "object" && fieldValue.base64) {
                    base64Data = fieldValue.base64;
                }
                else {
                    return [2 /*return*/, res.error("Invalid file data for ".concat(field.label))];
                }
                allowedExtensions = field.extensions;
                if (!(0, index_1.validateMimetype)(base64Data, allowedExtensions)) {
                    return [2 /*return*/, res.error("\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A ".concat(field.label, ". \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E44\u0E1F\u0E25\u0E4C\u0E17\u0E35\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15: ").concat(allowedExtensions.join(", ")))];
                }
                return [4 /*yield*/, (0, Utils_1.reSizeBase64)(base64Data)];
            case 5:
                processedImage = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(File_Manager_1.File_Manager).findOne({
                        where: { ref_id: loan.id, name: field.field_name },
                    })];
            case 6:
                fileManager = _b.sent();
                if (!fileManager) return [3 /*break*/, 8];
                fileManager.base64 = processedImage;
                return [4 /*yield*/, (0, data_source_1.orm)(File_Manager_1.File_Manager).save(fileManager)];
            case 7:
                _b.sent();
                return [3 /*break*/, 10];
            case 8:
                newFileManager = new File_Manager_1.File_Manager();
                newFileManager.ref_id = loan.id;
                newFileManager.folder_id = "loan_".concat(loan.id);
                newFileManager.name = field.field_name;
                newFileManager.base64 = processedImage;
                return [4 /*yield*/, (0, data_source_1.orm)(File_Manager_1.File_Manager).save(newFileManager)];
            case 9:
                _b.sent();
                _b.label = 10;
            case 10: return [3 /*break*/, 12];
            case 11:
                if (field.type.toLowerCase() !== "file") {
                    currentForm[field.field_name] =
                        fieldValue || currentForm[field.field_name];
                }
                _b.label = 12;
            case 12:
                _i++;
                return [3 /*break*/, 4];
            case 13:
                loan.application_form = JSON.stringify(currentForm);
                _b.label = 14;
            case 14: return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
            case 15:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(File_Manager_1.File_Manager).find({
                        where: { ref_id: loan.id },
                    })];
            case 16:
                updatedFileManagers = _b.sent();
                response = __assign(__assign({}, loan), { fileManagers: updatedFileManagers });
                return [2 /*return*/, res.success("Update Loan Detail", response)];
            case 17:
                err_6 = _b.sent();
                console.log(err_6);
                return [2 /*return*/, res.error(err_6.detail || err_6.routine)];
            case 18: return [2 /*return*/];
        }
    });
}); };
exports.edit_loanDetail = edit_loanDetail;
var get_installments = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _loanId, _a, page, limit, perPage, offset, loan_2, loanPlan, totalInstallments, installments, selectedRate, interestRate, loan_summary, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _loanId = parseInt(id) || -1;
                _a = req.query, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({ where: { id: _loanId } })];
            case 2:
                loan_2 = _b.sent();
                if (!loan_2)
                    return [2 /*return*/, res.error("Loan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({
                        where: { id: loan_2.plan_id },
                    })];
            case 3:
                loanPlan = _b.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error("Loan Plan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).count({
                        where: { loan_id: loan_2.id },
                    })];
            case 4:
                totalInstallments = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).find({
                        where: { loan_id: _loanId },
                        order: { id: "asc" },
                        take: perPage,
                        skip: offset,
                    })];
            case 5:
                installments = _b.sent();
                selectedRate = loanPlan.rate.find(function (r) { return Number(r.installment) === loan_2.total_installment; });
                interestRate = Number(loan_2.loan_interest) + Number(loanPlan.application_percent_charge);
                loan_summary = {
                    loan_number: loan_2.loan_number,
                    plan: loanPlan.name,
                    amount: Number(loan_2.amount),
                    per_installment: Number(loan_2.per_installment),
                    total_installment: Number(loan_2.total_installment),
                    given_installment: Number(loan_2.given_installment) + 1,
                    receivable: Number(loan_2.receivable),
                    delay_value: Number(loanPlan.delay_value),
                    total_paid: Number(loan_2.total_paid),
                    remaining: Number(loan_2.remaining),
                    interest: Number(loan_2.interest),
                    installment_start: loan_2.installment_start,
                    installment_due: loan_2.installment_due,
                    interestRate: interestRate,
                    overdue_balance: Number(loan_2.overdue_balance),
                    status: loan_2.status,
                    pay_days: 30,
                    delay_days: loanPlan.delay_days,
                    delay_charge: loanPlan.delay_charge,
                    approved_at: loan_2.approved_at,
                    startDate: loan_2.startDate,
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
                return [2 /*return*/, res.success("Get installment LoanId", { loan_summary: loan_summary, installment: installments }, totalInstallments)];
            case 6:
                err_7 = _b.sent();
                console.log(err_7);
                return [2 /*return*/, res.error(err_7.detail || err_7.message)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.get_installments = get_installments;
// --------------------------- approve & rejecy loan --------------------------- //
var approveLoan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reference, obj, loans, _loop_2, _i, loans_1, loan, state_1, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reference = req.params.reference;
                obj = __rest(req.body, []);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).find({
                        where: { reference: reference, status: enum_1.loan_status.Pending },
                    })];
            case 2:
                loans = _a.sent();
                if (loans.length === 0)
                    return [2 /*return*/, res.error("Loan not found")];
                _loop_2 = function (loan) {
                    var user, loanPlan, loanContract, selectedInstallment, selectedRate, interestRate, applicationAnnualRate, beforeRemaining, nextMonthDate, data, _b, delay_days, delay_charge, principle, interest, interest_due, paid_principle, paid_interest, days, daysInYear, principle_remaining, interest_remaining, installment, props, valueInstallment, firstInstallment, nextInstallment, applicationFee, _installment, _c, name, formattedInstallmentDate;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan.user_id } })];
                            case 1:
                                user = _d.sent();
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({
                                        where: { id: loan.plan_id },
                                    })];
                            case 2:
                                loanPlan = _d.sent();
                                if (!loanPlan)
                                    return [2 /*return*/, { value: res.error("Plan not found") }];
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_contract_1.LoanContract).findOne({
                                        where: { loan_id: loan.id },
                                    })];
                            case 3:
                                loanContract = _d.sent();
                                selectedInstallment = parseInt(loan.total_installment);
                                selectedRate = loanPlan.rate.find(function (r) { return Number(r.installment) === selectedInstallment; });
                                interestRate = Number(loan.loan_interest) +
                                    Number(loanPlan.application_percent_charge);
                                applicationAnnualRate = Number(loanPlan.application_percent_charge) / 100;
                                beforeRemaining = Number(loan.remaining);
                                loan.status = enum_1.loan_status.Running;
                                loan.approved_at = loan.approved_at ? loan.approved_at : new Date();
                                loan.admin_approve = "".concat(req.user.titlename, " ").concat(req.user.firstname, " ").concat(req.user.lastname);
                                loan.installment_start = loan.installment_start
                                    ? loan.installment_start
                                    : new Date();
                                if (!loan.installment_due) {
                                    nextMonthDate = new Date(loan.installment_start);
                                    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
                                    loan.installment_due = nextMonthDate;
                                }
                                loan.startDate = loan.startDate ? loan.startDate : loan.installment_due;
                                if (!loan.endDate) {
                                    loan.endDate = new Date();
                                    loan.endDate.setMonth(loan.endDate.getMonth() + Number(selectedRate.installment));
                                }
                                loan.last_alert_date = loan.installment_due;
                                loan.guarantee = obj.guarantee;
                                data = new loan_contract_1.LoanContract();
                                data.user_id = loan.user_id;
                                data.loan_id = loan.id;
                                data.installment_start = loan.startDate;
                                data.installment_end = loan.endDate;
                                data.stamp =
                                    loanPlan.stamp == 0 ? 0 : Number(loan.amount) / Number(loanPlan.stamp);
                                data.document = Number(loanPlan.document);
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_contract_1.LoanContract).save(data)];
                            case 4:
                                _d.sent();
                                return [4 /*yield*/, loan.createLog(req, "approve", "loan", {
                                        status: loan.status,
                                        approve: loan.approved_at,
                                    })];
                            case 5:
                                _d.sent();
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
                            case 6:
                                _d.sent();
                                _b = (0, calurate_1.paymentCalculator)({
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
                                }), delay_days = _b.delay_days, delay_charge = _b.delay_charge, principle = _b.principle, interest = _b.interest, interest_due = _b.interest_due, paid_principle = _b.paid_principle, paid_interest = _b.paid_interest, days = _b.days, daysInYear = _b.daysInYear, principle_remaining = _b.principle_remaining, interest_remaining = _b.interest_remaining, installment = _b.installment, props = __rest(_b, ["delay_days", "delay_charge", "principle", "interest", "interest_due", "paid_principle", "paid_interest", "days", "daysInYear", "principle_remaining", "interest_remaining", "installment"]);
                                return [4 /*yield*/, (0, calurate_1.installmentRemaining)({
                                        loan_id: loan.id,
                                        amount: loan.amount,
                                        rate: interestRate,
                                        installment: loan.total_installment,
                                        start: loan.startDate,
                                        created: loan.approved_at,
                                        given_at: Number(loan.given_installment),
                                        type_interest: loanPlan.type_interest
                                    })];
                            case 7:
                                valueInstallment = (_d.sent()).installment;
                                firstInstallment = valueInstallment[0], nextInstallment = valueInstallment[1];
                                applicationFee = (beforeRemaining * (applicationAnnualRate * days)) / daysInYear;
                                _installment = new loan_installment_1.Installment();
                                _c = _installment;
                                return [4 /*yield*/, (0, index_1.generateReceiptNumber)(loanPlan.id)];
                            case 8:
                                _c.receipt_number = _d.sent();
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
                                _installment.paid_by = "".concat(user.firstname, " - ").concat(user.lastname);
                                _installment.interest_due = firstInstallment.interest;
                                _installment.total_interest = Number(loan.interest) - Number(firstInstallment.interest);
                                if (nextInstallment) {
                                    _installment.principle_next_due = nextInstallment.principle;
                                    _installment.interest_next_due = nextInstallment.interest;
                                    _installment.total_amount_next_due = nextInstallment.remaining;
                                    _installment.installment_next_due = nextInstallment.date;
                                }
                                _installment.transfer_payment = 0;
                                if (applicationFee < 0) {
                                    _installment.application_charge = 0;
                                }
                                else {
                                    _installment.application_charge =
                                        Math.round((applicationFee + Number.EPSILON) * 100) / 100;
                                }
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).save(_installment)];
                            case 9:
                                _d.sent();
                                name = "".concat(user.firstname, " ").concat(user.lastname);
                                formattedInstallmentDate = new Intl.DateTimeFormat("th-TH", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                }).format(new Date());
                                return [4 /*yield*/, (0, module_1.Line_Approve)(user.line_id, loanPlan.name, loan.loan_number, (0, index_1.toTHB)(loan.amount), "".concat(loan.total_installment.toString(), " \u0E07\u0E27\u0E14"), name, formattedInstallmentDate)];
                            case 10:
                                _d.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, loans_1 = loans;
                _a.label = 3;
            case 3:
                if (!(_i < loans_1.length)) return [3 /*break*/, 6];
                loan = loans_1[_i];
                return [5 /*yield**/, _loop_2(loan)];
            case 4:
                state_1 = _a.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                _a.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, res.success("Loans approved successfully", { loans: loans })];
            case 7:
                err_8 = _a.sent();
                console.log(err_8);
                return [2 /*return*/, res.error(err_8.detail || err_8.routine)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.approveLoan = approveLoan;
var rejectLoan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reference, reject_reason, loans, _i, loans_2, loan, user, loanPlan, name, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reference = req.params.reference;
                reject_reason = req.body.reject_reason;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).find({
                        where: { reference: reference, status: enum_1.loan_status.Pending },
                    })];
            case 2:
                loans = _a.sent();
                if (loans.length === 0)
                    return [2 /*return*/, res.error("Loan not found")];
                _i = 0, loans_2 = loans;
                _a.label = 3;
            case 3:
                if (!(_i < loans_2.length)) return [3 /*break*/, 10];
                loan = loans_2[_i];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan.user_id } })];
            case 4:
                user = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({
                        where: { id: loan.plan_id },
                    })];
            case 5:
                loanPlan = _a.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error("Plan not found")];
                loan.status = enum_1.loan_status.Rejected;
                loan.admin_approve = req.user.username;
                loan.reject_reason = reject_reason;
                return [4 /*yield*/, loan.createLog(req, "reject", "loan", {
                        status: loan.status,
                        reject_reason: loan.reject_reason,
                    })];
            case 6:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
            case 7:
                _a.sent();
                name = "".concat(user.firstname, " ").concat(user.lastname);
                return [4 /*yield*/, (0, module_1.Line_Reject)(user.line_id, loanPlan.name, (0, index_1.toTHB)(loan.amount), name, reject_reason)];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10: return [2 /*return*/, res.success("Loans approved successfully", { loans: loans })];
            case 11:
                err_9 = _a.sent();
                console.log(err_9);
                return [2 /*return*/, res.error(err_9.detail || err_9.routine)];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.rejectLoan = rejectLoan;
var badLoan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _loanId, _a, created_at, updated_at, deleted_at, obj, loan, loanPlan, err_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _loanId = parseInt(id) || -1;
                _a = req.body, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["created_at", "updated_at", "deleted_at"]);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({ where: { id: _loanId } })];
            case 2:
                loan = _b.sent();
                if (!loan)
                    return [2 /*return*/, res.error("Loan not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({
                        where: { id: loan.plan_id },
                    })];
            case 3:
                loanPlan = _b.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error("Plan not found")];
                // if (!obj.admin_feedback) return res.error('Please feedback')
                loan.status = enum_1.loan_status.Bad;
                loan.closed_at = new Date();
                // loan.admin_feedback = obj.admin_feedback;
                return [4 /*yield*/, loan.createLog(req, "update", "loan", {
                        status: loan.status,
                        feedback: loan.admin_feedback,
                    })];
            case 4:
                // loan.admin_feedback = obj.admin_feedback;
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
            case 5:
                _b.sent();
                return [2 /*return*/, res.success("Loan Bad successfully", loan)];
            case 6:
                err_10 = _b.sent();
                console.log(err_10);
                return [2 /*return*/, res.error(err_10.detail || err_10.routine)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.badLoan = badLoan;
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
var removeLoan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var reference, loans_3, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reference = req.params.reference;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).find({ where: { reference: reference } })];
            case 2:
                loans_3 = _a.sent();
                if (!loans_3.length)
                    return [2 /*return*/, res.error("ไม่พบสินเชื่อที่มี reference นี้")];
                return [4 /*yield*/, data_source_1.AppDataSource.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                        var _i, loans_4, loan, loanContracts, installments, taxes;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _i = 0, loans_4 = loans_3;
                                    _a.label = 1;
                                case 1:
                                    if (!(_i < loans_4.length)) return [3 /*break*/, 10];
                                    loan = loans_4[_i];
                                    return [4 /*yield*/, transactionManager.find(loan_contract_1.LoanContract, {
                                            where: { loan_id: loan.id },
                                        })];
                                case 2:
                                    loanContracts = _a.sent();
                                    return [4 /*yield*/, transactionManager.find(loan_installment_1.Installment, {
                                            where: { loan_id: loan.id },
                                        })];
                                case 3:
                                    installments = _a.sent();
                                    return [4 /*yield*/, transactionManager.find(tax_1.Tax, {
                                            where: { loan_id: loan.id },
                                        })];
                                case 4:
                                    taxes = _a.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_contract_1.LoanContract, loanContracts)];
                                case 5:
                                    _a.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_installment_1.Installment, installments)];
                                case 6:
                                    _a.sent();
                                    return [4 /*yield*/, transactionManager.remove(tax_1.Tax, taxes)];
                                case 7:
                                    _a.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_1.Loan, loan)];
                                case 8:
                                    _a.sent();
                                    _a.label = 9;
                                case 9:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 10: return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                return [2 /*return*/, res.success("ลบสินเชื่อและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว")];
            case 4:
                err_11 = _a.sent();
                console.log(err_11);
                return [2 /*return*/, res.error(err_11.detail || err_11.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.removeLoan = removeLoan;
// ----------------------------- สมัครสินเชื่อโดย admin ----------------------------- //
var takeLoan_admin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, created_at, updated_at, deleted_at, obj, _planId, user, loanPlan_1, selectedInstallment_1, selectedRate_1, interestRate_1, applicationForms_3, _i, applicationForms_2, field, fieldValue, totalAmount, loanParts, createLoan, reference, loan_document_max, i, err_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at"]);
                _planId = parseInt(obj.plan_id) || -1;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: obj.user_id } })];
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
                if (Number(obj.amount) < Number(loanPlan_1.minimum_amount) ||
                    Number(obj.amount) > Number(loanPlan_1.maximum_amount))
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
                applicationForms_3 = _b.sent();
                for (_i = 0, applicationForms_2 = applicationForms_3; _i < applicationForms_2.length; _i++) {
                    field = applicationForms_2[_i];
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
                    var interestRateToUse, addInterrest, _a, nor_pay, principle_remaining, _b, total_interest, total_receive, valueInstallment, totalAmount, __createDate, __startDate, __endDate, loan, _c, formData, fileUploads, _i, applicationForms_4, field, fieldValue, _d, allowedExtensions, processedImage, fileManager, _e, fileUploads_1, file, data;
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
                                    installment_start: obj.createDate,
                                    payment_date: obj.startDate,
                                }), nor_pay = _a.nor_pay, principle_remaining = _a.principle_remaining;
                                return [4 /*yield*/, (0, calurate_1.installmentRemaining)({
                                        type_interest: loanPlan_1.type_interest,
                                        amount: amount,
                                        rate: interestRateToUse,
                                        installment: selectedRate_1.installment,
                                        start: obj.startDate,
                                        created: obj.createDate,
                                        given_at: 0,
                                    })];
                            case 1:
                                _b = _f.sent(), total_interest = _b.total_interest, total_receive = _b.total_receive, valueInstallment = _b.installment;
                                totalAmount = Number(amount);
                                __createDate = (obj === null || obj === void 0 ? void 0 : obj.createDate) ? new Date(obj.createDate) : null;
                                __startDate = (obj === null || obj === void 0 ? void 0 : obj.startDate) ? new Date(obj.startDate) : null;
                                __endDate = new Date(__startDate);
                                __endDate.setMonth(__endDate.getMonth() + Number(selectedRate_1.installment - 1));
                                loan = new loan_1.Loan();
                                _c = loan;
                                return [4 /*yield*/, (0, index_1.generateLoanNumber)(_planId)];
                            case 2:
                                _c.loan_number = _f.sent();
                                loan.startDate = __startDate;
                                loan.endDate = __endDate;
                                loan.user_id = obj.user_id;
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
                                loan.approved_at = __createDate;
                                loan.installment_start = __createDate;
                                loan.installment_due = __startDate;
                                loan.status = enum_1.loan_status.Pending;
                                loan.reference = reference;
                                // loan.admin_approve = req.user.username;
                                loan.last_alert_date = __startDate;
                                loan.loan_ducument = loan_ducument;
                                loan.loan_ducument_max = loan_ducument_max;
                                loan.guarantee = obj.guarantee;
                                loan.loan_interest = interestRateToUse;
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
                            case 3:
                                _f.sent();
                                formData = {};
                                fileUploads = [];
                                _i = 0, applicationForms_4 = applicationForms_3;
                                _f.label = 4;
                            case 4:
                                if (!(_i < applicationForms_4.length)) return [3 /*break*/, 11];
                                field = applicationForms_4[_i];
                                fieldValue = obj.appForm[field.field_name];
                                _d = field.type.toLowerCase();
                                switch (_d) {
                                    case "file": return [3 /*break*/, 5];
                                    case "select": return [3 /*break*/, 8];
                                }
                                return [3 /*break*/, 9];
                            case 5:
                                if (!fieldValue) return [3 /*break*/, 7];
                                allowedExtensions = field.extensions;
                                if (!(0, index_1.validateMimetype)(fieldValue, allowedExtensions)) {
                                    return [2 /*return*/, res.error("\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E44\u0E1F\u0E25\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A ".concat(field.label, ". \u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E44\u0E1F\u0E25\u0E4C\u0E17\u0E35\u0E48\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15: ").concat(allowedExtensions.join(", ")))];
                                }
                                return [4 /*yield*/, (0, Utils_1.reSizeBase64)(fieldValue)];
                            case 6:
                                processedImage = _f.sent();
                                fileManager = new File_Manager_1.File_Manager();
                                fileManager.ref_id = loan.id;
                                fileManager.folder_id = "loan_".concat(loan.id);
                                fileManager.name = "".concat(field.field_name);
                                fileManager.base64 = processedImage;
                                fileUploads.push(fileManager);
                                formData[field.field_name] = {
                                    ref_id: fileManager.ref_id,
                                    name: fileManager.name,
                                };
                                _f.label = 7;
                            case 7: return [3 /*break*/, 10];
                            case 8:
                                if (Array.isArray(field.options) &&
                                    field.options.includes(fieldValue)) {
                                    formData[field.field_name] = fieldValue;
                                }
                                else {
                                    return [2 /*return*/, res.error("Invalid option for ".concat(field.field_name))];
                                }
                                return [3 /*break*/, 10];
                            case 9:
                                formData[field.field_name] = fieldValue;
                                _f.label = 10;
                            case 10:
                                _i++;
                                return [3 /*break*/, 4];
                            case 11:
                                loan.application_form = JSON.stringify(formData);
                                return [4 /*yield*/, loan.createLog(req, "create", "loan", obj)];
                            case 12:
                                _f.sent();
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan)];
                            case 13:
                                _f.sent();
                                _e = 0, fileUploads_1 = fileUploads;
                                _f.label = 14;
                            case 14:
                                if (!(_e < fileUploads_1.length)) return [3 /*break*/, 17];
                                file = fileUploads_1[_e];
                                return [4 /*yield*/, (0, data_source_1.orm)(File_Manager_1.File_Manager).save(file)];
                            case 15:
                                _f.sent();
                                _f.label = 16;
                            case 16:
                                _e++;
                                return [3 /*break*/, 14];
                            case 17:
                                data = new loan_contract_1.LoanContract();
                                data.user_id = loan.user_id;
                                data.loan_id = loan.id;
                                data.installment_start = loan.startDate;
                                data.installment_end = loan.endDate;
                                data.stamp =
                                    loanPlan_1.stamp == 0 ? 0 : Number(loan.amount) / Number(loanPlan_1.stamp);
                                data.document = Number(loanPlan_1.document);
                                return [4 /*yield*/, (0, data_source_1.orm)(loan_contract_1.LoanContract).save(data)];
                            case 18:
                                _f.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                reference = (0, index_1.generateReference)(new Date(), obj.user_id);
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
            return [2 /*return*/, res.success("บันทึกการขอสินเชื่อสำเร็จ")];
            case 9:
                err_12 = _b.sent();
                console.log(err_12);
                return [2 /*return*/, res.error(err_12.detail || err_12.routine)];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.takeLoan_admin = takeLoan_admin;
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
var payment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, created_at, updated_at, deleted_at, obj, _loanId, loan_3, plan_1, user_1, paidAmount, paidDate_1, interestRate_2, applicationAnnualRate, beforeRemaining, calculator, delay_days_1, delay_charge, principle, interest, paid_principle, paid_interest_1, days, daysInYear, total_principle, principle_remaining, interest_remaining_1, installment_1, mini_pay, props, applicationFee_1, _installment, beforeInterest_1, nextDue, nextDue, tax, _nextStart, _nextDue, cal, multiplier, calculator_1, _installment_1, delay_days_2, delay_charge_1, principle_1, interest_1, paid_principle_1, paid_interest_2, interest_due, principle_remaining_1, interest_remaining_2, installment_2, props_1, _b, orders, totalAmount, sendTotal, formattedInstallmentDate, err_13;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at"]);
                _loanId = parseInt(obj.loan_id) || -1;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 14, , 15]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({
                        where: {
                            id: _loanId,
                            approved_at: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                            status: (0, typeorm_1.Not)(enum_1.loan_status.Pending),
                        },
                    })];
            case 2:
                loan_3 = _c.sent();
                if (!loan_3)
                    return [2 /*return*/, res.error("Loan not found")];
                else if (loan_3.status === enum_1.loan_status.Paid)
                    return [2 /*return*/, res.error("รายการนี้ชำระสินเชื่อครบจำนวนแล้ว")];
                else if (loan_3.status === enum_1.loan_status.Rejected)
                    return [2 /*return*/, res.error("รายการนี้ถูกปฎิเศษ")];
                else if (loan_3.status === enum_1.loan_status.Bad)
                    return [2 /*return*/, res.error("รายการนี้ถูกปรับเป็นหนี้สูญ")];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: loan_3.plan_id } })];
            case 3:
                plan_1 = _c.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan_3.user_id } })];
            case 4:
                user_1 = _c.sent();
                if (!user_1)
                    return [2 /*return*/, res.error("ลูกหนี้ไม่มีอยู่ในระบบ")];
                paidAmount = Number(obj.paidAmount);
                if (paidAmount <= 0)
                    return [2 /*return*/, res.error("ยอดชำระต้องไม่น้อยกว่า 0")];
                paidDate_1 = obj.paymentDate ? obj.paymentDate : null;
                interestRate_2 = Number(loan_3.loan_interest) + Number(plan_1.application_percent_charge);
                applicationAnnualRate = Number(plan_1.application_percent_charge) / 100;
                beforeRemaining = Number(loan_3.remaining);
                calculator = void 0;
                if (plan_1.type_interest === "flatrate") {
                    calculator = (0, calurate_1.flatrateCalculator)({
                        amount: loan_3.amount,
                        remaining: loan_3.remaining,
                        interest_rate: interestRate_2,
                        total_installment: loan_3.total_installment,
                        installment_start: loan_3.installment_start,
                        payment_date: paidDate_1,
                        pay: paidAmount,
                        interest_stack: loan_3.overdue_balance,
                        installment: Number(loan_3.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                else {
                    calculator = (0, calurate_1.effectiverateCalculator)({
                        amount: loan_3.amount,
                        remaining: loan_3.remaining,
                        interest_rate: interestRate_2,
                        total_installment: loan_3.total_installment,
                        installment_start: loan_3.installment_start,
                        payment_date: paidDate_1,
                        pay: paidAmount,
                        interest_stack: loan_3.overdue_balance,
                        installment: Number(loan_3.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                delay_days_1 = calculator.delay_days, delay_charge = calculator.delay_charge, principle = calculator.principle, interest = calculator.interest, paid_principle = calculator.paid_principle, paid_interest_1 = calculator.paid_interest, days = calculator.days, daysInYear = calculator.daysInYear, total_principle = calculator.total_principle, principle_remaining = calculator.principle_remaining, interest_remaining_1 = calculator.interest_remaining, installment_1 = calculator.installment, mini_pay = calculator.mini_pay, props = __rest(calculator, ["delay_days", "delay_charge", "principle", "interest", "paid_principle", "paid_interest", "days", "daysInYear", "total_principle", "principle_remaining", "interest_remaining", "installment", "mini_pay"]);
                if (calculator.principle_remaining < 0)
                    return [2 /*return*/, res.error("กรุณาชำระจำนวนที่ถูกต้อง และ ไม่เกินยอดคงเหลือ")];
                if (plan_1.type_interest === 'flatrate') {
                    if (loan_3.given_installment + 1 < loan_3.total_installment &&
                        paidAmount > Number(loan_3.per_installment) +
                            Number(loan_3.overdue_balance) +
                            Number(calculator.delay_charge)) {
                        return [2 /*return*/, res.error('ไม่สามารถชำระเกินยอดที่กำหนดได้')];
                    }
                }
                if (paidAmount < calculator.mini_pay)
                    return [2 /*return*/, res.error("ไม่สามารถชำระน้อยกว่ายอดขั้นต่ำได้")];
                applicationFee_1 = (beforeRemaining * (applicationAnnualRate * calculator.days)) / calculator.daysInYear;
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).findOne({
                        where: { isPaid: false, loan_id: loan_3.id },
                        order: { created_at: "DESC" },
                    })];
            case 5:
                _installment = _c.sent();
                if (!_installment)
                    _installment = new loan_installment_1.Installment();
                beforeInterest_1 = Number(_installment.interest_installment || 0);
                // อัพเดทข้อมูล installment
                _installment.receipt_number = _installment.receipt_number;
                _installment.plan_id = plan_1.id;
                _installment.user_id = loan_3.user_id;
                _installment.loan_id = loan_3.id;
                _installment.loan_number = loan_3.loan_number;
                _installment.installment_date = new Date(loan_3.installment_due);
                _installment.start_date = loan_3.installment_start;
                _installment.per_installment = loan_3.per_installment;
                _installment.amount = loan_3.amount;
                _installment.remaining = calculator.principle_remaining;
                _installment.principle = Number(loan_3.principle) - calculator.paid_principle;
                _installment.overdue_balance = calculator.interest_remaining;
                _installment.outstanding_balance = calculator.principle_remaining;
                _installment.installment = calculator.installment;
                _installment.total_installment = loan_3.total_installment;
                _installment.isPaid = true;
                _installment.given_at = obj.paymentDate ? new Date(obj.paymentDate) : new Date();
                _installment.paid = paidAmount;
                _installment.delay_days = calculator.delay_days > 0 ? calculator.delay_days : 0;
                _installment.principle_paid = calculator.paid_principle;
                _installment.interest_paid = calculator.paid_interest;
                _installment.delay_charge_paid = calculator.delay_charge;
                _installment.paid_by = "".concat(user_1.firstname, " - ").concat(user_1.lastname);
                _installment.per_installment = loan_3.per_installment;
                _installment.principle_installment = calculator.principle;
                _installment.interest_installment = calculator.interest;
                _installment.interest_due = plan_1.type_interest === "flatrate" ? 0 : calculator.interest_due;
                if (Number(loan_3.given_installment + 1) === Number(loan_3.total_installment) && Number(loan_3.principle) - calculator.paid_principle > 0) {
                    nextDue = new Date(loan_3.installment_due);
                    nextDue.setMonth(nextDue.getMonth() + 1);
                    _installment.principle_next_due = Number(loan_3.principle) - calculator.paid_principle;
                    _installment.interest_next_due = null;
                    _installment.total_amount_next_due = Number(loan_3.principle) - calculator.paid_principle;
                    _installment.installment_next_due = nextDue;
                }
                else if (Number(loan_3.given_installment + 1) > Number(loan_3.total_installment) && Number(loan_3.principle) - calculator.paid_principle > 0) {
                    nextDue = new Date(loan_3.installment_due);
                    nextDue.setMonth(nextDue.getMonth() + 1);
                    _installment.principle_next_due = Number(loan_3.principle) - calculator.paid_principle;
                    _installment.interest_next_due = calculator.paid_interest;
                    _installment.total_amount_next_due = Number(loan_3.principle) - calculator.paid_principle;
                    _installment.installment_next_due = nextDue;
                }
                // บันทึกประเภทการชำระ
                if (obj.type === "cash") {
                    _installment.type = "เงินสด";
                    _installment.cash = paidAmount;
                }
                else {
                    _installment.transfer_payment = paidAmount;
                }
                // บันทึกค่าธรรมเนียม
                if (applicationFee_1 < 0) {
                    _installment.application_charge = 0;
                }
                else {
                    _installment.application_charge =
                        Math.round((applicationFee_1 + Number.EPSILON) * 100) / 100;
                }
                tax = new tax_1.Tax();
                tax.user_id = loan_3.user_id;
                tax.loan_id = loan_3.id;
                tax.loan_number = loan_3.loan_number;
                tax.principle = calculator.paid_principle;
                tax.interest = calculator.paid_interest;
                tax.interest_rate = loan_3.loan_interest;
                tax.installment_id = _installment.id;
                tax.tax_business = Math.round(((calculator.paid_interest * 3) / 100 + Number.EPSILON) * 100) / 100;
                tax.tax_local = Math.round(((((calculator.paid_interest * 3) / 100) * 10) / 100 + Number.EPSILON) * 100) / 100;
                tax.total_tax = Math.round((tax.tax_business + tax.tax_local + Number.EPSILON) * 100) / 100;
                _nextStart = new Date(loan_3.installment_due);
                _nextDue = new Date(loan_3.installment_due);
                _nextDue.setMonth(_nextDue.getMonth() + 1);
                loan_3.installment_start = _nextStart;
                loan_3.installment_due = _nextDue;
                loan_3.last_alert_date = _nextDue;
                loan_3.given_installment = calculator.installment;
                // }
                // อัพเดทข้อมูลสินเชื่อ
                if (plan_1.type_interest === 'flatrate') {
                    loan_3.principle = Number(loan_3.principle) - calculator.paid_principle;
                }
                else {
                    loan_3.principle = calculator.principle_remaining;
                }
                loan_3.remaining = calculator.principle_remaining;
                loan_3.interest = Number(loan_3.interest) - calculator.paid_interest;
                loan_3.overdue_balance = calculator.interest_remaining;
                loan_3.total_paid = Number(loan_3.total_paid) + Number(paidAmount);
                loan_3.charge_per_installment = calculator.delay_charge;
                // ตรวจสอบการชำระครบ
                if (calculator.principle_remaining <= 0) {
                    loan_3.status = enum_1.loan_status.Paid;
                    loan_3.closed_at = paidDate_1;
                    if (plan_1.type_interest === "flatrate") {
                        cal = Number(loan_3.total_installment) - (Number(loan_3.given_installment) - 1);
                        multiplier = cal > 0 ? cal : 1;
                        _installment.interest_paid = calculator.paid_interest * multiplier;
                    }
                }
                // บันทึก installment และ tax
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).save(_installment)];
            case 6:
                // บันทึก installment และ tax
                _c.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(tax_1.Tax).save(tax)];
            case 7:
                _c.sent();
                if (!(loan_3.given_installment >= loan_3.total_installment && loan_3.remaining > 0)) return [3 /*break*/, 10];
                console.log('test123');
                _installment_1 = new loan_installment_1.Installment();
                if (plan_1.type_interest === "flatrate") {
                    calculator_1 = (0, calurate_1.flatrateCalculator)({
                        amount: loan_3.amount,
                        remaining: loan_3.remaining,
                        interest_rate: interestRate_2,
                        total_installment: loan_3.total_installment,
                        installment_start: loan_3.installment_start,
                        payment_date: loan_3.installment_due,
                        pay: loan_3.remaining,
                        interest_stack: loan_3.overdue_balance,
                        installment: Number(loan_3.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                else {
                    calculator_1 = (0, calurate_1.effectiverateCalculator)({
                        amount: loan_3.amount,
                        remaining: loan_3.remaining,
                        interest_rate: interestRate_2,
                        total_installment: loan_3.total_installment,
                        installment_start: loan_3.installment_start,
                        payment_date: loan_3.installment_due,
                        pay: loan_3.remaining,
                        interest_stack: loan_3.overdue_balance,
                        installment: Number(loan_3.given_installment) + 1,
                        pay_days: 30,
                        delay_days: plan_1.delay_value,
                        delay_charge: plan_1.fixed_charge,
                    });
                }
                delay_days_2 = calculator_1.delay_days, delay_charge_1 = calculator_1.delay_charge, principle_1 = calculator_1.principle, interest_1 = calculator_1.interest, paid_principle_1 = calculator_1.paid_principle, paid_interest_2 = calculator_1.paid_interest, interest_due = calculator_1.interest_due, principle_remaining_1 = calculator_1.principle_remaining, interest_remaining_2 = calculator_1.interest_remaining, installment_2 = calculator_1.installment, props_1 = __rest(calculator_1, ["delay_days", "delay_charge", "principle", "interest", "paid_principle", "paid_interest", "interest_due", "principle_remaining", "interest_remaining", "installment"]);
                _b = _installment_1;
                return [4 /*yield*/, (0, index_1.generateReceiptNumber)(plan_1.id)];
            case 8:
                _b.receipt_number = _c.sent();
                _installment_1.plan_id = plan_1.id;
                _installment_1.user_id = loan_3.user_id;
                _installment_1.loan_id = loan_3.id;
                _installment_1.loan_number = loan_3.loan_number;
                _installment_1.installment_date = loan_3.installment_due;
                _installment_1.start_date = loan_3.installment_start;
                _installment_1.per_installment = loan_3.remaining;
                _installment_1.amount = loan_3.amount;
                _installment_1.remaining = 0;
                _installment_1.principle = 0;
                _installment_1.overdue_balance = calculator_1.interest_remaining;
                _installment_1.installment = calculator_1.installment;
                _installment_1.total_installment = loan_3.total_installment;
                _installment_1.isPaid = false;
                _installment_1.paid = Number(loan_3.remaining) + calculator_1.paid_interest;
                _installment_1.delay_days = calculator_1.delay_days > 0 ? calculator_1.delay_days : 0;
                _installment_1.principle_installment = calculator_1.principle;
                _installment_1.interest_installment = calculator_1.interest;
                _installment_1.principle_paid = loan_3.remaining;
                _installment_1.interest_paid = calculator_1.paid_interest;
                _installment_1.delay_charge_paid = calculator_1.delay_charge;
                _installment_1.paid_by = "".concat(user_1.firstname, " - ").concat(user_1.lastname);
                _installment_1.interest_due = plan_1.type_interest === "flatrate" ? 0 : calculator_1.interest_due;
                _installment_1.total_interest = calculator_1.interest + loan_3.overdue_balance - calculator_1.paid_interest;
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
            case 9:
                _c.sent();
                loan_3.given_installment = calculator_1.installment;
                loan_3.installment_start = _installment_1.start_date;
                loan_3.installment_due = _installment_1.installment_date;
                return [3 /*break*/, 12];
            case 10: 
            // คำนวณงวดที่เหลือ
            return [4 /*yield*/, (function (lastPaid) { return __awaiter(void 0, void 0, void 0, function () {
                    var startInstallment, total_interest, valueInstallment, result, result, firstInstallment, nextInstallment, lastInstallment, _installment_2, _a, totalInterest, interestPerInstallment, paidInstallments, remainingInterest;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                startInstallment = loan_3.approved_at;
                                if (!(plan_1.type_interest === "flatrate")) return [3 /*break*/, 2];
                                return [4 /*yield*/, (0, calurate_1.flatrateInstallment)({
                                        loan_id: _loanId,
                                        amount: loan_3.amount,
                                        rate: interestRate_2,
                                        installment: loan_3.total_installment,
                                        start: loan_3.startDate,
                                        created: startInstallment,
                                        given_at: Number(loan_3.given_installment),
                                        lastPaid: lastPaid - Number(loan_3.charge_per_installment),
                                        delay_charge: Number(loan_3.charge_per_installment)
                                    })];
                            case 1:
                                result = _b.sent();
                                total_interest = result.total_interest;
                                valueInstallment = result.installment;
                                return [3 /*break*/, 4];
                            case 2: return [4 /*yield*/, (0, calurate_1.effevtiverateInstallment)({
                                    loan_id: _loanId,
                                    amount: loan_3.amount,
                                    rate: interestRate_2,
                                    installment: loan_3.total_installment,
                                    start: loan_3.startDate,
                                    created: startInstallment,
                                    given_at: Number(loan_3.given_installment),
                                    lastPaid: lastPaid - Number(loan_3.charge_per_installment),
                                    delay_charge: Number(loan_3.charge_per_installment),
                                    paidDate: paidDate_1,
                                })];
                            case 3:
                                result = _b.sent();
                                total_interest = result.total_interest;
                                valueInstallment = result.installment;
                                _b.label = 4;
                            case 4:
                                firstInstallment = valueInstallment[0], nextInstallment = valueInstallment[1];
                                lastInstallment = Number(loan_3.given_installment) + 1 == Number(loan_3.total_installment);
                                if (!(valueInstallment.length && firstInstallment.remaining >= 0)) return [3 /*break*/, 7];
                                loan_3.given_installment = installment_1;
                                _installment_2 = new loan_installment_1.Installment();
                                _a = _installment_2;
                                return [4 /*yield*/, (0, index_1.generateReceiptNumber)(plan_1.id)];
                            case 5:
                                _a.receipt_number = _b.sent();
                                _installment_2.plan_id = plan_1.id;
                                _installment_2.user_id = loan_3.user_id;
                                _installment_2.loan_id = loan_3.id;
                                _installment_2.loan_number = loan_3.loan_number;
                                _installment_2.installment_date = new Date(loan_3.installment_due);
                                _installment_2.start_date = loan_3.installment_start;
                                _installment_2.per_installment = loan_3.per_installment;
                                _installment_2.amount = loan_3.amount;
                                _installment_2.remaining = firstInstallment.remaining;
                                _installment_2.principle = Number(loan_3.principle) - firstInstallment.principle;
                                _installment_2.overdue_balance = interest_remaining_1;
                                _installment_2.outstanding_balance = firstInstallment.remaining;
                                _installment_2.installment = installment_1 + 1;
                                _installment_2.total_installment = loan_3.total_installment;
                                _installment_2.isPaid = false;
                                _installment_2.paid = firstInstallment.amount;
                                _installment_2.delay_days = delay_days_1 > 0 ? delay_days_1 : 0;
                                _installment_2.per_installment = loan_3.per_installment;
                                _installment_2.principle_installment = lastInstallment ? loan_3.remaining : firstInstallment.principle;
                                _installment_2.interest_installment = firstInstallment.interest;
                                _installment_2.principle_paid = lastInstallment ? loan_3.remaining : firstInstallment.principle;
                                _installment_2.interest_paid = firstInstallment.interest;
                                _installment_2.delay_charge_paid = 0;
                                _installment_2.paid_by = "".concat(user_1.firstname, " - ").concat(user_1.lastname);
                                if (plan_1.type_interest === "flatrate") {
                                    totalInterest = loan_3.amount * (Number(loan_3.loan_interest) / 100) * (loan_3.total_installment / 12);
                                    interestPerInstallment = Math.round((totalInterest / loan_3.total_installment + Number.EPSILON) * 100) / 100;
                                    paidInstallments = Number(loan_3.given_installment);
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
                                        ? loan_3.remaining
                                        : nextInstallment.principle;
                                    _installment_2.interest_next_due = nextInstallment.interest;
                                    _installment_2.total_amount_next_due = nextInstallment.amount;
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
                                                    where: { isPaid: true, loan_id: loan_3.id },
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
            case 11:
                // คำนวณงวดที่เหลือ
                _c.sent();
                _c.label = 12;
            case 12: return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(loan_3)];
            case 13:
                _c.sent();
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
                }).format(obj.paymentDate ? new Date(obj.paymentDate) : new Date());
                if (user_1.la == "enable") {
                    (0, module_1.Line_SendSlip)(user_1.line_id, plan_1.name, _installment.receipt_number, loan_3.loan_number, formattedInstallmentDate, "".concat(loan_3.given_installment, "/").concat(loan_3.total_installment), orders, sendTotal, "".concat(user_1.firstname, " ").concat(user_1.lastname));
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
                return [2 /*return*/, res.success("บันทึกรายการชำระสำเร็จ", __assign({}, _installment))];
            case 14:
                err_13 = _c.sent();
                console.log(err_13);
                return [2 /*return*/, res.error(err_13.detail || err_13.routine)];
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.payment = payment;
