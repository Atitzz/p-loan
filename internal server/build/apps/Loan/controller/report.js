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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tax = exports.report_stamp = exports.report_3 = exports.report_2 = exports.report_1 = exports.report_due = exports.report_installment = exports.report_newLoan = void 0;
var data_source_1 = require("../../../data-source");
var report_newLoan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, parameters, whereClause, countQuery, loansQuery, totalResult, _total, loans, total_loan, total_amount, total, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                parameters = [];
                whereClause = 'l.status = "Running" AND l.total_paid = 0';
                if (start && end) {
                    whereClause += ' AND l.approved_at BETWEEN ? AND ?';
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                if (search) {
                    whereClause += " AND (\n                LOWER(u.citizen_id) LIKE LOWER(?) \n                OR LOWER(l.loan_number) LIKE LOWER(?) \n                OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)\n            )";
                    parameters.push("%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"));
                }
                parameters.push(perPage, offset);
                countQuery = "\n          SELECT COUNT(*) AS total\n          FROM loan l\n          LEFT JOIN system_users u ON l.user_id = u.id\n            LEFT JOIN loan_plan lp ON lp.id = l.plan_id\n            LEFT JOIN loan_installment li ON li.loan_id = l.id\n          WHERE ".concat(whereClause, "\n      ");
                loansQuery = "\n                SELECT \n                    l.id, l.approved_at, l.loan_number, l.amount,\n                    l.total_installment, l.startDate, l.endDate,\n                    l.per_installment,\n                    l.remaining, l.installment_due,\n                    l.loan_interest,\n                    u.citizen_id, u.firstname, u.lastname,\n                    lp.fixed_charge, \n                    lp.fixed_charge AS fixed_charge2,\n                    lp.fixed_charge2 AS fixed_charge3, \n                    lp.application_percent_charge,\n                    MAX(li.given_at) as last_payment_date \n                FROM \n                    loan l\n                LEFT JOIN system_users u ON u.id = l.user_id\n                LEFT JOIN loan_plan lp ON lp.id = l.plan_id\n                LEFT JOIN loan_installment li ON li.loan_id = l.id\n                WHERE ".concat(whereClause, "\n            GROUP BY \n                l.id, u.citizen_id, u.firstname, u.lastname, li.given_at\n            ORDER BY l.id DESC\n            LIMIT ? OFFSET ?\n            ");
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 1:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(loansQuery, parameters)];
            case 2:
                loans = _b.sent();
                loans.forEach(function (loan) {
                    loan.interest_rate = Number(loan.loan_interest) + Number(loan.application_percent_charge);
                });
                if (loans.length === 0)
                    return [2 /*return*/, res.error("ไม่พบรายการสินเชื่อ")];
                total_loan = loans.length;
                total_amount = loans.reduce(function (sum, loan) { return sum + Number(loan.amount || 0); }, 0);
                total = { total_loan: total_loan, total_amount: total_amount };
                return [2 /*return*/, res.success("Report new loan", { data: loans, total: total }, _total)];
            case 3:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.report_newLoan = report_newLoan;
// รายงาน ภาระหนี้/การจัดเก็บ
var report_installment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, parameters, whereClause, query, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                parameters = [];
                whereClause = '';
                if (start && end) {
                    whereClause += 'i.given_at BETWEEN ? AND ?';
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                else {
                    whereClause = '1=1'; // หรือ 'i.isPaid = true' ถ้าต้องการแสดงเฉพาะงวดที่จ่ายแล้วโดยไม่ต้องระบุวันที่
                }
                if (search) {
                    whereClause += whereClause ? ' AND ' : '';
                    whereClause += '(LOWER(l.loan_number) LIKE LOWER(?) OR LOWER(u.firstname) LIKE LOWER(?))';
                    parameters.push("%".concat(search, "%"), "%".concat(search, "%"));
                }
                parameters.push(perPage, offset);
                query = "\n        SELECT \n            i.id,\n            i.given_at,\n            l.loan_number, \n            u.username, u.firstname, u.lastname, u.citizen_id,\n            ROW_NUMBER() OVER (PARTITION BY i.loan_id ORDER BY i.installment_date) AS installment_number,\n            i.per_installment,\n            i.principle_installment,\n            i.interest_installment,\n            i.paid,\n            i.principle_paid,\n            i.interest_paid,\n            i.overdue_balance\n        FROM \n            loan_installment i\n        LEFT JOIN loan l ON i.loan_id = l.id\n        LEFT JOIN system_users u ON u.id = l.user_id\n        WHERE ".concat(whereClause, " AND i.isPaid = true\n        ORDER BY \n            i.installment_date ASC\n        LIMIT \n            ? OFFSET ?\n        ");
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 1:
                result = _b.sent();
                return [2 /*return*/, res.success("Installment Payments Report", result)];
            case 2:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.report_installment = report_installment;
var report_due = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, parameters, whereClause, query, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                parameters = [];
                whereClause = 'l.status = "Due" AND isPaid = false';
                if (start && end) {
                    whereClause += ' AND l.installment_due BETWEEN ? AND ?';
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                if (search) {
                    whereClause += ' AND (LOWER(l.loan_number) LIKE LOWER(?) OR LOWER(u.firstname) LIKE LOWER(?))';
                    parameters.push("%".concat(search, "%"), "%".concat(search, "%"));
                }
                parameters.push(perPage, offset);
                query = "\n            WITH RankedInstallments AS (\n                SELECT \n                    i.id,\n                    i.given_at,\n                    l.loan_number, \n                    u.username, u.firstname, u.lastname, u.citizen_id,\n                    ROW_NUMBER() OVER (PARTITION BY i.loan_id ORDER BY i.installment_date DESC) AS rn,\n                    i.installment_date,\n                    i.per_installment,\n                    i.principle_installment,\n                    i.interest_installment,\n                    i.paid,\n                    i.principle_paid,\n                    i.interest_paid,\n                    i.overdue_balance,\n                    l.principle\n                FROM \n                    loan_installment i\n                LEFT JOIN loan l ON i.loan_id = l.id\n                LEFT JOIN system_users u ON u.id = l.user_id\n                WHERE ".concat(whereClause, " AND i.overdue_balance > 0\n            )\n            SELECT * FROM RankedInstallments WHERE rn = 1\n            ORDER BY installment_date ASC\n            LIMIT ? OFFSET ?\n            ");
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 1:
                result = _b.sent();
                return [2 /*return*/, res.success("Installment Payments Report", result)];
            case 2:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.report_due = report_due;
// ----------------------------------- รายงาน ----------------------------------- //
// รายงานหน้า 1
var report_1 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, start_1, end_1, whereClause, parameters, loanRanges_1, generateReport, _b, notGuaranteeReport, totalInterestNotGuarantee, _c, guaranteeReport, totalInterestGuarantee, guaranteeSummary, notGuaranteeSummary, guaranteeTotal, _i, guaranteeReport_1, item, notGuaranteeTotal, _d, notGuaranteeReport_1, item, totalAll, err_4;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 3, , 4]);
                _a = req.query, start_1 = _a.start, end_1 = _a.end;
                whereClause = '';
                parameters = [];
                loanRanges_1 = [
                    'ไม่เกิน 10,000',
                    '10,000.01 - 20,000.00',
                    '20,000.01 - 30,000.00',
                    '30,000.01 - 40,000.00',
                    '40,000.01 - 50,000.00',
                ];
                generateReport = function (isGuarantee) { return __awaiter(void 0, void 0, void 0, function () {
                    var guaranteeCondition, query, startDate, endDate, result, initialData, interestRates, processedResults, interestRateArray;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                guaranteeCondition = '';
                                if (isGuarantee) {
                                    guaranteeCondition = "\n                    (\n                        l.guarantee IS NOT NULL \n                        AND l.guarantee != '' \n                    )\n                ";
                                }
                                else {
                                    guaranteeCondition = "\n                    (\n                        l.guarantee IS NULL \n                        OR l.guarantee = ''\n                    )\n                ";
                                }
                                query = "\n                WITH AllLoan AS (\n                    SELECT\n                        l.id AS loan_id,\n                        l.amount,\n                        l.principle AS remaining,\n                        l.status,\n                        l.total_installment,\n                        l.installment_due,\n                        l.total_paid,\n                        l.loan_interest,\n                        l.startDate,\n                        CASE \n                            WHEN l.status = 'Bad' AND l.closed_at BETWEEN ? AND ? THEN 'Bad'\n                            WHEN l.status = 'Running' AND l.total_paid = 0\n                                AND l.startDate BETWEEN ? AND ? THEN 'Pending'\n                            WHEN l.status = 'Running' \n                                AND l.installment_start BETWEEN ? AND ? THEN 'Running'\n                            ELSE l.status\n                        END AS calculated_status\n                    FROM loan l\n                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name\n                    LEFT JOIN loan_installment i ON l.id = i.loan_id\n                    WHERE ".concat(guaranteeCondition, " AND l.status != 'Paid'\n                    AND (\n                        l.closed_at BETWEEN ? AND ? \n                        OR l.startDate BETWEEN ? AND ? \n                        OR l.installment_start BETWEEN ? AND ?\n                    )\n                    GROUP BY l.id, l.amount, l.principle, l.status, l.startDate, l.installment_due, l.total_paid, l.loan_interest\n                ),\n                OverdueLoans AS (\n                    SELECT\n                        l.id AS loan_id,\n                        l.amount,\n                        l.principle AS remaining,\n                        l.status,\n                        l.total_installment,\n                        l.installment_due,\n                        l.total_paid,\n                        l.loan_interest,\n                        l.startDate,\n                        CASE \n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 31 AND 90 THEN 'overdue_1_3_months'\n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 91 AND 180 THEN 'overdue_3_6_months'\n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 181 AND 365 THEN 'overdue_6_12_months'\n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) > 365 THEN 'overdue_12_months_plus'\n                            ELSE 'Other'\n                        END AS calculated_status\n                    FROM loan l\n                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name\n                    LEFT JOIN loan_installment i ON l.id = i.loan_id\n                    WHERE ").concat(guaranteeCondition, " AND l.status != 'Paid'\n                    AND l.installment_due <= ?\n                    GROUP BY l.id, l.amount, l.principle, l.status, l.startDate, l.installment_due, l.total_paid, l.loan_interest\n                )\n                SELECT \n                    CASE \n                        WHEN amount <= 10000 THEN '\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 10,000'\n                        WHEN amount BETWEEN 10000.01 AND 20000 THEN '10,000.01 - 20,000.00'\n                        WHEN amount BETWEEN 20000.01 AND 30000 THEN '20,000.01 - 30,000.00'\n                        WHEN amount BETWEEN 30000.01 AND 40000 THEN '30,000.01 - 40,000.00'\n                        WHEN amount BETWEEN 40000.01 AND 50000 THEN '40,000.01 - 50,000.00'\n                       \n                    END AS loan_range,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status IN ('Running', 'Pending', 'Bad', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus') THEN loan_id \n                    END) AS loan_running,\n                    SUM(CASE \n                        WHEN calculated_status IN ('Running', 'Pending', 'Bad', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus') THEN remaining\n                        ELSE 0 \n                    END) AS running_total_principle,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'Pending' THEN loan_id \n                    END) AS loan_pending,\n                    SUM(CASE \n                        WHEN calculated_status = 'Pending' THEN remaining\n                        ELSE 0 \n                    END) AS pending_total_amount,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_1_3_months' THEN loan_id \n                    END) AS overdue_1_3_months,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_1_3_months' THEN remaining\n                        ELSE 0 \n                    END) AS overdue_1_3_months_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_3_6_months' THEN loan_id \n                    END) AS overdue_3_6_months,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_3_6_months' THEN remaining \n                        ELSE 0 \n                    END) AS overdue_3_6_months_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_6_12_months' THEN loan_id \n                    END) AS overdue_6_12_months,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_6_12_months' THEN remaining\n                        ELSE 0 \n                    END) AS overdue_6_12_months_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_12_months_plus' THEN loan_id \n                    END) AS overdue_12_months_plus,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_12_months_plus' THEN remaining\n                        ELSE 0 \n                    END) AS overdue_12_months_plus_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'Bad' THEN loan_id \n                    END) AS bad_count,\n                    SUM(CASE \n                        WHEN calculated_status = 'Bad' THEN remaining\n                        ELSE 0 \n                    END) AS bad_total,\n                    GROUP_CONCAT(DISTINCT loan_interest) AS loan_interests\n                FROM (\n                    SELECT * FROM AllLoan\n                    UNION ALL\n                    SELECT * FROM OverdueLoans\n                ) l\n                GROUP BY loan_range\n                HAVING loan_range IS NOT NULL;\n            ");
                                startDate = new Date("".concat(start_1, "T00:00:00"));
                                endDate = new Date("".concat(end_1, "T23:59:59"));
                                return [4 /*yield*/, data_source_1.AppDataSource.query(query, [
                                        startDate, endDate,
                                        startDate, endDate,
                                        startDate, endDate,
                                        startDate, endDate,
                                        startDate, endDate,
                                        startDate, endDate,
                                        startDate,
                                        startDate,
                                        startDate,
                                        startDate,
                                        startDate // สำหรับ installment_start ของ overdue
                                    ])];
                            case 1:
                                result = _a.sent();
                                initialData = loanRanges_1.map(function (range) { return ({
                                    loan_range: range,
                                    loan_running: 0,
                                    running_total_principle: 0,
                                    loan_pending: 0,
                                    pending_total_amount: 0,
                                    overdue_1_3_months: 0,
                                    overdue_1_3_months_total: 0,
                                    overdue_3_6_months: 0,
                                    overdue_3_6_months_total: 0,
                                    overdue_6_12_months: 0,
                                    overdue_6_12_months_total: 0,
                                    overdue_12_months_plus: 0,
                                    overdue_12_months_plus_total: 0,
                                    bad_count: 0,
                                    bad_total: 0,
                                }); });
                                interestRates = new Set();
                                processedResults = initialData.map(function (defaultItem) {
                                    var matchedItem = result.find(function (item) { return item.loan_range === defaultItem.loan_range; }) || {};
                                    var mergedItem = __assign(__assign({}, defaultItem), matchedItem);
                                    var interestrateShow = Number(mergedItem.loan_running || 0) > 0 ||
                                        Number(mergedItem.loan_pending || 0) > 0 ||
                                        Number(mergedItem.overdue_1_3_months || 0) > 0 ||
                                        Number(mergedItem.overdue_3_6_months || 0) > 0 ||
                                        Number(mergedItem.overdue_6_12_months || 0) > 0 ||
                                        Number(mergedItem.overdue_12_months_plus || 0) > 0 ||
                                        Number(mergedItem.bad_count || 0) > 0;
                                    if (interestrateShow && mergedItem.loan_interests) {
                                        var interests = mergedItem.loan_interests.split(',').map(Number);
                                        interests.forEach(function (interest) {
                                            if (!isNaN(interest)) {
                                                interestRates.add(interest);
                                            }
                                        });
                                    }
                                    delete mergedItem.loan_interests;
                                    return __assign(__assign({}, mergedItem), { loan_running: Number(mergedItem.loan_running || 0), running_total_principle: Number(mergedItem.running_total_principle || 0), loan_pending: Number(mergedItem.loan_pending || 0), pending_total_amount: Number(mergedItem.pending_total_amount || 0), overdue_1_3_months: Number(mergedItem.overdue_1_3_months || 0), overdue_1_3_months_total: Number(mergedItem.overdue_1_3_months_total || 0), overdue_3_6_months: Number(mergedItem.overdue_3_6_months || 0), overdue_3_6_months_total: Number(mergedItem.overdue_3_6_months_total || 0), overdue_6_12_months: Number(mergedItem.overdue_6_12_months || 0), overdue_6_12_months_total: Number(mergedItem.overdue_6_12_months_total || 0), overdue_12_months_plus: Number(mergedItem.overdue_12_months_plus || 0), overdue_12_months_plus_total: Number(mergedItem.overdue_12_months_plus_total || 0), bad_count: Number(mergedItem.bad_count || 0), bad_total: Number(mergedItem.bad_total || 0) });
                                });
                                interestRateArray = Array.from(interestRates).sort(function (a, b) { return a - b; }).join(', ');
                                return [2 /*return*/, {
                                        processedResults: processedResults,
                                        interestRates: {
                                            total_interest: interestRates.size,
                                            interest_rate: interestRateArray
                                        }
                                    }];
                        }
                    });
                }); };
                return [4 /*yield*/, generateReport(false)];
            case 1:
                _b = _e.sent(), notGuaranteeReport = _b.processedResults, totalInterestNotGuarantee = _b.interestRates;
                return [4 /*yield*/, generateReport(true)];
            case 2:
                _c = _e.sent(), guaranteeReport = _c.processedResults, totalInterestGuarantee = _c.interestRates;
                guaranteeSummary = {
                    total_interest: totalInterestGuarantee.total_interest,
                    interest_rate: totalInterestGuarantee.interest_rate
                };
                notGuaranteeSummary = {
                    total_interest: totalInterestNotGuarantee.total_interest,
                    interest_rate: totalInterestNotGuarantee.interest_rate
                };
                guaranteeTotal = {
                    loan_range: 'รวม',
                    loan_running: 0,
                    running_total_principle: 0,
                    loan_pending: 0,
                    pending_total_amount: 0,
                    overdue_1_3_months: 0,
                    overdue_1_3_months_total: 0,
                    overdue_3_6_months: 0,
                    overdue_3_6_months_total: 0,
                    overdue_6_12_months: 0,
                    overdue_6_12_months_total: 0,
                    overdue_12_months_plus: 0,
                    overdue_12_months_plus_total: 0,
                    bad_count: 0,
                    bad_total: 0,
                };
                for (_i = 0, guaranteeReport_1 = guaranteeReport; _i < guaranteeReport_1.length; _i++) {
                    item = guaranteeReport_1[_i];
                    guaranteeTotal.loan_running += Number(item.loan_running);
                    guaranteeTotal.running_total_principle += Number(item.running_total_principle);
                    guaranteeTotal.loan_pending += Number(item.loan_pending);
                    guaranteeTotal.pending_total_amount += Number(item.pending_total_amount);
                    guaranteeTotal.overdue_1_3_months += Number(item.overdue_1_3_months);
                    guaranteeTotal.overdue_1_3_months_total += Number(item.overdue_1_3_months_total);
                    guaranteeTotal.overdue_3_6_months += Number(item.overdue_3_6_months);
                    guaranteeTotal.overdue_3_6_months_total += Number(item.overdue_3_6_months_total);
                    guaranteeTotal.overdue_6_12_months += guaranteeTotal.overdue_6_12_months += Number(item.overdue_6_12_months);
                    guaranteeTotal.overdue_6_12_months_total += Number(item.overdue_6_12_months_total);
                    guaranteeTotal.overdue_12_months_plus += Number(item.overdue_12_months_plus);
                    guaranteeTotal.overdue_12_months_plus_total += Number(item.overdue_12_months_plus_total);
                    guaranteeTotal.bad_count += Number(item.bad_count);
                    guaranteeTotal.bad_total += Number(item.bad_total);
                }
                notGuaranteeTotal = {
                    loan_range: 'รวม',
                    loan_running: 0,
                    running_total_principle: 0,
                    loan_pending: 0,
                    pending_total_amount: 0,
                    overdue_1_3_months: 0,
                    overdue_1_3_months_total: 0,
                    overdue_3_6_months: 0,
                    overdue_3_6_months_total: 0,
                    overdue_6_12_months: 0,
                    overdue_6_12_months_total: 0,
                    overdue_12_months_plus: 0,
                    overdue_12_months_plus_total: 0,
                    bad_count: 0,
                    bad_total: 0,
                };
                for (_d = 0, notGuaranteeReport_1 = notGuaranteeReport; _d < notGuaranteeReport_1.length; _d++) {
                    item = notGuaranteeReport_1[_d];
                    notGuaranteeTotal.loan_running += Number(item.loan_running);
                    notGuaranteeTotal.running_total_principle += Number(item.running_total_principle);
                    notGuaranteeTotal.loan_pending += Number(item.loan_pending);
                    notGuaranteeTotal.pending_total_amount += Number(item.pending_total_amount);
                    notGuaranteeTotal.overdue_1_3_months += Number(item.overdue_1_3_months);
                    notGuaranteeTotal.overdue_1_3_months_total += Number(item.overdue_1_3_months_total);
                    notGuaranteeTotal.overdue_3_6_months += Number(item.overdue_3_6_months);
                    notGuaranteeTotal.overdue_3_6_months_total += Number(item.overdue_3_6_months_total);
                    notGuaranteeTotal.overdue_6_12_months += Number(item.overdue_6_12_months);
                    notGuaranteeTotal.overdue_6_12_months_total += Number(item.overdue_6_12_months_total);
                    notGuaranteeTotal.overdue_12_months_plus += Number(item.overdue_12_months_plus);
                    notGuaranteeTotal.overdue_12_months_plus_total += Number(item.overdue_12_months_plus_total);
                    notGuaranteeTotal.bad_count += Number(item.bad_count);
                    notGuaranteeTotal.bad_total += Number(item.bad_total);
                }
                guaranteeReport.push(guaranteeTotal);
                notGuaranteeReport.push(notGuaranteeTotal);
                totalAll = {
                    loan_range: 'รวมทั้งหมด',
                    loan_running: notGuaranteeTotal.loan_running + guaranteeTotal.loan_running,
                    running_total_principle: notGuaranteeTotal.running_total_principle + guaranteeTotal.running_total_principle,
                    loan_pending: notGuaranteeTotal.loan_pending + guaranteeTotal.loan_pending,
                    pending_total_amount: notGuaranteeTotal.pending_total_amount + guaranteeTotal.pending_total_amount,
                    overdue_1_3_months: notGuaranteeTotal.overdue_1_3_months + guaranteeTotal.overdue_1_3_months,
                    overdue_1_3_months_total: notGuaranteeTotal.overdue_1_3_months_total + guaranteeTotal.overdue_1_3_months_total,
                    overdue_3_6_months: notGuaranteeTotal.overdue_3_6_months + guaranteeTotal.overdue_3_6_months,
                    overdue_3_6_months_total: notGuaranteeTotal.overdue_3_6_months_total + guaranteeTotal.overdue_3_6_months_total,
                    overdue_6_12_months: notGuaranteeTotal.overdue_6_12_months + guaranteeTotal.overdue_6_12_months,
                    overdue_6_12_months_total: notGuaranteeTotal.overdue_6_12_months_total + guaranteeTotal.overdue_6_12_months_total,
                    overdue_12_months_plus: notGuaranteeTotal.overdue_12_months_plus + guaranteeTotal.overdue_12_months_plus,
                    overdue_12_months_plus_total: notGuaranteeTotal.overdue_12_months_plus_total + guaranteeTotal.overdue_12_months_plus_total,
                    bad_count: notGuaranteeTotal.bad_count + guaranteeTotal.bad_count,
                    bad_total: notGuaranteeTotal.bad_total + guaranteeTotal.bad_total,
                };
                return [2 /*return*/, res.success('Loan report generated successfully', {
                        guaranteeSummary: guaranteeSummary,
                        guaranteeReport: guaranteeReport,
                        notGuaranteeSummary: notGuaranteeSummary,
                        notGuaranteeReport: notGuaranteeReport,
                        // totalAll,
                    })];
            case 3:
                err_4 = _e.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.report_1 = report_1;
var report_2 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, start_2, end_2, propertyTypesQuery, propertyTypes_2, guaranteeTypesQuery, guaranteeTypes, generateReportForType, resultsByProperty, _loop_1, _i, propertyTypes_1, property, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                _a = req.query, start_2 = _a.start, end_2 = _a.end;
                propertyTypesQuery = "\n            SELECT name \n            FROM loan_property\n            ORDER BY `index` ASC;\n        ";
                return [4 /*yield*/, data_source_1.AppDataSource.query(propertyTypesQuery)];
            case 1:
                propertyTypes_2 = _b.sent();
                guaranteeTypesQuery = "\n            SELECT name, type \n            FROM loan_guarantee\n            ORDER BY `index` ASC;\n        ";
                return [4 /*yield*/, data_source_1.AppDataSource.query(guaranteeTypesQuery)];
            case 2:
                guaranteeTypes = _b.sent();
                generateReportForType = function (typeName, guaranteeName) { return __awaiter(void 0, void 0, void 0, function () {
                    var query, startDate, endDate, result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                query = "\n                WITH LoanData AS (\n                    SELECT\n                        l.id AS loan_id,\n                        l.amount,\n                        l.principle AS remaining,\n                        l.status,\n                        l.total_installment,\n                        l.installment_due,\n                        l.total_paid,\n                        l.plan_id,\n                        startDate,\n                        CASE \n                            WHEN l.status = 'Bad' AND l.closed_at BETWEEN ? AND ? THEN 'Bad'\n                            WHEN l.status = 'Running' AND l.total_paid = 0 AND l.startDate BETWEEN ? AND ? THEN 'Pending'\n                            WHEN l.status = 'Running' AND l.installment_start BETWEEN ? AND ? THEN 'Running'\n                            ELSE l.status\n                        END AS calculated_status\n                    FROM loan l\n                    LEFT JOIN loan_installment i ON l.id = i.loan_id\n                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name\n                    WHERE l.status != 'Paid' AND l.status != 'Pending'\n                    AND lg.type = ?\n                    AND lg.name = ?\n                    AND (\n                        l.closed_at BETWEEN ? AND ? \n                        OR l.startDate BETWEEN ? AND ? \n                        OR l.installment_start BETWEEN ? AND ?\n                    )\n                    GROUP BY l.id, l.amount, l.principle, l.status, l.installment_due, l.total_paid, l.plan_id, startDate\n                ),\n                OverdueLoans AS (\n                    SELECT\n                        l.id AS loan_id,\n                        l.amount,\n                        l.principle AS remaining,\n                        l.status,\n                        l.total_installment,\n                        l.installment_due,\n                        l.total_paid,\n                        l.plan_id,\n                        startDate,\n                        CASE \n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 31 AND 90 THEN 'overdue_1_3_months'\n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 91 AND 180 THEN 'overdue_3_6_months'\n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 181 AND 365 THEN 'overdue_6_12_months'\n                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) > 365 THEN 'overdue_12_months_plus'\n                            ELSE 'Other'\n                        END AS calculated_status\n                    FROM loan l\n                    LEFT JOIN loan_installment i ON l.id = i.loan_id\n                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name\n                    WHERE l.status != 'Paid'  AND l.status != 'Pending'\n                    AND lg.type = ?\n                    AND lg.name = ?\n                    AND l.installment_due <= ?\n                    GROUP BY l.id, l.amount, l.principle, l.status, l.installment_due, l.total_paid, l.plan_id, startDate\n                ),\n                CombinedLoans AS (\n                    SELECT * FROM LoanData\n                    UNION ALL\n                    SELECT * FROM OverdueLoans\n                )\n                SELECT \n                    '".concat(guaranteeName, "' AS name,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status IN ('Running', 'Pending', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus', 'Bad') THEN loan_id \n                    END) AS loan_running,\n                    SUM(CASE \n                        WHEN calculated_status IN ('Running', 'Pending', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus', 'Bad') THEN remaining \n                        ELSE 0 \n                    END) AS running_total_principle,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'Pending' THEN loan_id \n                    END) AS loan_pending,\n                    SUM(CASE \n                        WHEN calculated_status = 'Pending' THEN remaining \n                        ELSE 0 \n                    END) AS pending_total_amount,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_1_3_months' THEN loan_id \n                    END) AS overdue_1_3_months,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_1_3_months' THEN remaining \n                        ELSE 0 \n                    END) AS overdue_1_3_months_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_3_6_months' THEN loan_id \n                    END) AS overdue_3_6_months,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_3_6_months' THEN remaining \n                        ELSE 0 \n                    END) AS overdue_3_6_months_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_6_12_months' THEN loan_id \n                    END) AS overdue_6_12_months,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_6_12_months' THEN remaining \n                        ELSE 0 \n                    END) AS overdue_6_12_months_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'overdue_12_months_plus' THEN loan_id \n                    END) AS overdue_12_months_plus,\n                    SUM(CASE \n                        WHEN calculated_status = 'overdue_12_months_plus' THEN remaining \n                        ELSE 0 \n                    END) AS overdue_12_months_plus_total,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'Bad' THEN loan_id \n                    END) AS bad_count,\n                    SUM(CASE \n                        WHEN calculated_status = 'Bad' THEN remaining \n                        ELSE 0 \n                    END) AS bad_total\n                FROM CombinedLoans\n                GROUP BY name;\n            ");
                                startDate = new Date("".concat(start_2, "T00:00:00"));
                                endDate = new Date("".concat(end_2, "T23:59:59"));
                                return [4 /*yield*/, data_source_1.AppDataSource.query(query, [
                                        startDate, endDate, startDate, endDate, startDate, endDate, typeName, guaranteeName, startDate, endDate, startDate, endDate, startDate, endDate,
                                        startDate, startDate, startDate, startDate, typeName, guaranteeName, startDate
                                    ])];
                            case 1:
                                result = _a.sent();
                                // หากไม่มีข้อมูล ให้แสดงผลเป็น 0
                                if (result.length === 0) {
                                    return [2 /*return*/, [{
                                                name: guaranteeName,
                                                loan_running: 0,
                                                running_total_principle: 0,
                                                loan_pending: 0,
                                                pending_total_amount: 0,
                                                overdue_1_3_months: 0,
                                                overdue_1_3_months_total: 0,
                                                overdue_3_6_months: 0,
                                                overdue_3_6_months_total: 0,
                                                overdue_6_12_months: 0,
                                                overdue_6_12_months_total: 0,
                                                overdue_12_months_plus: 0,
                                                overdue_12_months_plus_total: 0,
                                                bad_count: 0,
                                                bad_total: 0
                                            }]];
                                }
                                return [2 /*return*/, result];
                        }
                    });
                }); };
                resultsByProperty = {};
                _loop_1 = function (property) {
                    var guarantees, resultForProperty, count, _c, guarantees_1, guarantee, result;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                guarantees = guaranteeTypes.filter(function (g) { return g.type === property.name; });
                                resultForProperty = [];
                                count = 1;
                                _c = 0, guarantees_1 = guarantees;
                                _d.label = 1;
                            case 1:
                                if (!(_c < guarantees_1.length)) return [3 /*break*/, 4];
                                guarantee = guarantees_1[_c];
                                return [4 /*yield*/, generateReportForType(guarantee.type, guarantee.name)];
                            case 2:
                                result = _d.sent();
                                resultForProperty.push.apply(resultForProperty, result.map(function (r) { return (__assign(__assign({}, r), { set: "".concat(propertyTypes_2.indexOf(property) + 1, ".").concat(count++, " ").concat(r.name) // ลำดับของหลักประกันในประเภทนั้น ๆ
                                 })); }));
                                _d.label = 3;
                            case 3:
                                _c++;
                                return [3 /*break*/, 1];
                            case 4:
                                resultsByProperty[property.name] = resultForProperty;
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, propertyTypes_1 = propertyTypes_2;
                _b.label = 3;
            case 3:
                if (!(_i < propertyTypes_1.length)) return [3 /*break*/, 6];
                property = propertyTypes_1[_i];
                return [5 /*yield**/, _loop_1(property)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, res.success('Loan report generated successfully', resultsByProperty)];
            case 7:
                err_5 = _b.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.report_2 = report_2;
var report_3 = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, start, end, parameters, whereClause, query, startDate, endDate, report_4, loanRanges, fullReport, totalReport_1, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, start = _a.start, end = _a.end;
                parameters = [];
                whereClause = '';
                query = "\n            WITH LoanData AS (\n                SELECT\n                    l.user_id,\n                    l.reference,\n                    GROUP_CONCAT(l.id) AS loan_ids,\n                    SUM(l.amount) AS amount,\n                    SUM(l.principle) AS remaining,\n                    l.status,\n                    l.total_installment AS total_installment,\n                    l.installment_due AS installment_due,\n                    SUM(l.total_paid) AS total_paid,\n                    l.plan_id AS plan_id,\n                    l.closed_at,\n                    l.installment_start,\n                    l.approved_at,\n                    l.startDate,\n                    CASE \n                        WHEN l.status = 'Running' AND SUM(l.total_paid) > 0 AND l.installment_start BETWEEN ? AND ? THEN 'Running'\n                        WHEN l.status = 'Running' AND SUM(l.total_paid) = 0 AND l.startDate BETWEEN ? AND ? THEN 'Newloan'\n                        WHEN l.status = 'Running' AND l.approved_at BETWEEN ? AND ? THEN 'Approve'\n                        ELSE l.status\n                    END AS calculated_status\n                FROM loan l\n                WHERE ".concat(whereClause ? "(".concat(whereClause, ") AND") : '', " l.status != 'Paid' AND l.status != 'Pending'\n                AND (\n                    l.approved_at BETWEEN ? AND ? \n                    OR l.startDate BETWEEN ? AND ? \n                    OR l.installment_start BETWEEN ? AND ?\n                )\n                GROUP BY l.user_id, l.reference, l.status, l.startDate, l.total_installment, l.installment_due, l.plan_id, l.closed_at, l.installment_start, l.approved_at\n            ),\n            LoanReport AS (\n                SELECT \n                    CASE \n                        WHEN amount <= 10000 THEN '\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 10,000'\n                        WHEN amount BETWEEN 10000.01 AND 20000 THEN '10,000.01 - 20,000.00'\n                        WHEN amount BETWEEN 20000.01 AND 30000 THEN '20,000.01 - 30,000.00'\n                        WHEN amount BETWEEN 30000.01 AND 40000 THEN '30,000.01 - 40,000.00'\n                        WHEN amount BETWEEN 40000.01 AND 50000 THEN '40,000.01 - 50,000.00'\n                        WHEN amount BETWEEN 50000.01 AND 60000 THEN '50,000.01 - 60,000.00'\n                        WHEN amount BETWEEN 60000.01 AND 70000 THEN '60,000.01 - 70,000.00'\n                        WHEN amount BETWEEN 70000.01 AND 80000 THEN '70,000.01 - 80,000.00'\n                        WHEN amount BETWEEN 80000.01 AND 90000 THEN '80,000.01 - 90,000.00'\n                        WHEN amount BETWEEN 90000.01 AND 100000 THEN '90,000.01 - 100,000.00'\n                        WHEN amount > 100000 THEN '\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32 100,000'\n                    END AS loan_range,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status IN ('Approve', 'Newloan', 'Running') THEN user_id\n                    END) AS loan_approve,\n                    SUM(CASE \n                        WHEN calculated_status IN ('Approve', 'Newloan', 'Running') THEN amount \n                        ELSE 0 \n                    END) AS approve_total_amount,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'Running' THEN user_id\n                    END) AS loan_running,\n                    SUM(CASE \n                        WHEN calculated_status = 'Running' THEN remaining \n                        ELSE 0 \n                    END) AS running_total_amount,\n                    COUNT(DISTINCT CASE \n                        WHEN calculated_status = 'Newloan' THEN user_id\n                    END) AS loan_new,\n                    SUM(CASE \n                        WHEN calculated_status = 'Newloan' THEN remaining \n                        ELSE 0 \n                    END) AS new_total_amount,\n                    GROUP_CONCAT(DISTINCT reference) AS references_list,\n                    GROUP_CONCAT(DISTINCT loan_ids) AS all_loan_ids\n                FROM LoanData l\n                GROUP BY loan_range\n            )\n            SELECT * FROM LoanReport;\n        ");
                startDate = new Date("".concat(start, "T00:00:00"));
                endDate = new Date("".concat(end, "T23:59:59"));
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, [
                        startDate, endDate, startDate, endDate, startDate, endDate,
                        startDate, endDate, startDate, endDate, startDate, endDate
                    ]).then(function (result) {
                        // console.log("Raw Result from Query:", result);
                        return result.map(function (item) { return ({
                            loan_range: item.loan_range,
                            loan_approve: Number(item.loan_approve),
                            approve_total_amount: Number(item.approve_total_amount),
                            loan_running: Number(item.loan_running),
                            running_total_amount: Number(item.running_total_amount),
                            loan_new: Number(item.loan_new),
                            new_total_amount: Number(item.new_total_amount),
                        }); });
                    })];
            case 1:
                report_4 = _b.sent();
                loanRanges = [
                    'ไม่เกิน 10,000',
                    '10,000.01 - 20,000.00',
                    '20,000.01 - 30,000.00',
                    '30,000.01 - 40,000.00',
                    '40,000.01 - 50,000.00',
                    '50,000.00 - 60,000.00',
                    '60,000.01 - 70,000.00',
                    '70,000.01 - 80,000.00',
                    '80,000.01 - 90,000.00',
                    '90,000.01 - 100,000.00',
                    'มากกว่า 100,000',
                ];
                fullReport = loanRanges.map(function (range) {
                    var found = report_4.find(function (r) { return r.loan_range === range; });
                    return found || {
                        loan_range: range,
                        loan_approve: 0,
                        approve_total_amount: 0,
                        loan_running: 0,
                        running_total_amount: 0,
                        loan_new: 0,
                        new_total_amount: 0
                    };
                });
                totalReport_1 = {
                    loan_range: 'รวม',
                    loan_approve: 0,
                    approve_total_amount: 0,
                    loan_running: 0,
                    running_total_amount: 0,
                    loan_new: 0,
                    new_total_amount: 0
                };
                fullReport.forEach(function (item) {
                    totalReport_1.loan_approve += Number(item.loan_approve);
                    totalReport_1.approve_total_amount += Number(item.approve_total_amount);
                    totalReport_1.loan_running += Number(item.loan_running);
                    totalReport_1.running_total_amount += Number(item.running_total_amount);
                    totalReport_1.loan_new += Number(item.loan_new);
                    totalReport_1.new_total_amount += Number(item.new_total_amount);
                });
                fullReport.push(totalReport_1);
                return [2 /*return*/, res.success('Loan report generated successfully', fullReport)];
            case 2:
                err_6 = _b.sent();
                console.log(err_6);
                return [2 /*return*/, res.error(err_6.detail || err_6.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.report_3 = report_3;
var report_stamp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, parameters, whereClause, countQuery, query, totalResult, _total, result, total_loan, total_amount, total, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                parameters = [];
                whereClause = 'l.status != "Pending" AND l.status != "Rejected"';
                if (start && end) {
                    whereClause += ' AND l.created_at BETWEEN ? AND ?';
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                if (search) {
                    whereClause += " AND (LOWER(l.loan_number) LIKE LOWER(?) \n            OR LOWER(u.citizen_id) LIKE LOWER(?) \n            OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)\n            ";
                    parameters.push("%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"));
                }
                parameters.push(perPage, offset);
                countQuery = "\n          SELECT COUNT(*) AS total\n          FROM loan l\n            LEFT JOIN system_users u ON u.id = l.user_id\n            LEFT JOIN loan_contract lc ON lc.loan_id = l.id\n          WHERE ".concat(whereClause, "\n      ");
                query = "\n            SELECT \n                l.id AS loan_id,\n                l.created_at,\n                l.loan_number, \n                l.amount,\n                u.username, u.firstname, u.lastname, u.citizen_id,\n                l.reference,\n                MAX(lc.id) AS contract_id,\n                MAX(lc.stamp) AS stamp,\n                MAX(lc.document) AS document\n            FROM \n                loan l\n            LEFT JOIN loan_contract lc ON lc.loan_id = l.id\n            LEFT JOIN system_users u ON u.id = l.user_id\n            WHERE ".concat(whereClause, "\n            GROUP BY \n                l.id, u.username, u.firstname, u.lastname, u.citizen_id, l.reference\n            ORDER BY \n                l.created_at DESC\n            LIMIT \n                ? OFFSET ?\n        ");
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 1:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 2:
                result = _b.sent();
                if (result.length === 0)
                    return [2 /*return*/, res.error("ไม่พบรายการสินเชื่อ")];
                total_loan = result.length;
                total_amount = {
                    amount: Number(result.reduce(function (sum, item) { return sum + Number(item.amount); }, 0)),
                    stamp: Number(result.reduce(function (sum, item) { return sum + Number(item.stamp); }, 0)),
                    document: Number(result.reduce(function (sum, item) { return sum + Number(item.document); }, 0))
                };
                total = __assign({ total_loan: total_loan }, total_amount);
                return [2 /*return*/, res.success("Installment Payments Report", { data: result, total: total }, _total)];
            case 3:
                err_7 = _b.sent();
                console.log(err_7);
                return [2 /*return*/, res.error(err_7.detail || err_7.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.report_stamp = report_stamp;
var tax = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, parameters, whereClause, countQuery, query, totalResult, _total, result, transactionTotal, taxTotalObject, taxTotal, data, total, err_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                parameters = [];
                whereClause = '';
                if (start && end) {
                    whereClause = 'i.given_at BETWEEN ? AND ?';
                    parameters.push(new Date("".concat(start, "T00:00:00")));
                    parameters.push(new Date("".concat(end, "T23:59:59")));
                }
                else {
                    whereClause = '1=1';
                }
                if (search) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    whereClause +=
                        "(LOWER(l.loan_number) LIKE LOWER(?) \n              OR LOWER(u.citizen_id) LIKE LOWER(?) \n              OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)\n              )";
                    parameters.push("%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"), "%".concat(search.toLowerCase(), "%"));
                }
                countQuery = "\n          SELECT COUNT(*) AS total\n          FROM loan_tax t\n            LEFT JOIN system_users u ON u.id = t.user_id\n            LEFT JOIN loan_installment i ON i.id = t.installment_id\n            LEFT JOIN loan l ON l.id = t.loan_id\n          WHERE ".concat(whereClause, "\n      ");
                query = "\n        SELECT \n            t.id,\n            i.given_at,\n            i.created_at,\n            t.installment_id,\n            l.loan_number, \n            u.username, u.firstname, u.lastname, u.citizen_id,\n            t.interest_rate,\n            t.tax_business,\n            t.tax_local,\n            t.total_tax,\n            i.delay_days AS days, \n            i.paid, \n            i.principle_paid AS principle, \n            i.interest_paid AS interest,\n            i.delay_charge,\n            i.delay_charge AS delay_charge2,\n            i.delay_charge_paid AS delay_charge_paid,\n            i.delay_charge_paid AS delay_charge_paid2,\n            i.overdue_balance,\n            i.application_charge,\n            i.receipt_number\n        FROM \n            loan_tax t\n        LEFT JOIN loan l ON l.id = t.loan_id\n        LEFT JOIN loan_installment i ON i.id = t.installment_id\n        LEFT JOIN system_users u ON u.id = t.user_id\n        WHERE ".concat(whereClause, "\n        ORDER BY \n            t.created_at DESC\n        LIMIT \n            ? OFFSET ?\n        ");
                parameters.push(perPage, offset);
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 1:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 2:
                result = _b.sent();
                if (result.length === 0)
                    return [2 /*return*/, res.error("ไม่พบรายการสินเชื่อ")];
                transactionTotal = {
                    paid: Number(result.reduce(function (sum, item) { return sum + Number(item.paid); }, 0)),
                    principle: Number(result.reduce(function (sum, item) { return sum + Number(item.principle); }, 0)),
                    interest: Number(result.reduce(function (sum, item) { return sum + Number(item.interest); }, 0)),
                    delay_charge: Number(result.reduce(function (sum, item) { return sum + Number(item.delay_charge); }, 0)),
                    delay_charge2: Number(result.reduce(function (sum, item) { return sum + Number(item.delay_charge2); }, 0)),
                    delay_charge_paid: Number(result.reduce(function (sum, item) { return sum + Number(item.delay_charge_paid); }, 0)),
                    delay_charge_paid2: Number(result.reduce(function (sum, item) { return sum + Number(item.delay_charge_paid2); }, 0)),
                    application_charge: Number(result.reduce(function (sum, item) { return sum + Number(item.application_charge); }, 0)),
                };
                taxTotalObject = {
                    "ภาษีธุรกิจเฉพาะ 3.00 %": Number(result.reduce(function (sum, item) { return sum + Number(item.tax_business); }, 0)),
                    "ภาษีท้องถิ่น 10.00 %": Number(result.reduce(function (sum, item) { return sum + Number(item.tax_local); }, 0)),
                    "รวมภาษีธุรกิจเฉพาะ+ภาษีท้องถิ่น": Number(result.reduce(function (sum, item) { return sum + Number(item.total_tax); }, 0)),
                };
                taxTotal = Object.entries(taxTotalObject).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return "".concat(key, ": ").concat(value.toFixed(2));
                });
                data = __spreadArray([], result, true);
                total = {
                    transactionTotal: transactionTotal,
                    taxTotal: taxTotal
                };
                return [2 /*return*/, res.success("Tax Report", { data: data, total: total }, _total)];
            case 3:
                err_8 = _b.sent();
                console.log(err_8);
                return [2 /*return*/, res.error(err_8.detail || err_8.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.tax = tax;
