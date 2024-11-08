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
exports.payment_notificate = exports.ApproveRejectLoan_notificate = exports.takeloan_notificate = exports.ApproveRejectKYC_notificate = exports.kyc_notificate = exports.notification_history = exports.sendNotificationEmail = void 0;
var data_source_1 = require("../../../data-source");
var nodemailer = require("nodemailer");
var dotenv = require("dotenv");
dotenv.config();
var sendNotificationEmail = function (to, subject, htmlContent, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var transporter, mailOptions, sentEmail, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                transporter = nodemailer.createTransport({
                    // host: process.env.MAIL_DOMAIN, // เซิร์ฟเวอร์ SMTP
                    // port: Number(process.env.MAIL_PORT), // พอร์ตที่ใช้สำหรับ SMTP กับ SSL
                    // secure: true, // ใช้ SSL
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                    debug: true,
                    logger: true, // แสดงล็อกเพิ่มเติม
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                mailOptions = {
                    from: process.env.MAIL_USER,
                    to: to,
                    subject: subject,
                    html: htmlContent,
                };
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                sentEmail = _a.sent();
                // บันทึกการแจ้งเตือน
                // await orm(NotificationEmail).save({
                //     user_id: userId,
                //     sent_from: process.env.GMAIL_USER,
                //     sent_to: to,
                //     subject: subject,
                //     message: htmlContent,
                //     notification_type: 'email',
                // });
                return [2 /*return*/, sentEmail];
            case 3:
                error_1 = _a.sent();
                console.error("Error sending email:", error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendNotificationEmail = sendNotificationEmail;
var notification_history = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, startDate, endDate, perPage, offset, whereClause, parameters, countQuery, query, totalResult, _total, notification, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, startDate = _a.startDate, endDate = _a.endDate;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = "";
                parameters = [];
                if (search) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    whereClause +=
                        "(LOWER(u.firstname) LIKE LOWER(?) OR LOWER(u.username) LIKE LOWER(?)) ";
                    parameters.push("%".concat(search, "%"), "%".concat(search, "%"));
                }
                if (startDate) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    whereClause += "ne.created_at >= ? ";
                    parameters.push(new Date("".concat(startDate, "T00:00:00")));
                }
                if (endDate) {
                    whereClause += whereClause ? " AND " : " WHERE ";
                    whereClause += "ne.created_at <= ? ";
                    parameters.push(new Date("".concat(endDate, "T23:59:59")));
                }
                parameters.push(perPage, offset);
                countQuery = "\n        SELECT COUNT(*) as total\n        FROM notification_email ne\n        LEFT JOIN system_users u ON ne.user_id = u.id\n        ".concat(whereClause);
                query = "\n        SELECT\n            u.firstname, u.lastname, u.username, u.email,\n            ne.id, ne.created_at as sent, ne.notification_type as sender, ne.subject, ne.message\n        FROM notification_email ne\n        LEFT JOIN system_users u ON ne.user_id = u.id\n        ".concat(whereClause, "\n        ORDER BY ne.created_at DESC\n        LIMIT ? OFFSET ?\n        ");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 2:
                totalResult = _b.sent();
                _total = parseInt(totalResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 3:
                notification = _b.sent();
                if (notification.length === 0) {
                    return [2 /*return*/, res.error("No notification found")];
                }
                return [2 /*return*/, res.success("Get All notification Success", notification, _total)];
            case 4:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.notification_history = notification_history;
// ----------------------------------- Templates -------------------------------- //
// applykyc
var kyc_notificate = function (user) {
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <style>\n                body {\n                    font-family: Arial, sans-serif;\n                    background-color: #f4f4f4;\n                    margin: 0;\n                    padding: 0;\n                }\n                .container {\n                    width: 80%;\n                    margin: auto;\n                    background: #ffffff;\n                    padding: 20px;\n                    border-radius: 10px;\n                }\n                .content {\n                    margin: 20px 0;\n                }\n                .content p {\n                    font-size: 16px;\n                    line-height: 1.5;\n                }\n                .content .highlight {\n                    color: #007bff;\n                    font-weight: bold;\n                }\n                .footer {\n                    text-align: center;\n                    margin-top: 20px;\n                    color: #888;\n                }\n                .footer a {\n                    color: #007bff;\n                    text-decoration: none;\n                }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div style=\"text-align: center;\">\n                    <img src=\"".concat(process.env.USER_DOMAIN, "/public/banner_logo.png\" alt=\"Company Logo\">\n                </div>\n                <div class=\"content\">\n                    <h2>\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E38\u0E13 ").concat(user.firstname, " ").concat(user.lastname, "</h2>\n                    <p>\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E15\u0E31\u0E27\u0E15\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C\u0E41\u0E25\u0E49\u0E27</p>\n                    <p>\u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 \u0E2B\u0E32\u0E01\u0E04\u0E38\u0E13\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E2A\u0E07\u0E2A\u0E31\u0E22\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21 \u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E1D\u0E48\u0E32\u0E22\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23\u0E25\u0E39\u0E01\u0E04\u0E49\u0E32\u0E02\u0E2D\u0E07\u0E40\u0E23\u0E32\u0E44\u0E14\u0E49</p>\n                    <h1 style=\"text-align: center;\">\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23</h1>\n                </div>\n                <div class=\"footer\">\n                    <p>\u00A9 2024 <a href=\"https://www.moneyforyou.co.th\">moneyforyou Company</a>. All Rights Reserved.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ");
};
exports.kyc_notificate = kyc_notificate;
// approve & reject kyc
var ApproveRejectKYC_notificate = function (user, subject, date, reject_reason) {
    if (reject_reason === void 0) { reject_reason = null; }
    var isApproved = subject === "การยืนยันตัวตนของคุณได้รับการอนุมัติ";
    var rejectReasonContent = reject_reason
        ? "<div><p>*\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38: <span class=\"highlight\" style=\"color: red;\"><u>".concat(reject_reason, "</u></span></p></div>")
        : "";
    var Date = "<p>\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48: ".concat(date, " <span class=\"highlight\"></span></p>");
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <style>\n                body {\n                    font-family: Arial, sans-serif;\n                    background-color: #f4f4f4;\n                    margin: 0;\n                    padding: 0;\n                }\n                .container {\n                    width: 80%;\n                    margin: auto;\n                    background: #ffffff;\n                    padding: 20px;\n                    border-radius: 10px;\n                }\n                .content {\n                    margin: 20px 0;\n                }\n                .content p {\n                    font-size: 16px;\n                    line-height: 1.5;\n                }\n                .content .highlight {\n                    color: #007bff;\n                    font-weight: bold;\n                }\n                .footer {\n                    text-align: center;\n                    margin-top: 20px;\n                    color: #888;\n                }\n                .footer a {\n                    color: #007bff;\n                    text-decoration: none;\n                }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div style=\"text-align: center;\">\n                    <img src=\"".concat(process.env.USER_DOMAIN, "/public/banner_logo.png\" alt=\"Company Logo\">\n                </div>\n                <div class=\"content\">\n                    <h2>\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E38\u0E13 ").concat(user.firstname, " ").concat(user.lastname, "</h2>\n                    <p>\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E15\u0E31\u0E27\u0E15\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13 <span class=\"highlight\">").concat(isApproved ? "ได้รับการอนุมัติ" : "ถูกปฏิเสธ", "</span>.</p>\n                    ").concat(Date, "\n                    ").concat(rejectReasonContent, "\n                    <h1 style=\"text-align: center;\">\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23</h1>\n                </div>\n                <div class=\"footer\">\n                    <p>\u00A9 2024 <a href=\"https://www.moneyforyou.co.th\">moneyforyou Company</a>. All Rights Reserved.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ");
};
exports.ApproveRejectKYC_notificate = ApproveRejectKYC_notificate;
// takeloan
var takeloan_notificate = function (user, loanDetails, loanPlan, interestRate) {
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <style>\n                body {\n                    font-family: Arial, sans-serif;\n                    background-color: #f4f4f4;\n                    margin: 0;\n                    padding: 0;\n                }\n                .container {\n                    width: 80%;\n                    margin: auto;\n                    background: #ffffff;\n                    padding: 20px;\n                    border-radius: 10px;\n                }\n                .content {\n                    margin: 20px 0;\n                }\n                .content p {\n                    font-size: 16px;\n                    line-height: 1.5;\n                }\n                .content .highlight {\n                    color: #007bff;\n                    font-weight: bold;\n                }\n                .details {\n                    background: #f9f9f9;\n                    padding: 10px;\n                    border-radius: 10px;\n                    margin-top: 20px;\n                }\n                .details p {\n                    margin: 0;\n                    font-size: 14px;\n                }\n                .footer {\n                    text-align: center;\n                    margin-top: 20px;\n                    color: #888;\n                }\n                .footer a {\n                    color: #007bff;\n                    text-decoration: none;\n                }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div style=\"text-align: center;\">\n                    <img src=\"".concat(process.env.USER_DOMAIN, "/public/banner_logo.png\" alt=\"Company Logo\">\n                </div>\n                <div class=\"content\">\n                    <h2>\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E38\u0E13 ").concat(user.firstname, " ").concat(user.lastname, "</h2>\n                    <p>\u0E04\u0E38\u0E13\u0E44\u0E14\u0E49\u0E17\u0E33\u0E01\u0E32\u0E23\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E41\u0E1C\u0E19\u0E2A\u0E34\u0E19\u0E40\u0E0A\u0E37\u0E48\u0E2D <span class=\"highlight\">").concat(loanPlan.name, "</span> \u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27</p>\n                    <h3>\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E01\u0E32\u0E23\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E2A\u0E34\u0E19\u0E40\u0E0A\u0E37\u0E48\u0E2D</h3>\n                    <div class=\"details\">\n                        <p>\u0E22\u0E2D\u0E14\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E01\u0E39\u0E49: <span class=\"highlight\">").concat(Number(loanDetails.amount).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }), " \u0E1A\u0E32\u0E17</span></p>\n                        <p>\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E14\u0E2D\u0E01\u0E40\u0E1A\u0E35\u0E49\u0E22: <span class=\"highlight\">").concat(Number(interestRate).toFixed(2), "%</span></p>\n                        <p>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E07\u0E27\u0E14: <span class=\"highlight\">").concat(loanDetails.installment, "</span></p>\n                    </div>\n                    <p>\u0E01\u0E32\u0E23\u0E2A\u0E21\u0E31\u0E04\u0E23\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E01\u0E32\u0E23\u0E1E\u0E34\u0E08\u0E32\u0E23\u0E13\u0E32 \u0E42\u0E1B\u0E23\u0E14\u0E23\u0E2D\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21.</p>\n                    <h1 style=\"text-align: center;\">\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23</h1>\n                </div>\n                <div class=\"footer\">\n                    <p>\u00A9 2024 <a href=\"https://www.moneyforyou.co.th\">moneyforyou Company</a>. All Rights Reserved.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ");
};
exports.takeloan_notificate = takeloan_notificate;
// approve & reject loan
var ApproveRejectLoan_notificate = function (user, loan, loanPlan, interestRate, subject, firstpay, reject_reason) {
    if (interestRate === void 0) { interestRate = null; }
    if (firstpay === void 0) { firstpay = null; }
    if (reject_reason === void 0) { reject_reason = null; }
    var isApproved = subject == "การขอสินเชื่อได้รับการอนุมัติแล้ว";
    var firstPay = firstpay
        ? "<p>\u0E0A\u0E33\u0E23\u0E30\u0E07\u0E27\u0E14\u0E41\u0E23\u0E01\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48: <span class=\"highlight\">".concat(firstpay, "</span></p>")
        : "";
    var reject_reasonContent = reject_reason
        ? "<div><p>*\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38: <span class=\"highlight\" style=\"color: red;\"><u>".concat(reject_reason, "</u></span></p></div>")
        : "";
    return "\n        <!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <style>\n                body {\n                    font-family: Arial, sans-serif;\n                    background-color: #f4f4f4;\n                    margin: 0;\n                    padding: 0;\n                }\n                .container {\n                    width: 80%;\n                    margin: auto;\n                    background: #ffffff;\n                    padding: 20px;\n                    border-radius: 10px;\n                }\n                .content {\n                    margin: 20px 0;\n                }\n                .content p {\n                    font-size: 16px;\n                    line-height: 1.5;\n                }\n                .content .highlight {\n                    color: #007bff;\n                    font-weight: bold;\n                }\n                .details {\n                    background: #f9f9f9;\n                    padding: 10px;\n                    border-radius: 10px;\n                    margin-top: 20px;\n                }\n                .details p {\n                    margin: 0;\n                    font-size: 14px;\n                }\n                .footer {\n                    text-align: center;\n                    margin-top: 20px;\n                    color: #888;\n                }\n                .footer a {\n                    color: #007bff;\n                    text-decoration: none;\n                }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div style=\"text-align: center;\">\n                    <img src=\"".concat(process.env.USER_DOMAIN, "/public/banner_logo.png\" alt=\"Company Logo\">\n                </div>\n                <div class=\"content\">\n                    <h2>\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E38\u0E13 ").concat(user.firstname, " ").concat(user.lastname, "</h2>\n                    <p>\u0E2A\u0E34\u0E19\u0E40\u0E0A\u0E37\u0E48\u0E2D\u0E17\u0E35\u0E48\u0E04\u0E38\u0E13\u0E23\u0E49\u0E2D\u0E07\u0E02\u0E2D <span class=\"highlight\">").concat(loanPlan.name, "</span> ").concat(isApproved ? "ได้รับการอนุมัติ" : "ถูกปฏิเสธ", "</p>\n                    ").concat(reject_reasonContent, "\n                        <h3>\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E2A\u0E34\u0E19\u0E40\u0E0A\u0E37\u0E48\u0E2D</h3>\n                        <div class=\"details\">\n                            <p>\u0E22\u0E2D\u0E14\u0E01\u0E39\u0E49: <span class=\"highlight\">").concat(Number(loan.amount).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }), " \u0E1A\u0E32\u0E17</span></p>\n                            <p>\u0E2D\u0E31\u0E15\u0E23\u0E32\u0E14\u0E2D\u0E01\u0E40\u0E1A\u0E35\u0E49\u0E22: <span class=\"highlight\">").concat(Number(interestRate), "%</span></p>\n                    ").concat(isApproved
        ? "\n                            <p>\u0E08\u0E33\u0E19\u0E27\u0E19\u0E07\u0E27\u0E14\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E0A\u0E33\u0E23\u0E30: <span class=\"highlight\">".concat(Number(loan.total_installment), "</span></p>\n                            <p>\u0E22\u0E2D\u0E14\u0E0A\u0E33\u0E23\u0E30\u0E15\u0E48\u0E2D\u0E07\u0E27\u0E14: <span class=\"highlight\">").concat(Number(loan.per_installment).toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }), " \u0E1A\u0E32\u0E17</span></p>\n                            ").concat(firstPay, "\n                    ")
        : "", "\n                        </div>\n                    <h1 style=\"text-align: center;\">\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23</h1>\n                </div>\n                <div class=\"footer\">\n                    <p>\u00A9 2024 <a href=\"https://www.moneyforyou.co.th\">moneyforyou Company</a>. All Rights Reserved.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ");
};
exports.ApproveRejectLoan_notificate = ApproveRejectLoan_notificate;
// payment
var payment_notificate = function (user, loan, planname, orders, sendTotal, formattedInstallmentDate, billNumber) {
    return "\n        <!DOCTYPE html>\n        <html lang=\"th\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <style>\n                body {\n                    font-family: Arial, sans-serif;\n                    background-color: #f4f4f4;\n                    margin: 0;\n                    padding: 0;\n                }\n                .container {\n                    width: 80%;\n                    margin: auto;\n                    background: #ffffff;\n                    padding: 20px;\n                    border-radius: 10px;\n                }\n                .content {\n                    margin: 20px 0;\n                }\n                .content p {\n                    font-size: 16px;\n                    line-height: 1.5;\n                }\n                .content .highlight {\n                    color: #007bff;\n                    font-weight: bold;\n                }\n                .details {\n                    background: #f9f9f9;\n                    padding: 10px;\n                    border-radius: 10px;\n                    margin-top: 20px;\n                }\n                .details p {\n                    margin: 0;\n                    font-size: 14px;\n                }\n                .footer {\n                    text-align: center;\n                    margin-top: 20px;\n                    color: #888;\n                }\n                .footer a {\n                    color: #007bff;\n                    text-decoration: none;\n                }\n            </style>\n        </head>\n        <body>\n            <div class=\"container\">\n                <div style=\"text-align: center;\">\n                    <img src=\"".concat(process.env.USER_DOMAIN, "/public/banner_logo.png\" alt=\"Company Logo\">\n                </div>\n                <div class=\"content\">\n                    <h2>\u0E40\u0E23\u0E35\u0E22\u0E19\u0E04\u0E38\u0E13 ").concat(user.firstname, " ").concat(user.lastname, "</h2>\n                    <p>\u0E43\u0E1A\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13</p>\n                    <div class=\"details\">\n                        <h3>\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E43\u0E1A\u0E40\u0E2A\u0E23\u0E47\u0E08</h3>\n                        <p>\u0E43\u0E1A\u0E40\u0E2A\u0E23\u0E47\u0E08: <span class=\"highlight\">").concat(billNumber, "</span></p>\n                        <p>\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E2A\u0E31\u0E0D\u0E0D\u0E32: <span class=\"highlight\">").concat(loan.loan_number, "</span></p>\n                        <p>\u0E2A\u0E34\u0E19\u0E40\u0E0A\u0E37\u0E48\u0E2D: <span class=\"highlight\">").concat(planname, "</span></p>\n                        <p>\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E0A\u0E33\u0E23\u0E30: <span class=\"highlight\">").concat(formattedInstallmentDate, "</span></p>\n                        <p>\u0E07\u0E27\u0E14\u0E17\u0E35\u0E48: <span class=\"highlight\">").concat(loan.given_installment, "/").concat(loan.total_installment, "</span></p>\n                        <h3 style=\"margin-top: 10px; color: black\">\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30</h3>\n                        ").concat(orders
        .map(function (order) { return "\n                            <p>".concat(order.name, ": <span class=\"highlight\">").concat(order.amount, "</span></p>\n                        "); })
        .join(""), "\n                        <p>\u0E23\u0E27\u0E21: <span class=\"highlight\">").concat(sendTotal, "</span></p>\n                    </div>\n                    <h1 style=\"text-align: center;\">\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E1A\u0E23\u0E34\u0E01\u0E32\u0E23</h1>\n                </div>\n                <div class=\"footer\">\n                    <p>\u00A9 2024 <a href=\"https://moneyforyou.co.th\">moneyforyou Company</a>. All Rights Reserved.</p>\n                </div>\n            </div>\n        </body>\n        </html>\n    ");
};
exports.payment_notificate = payment_notificate;
// deposit
// export const emailContent_deposit = (user, deposit, gateway, userBalance, subject, feedback = null) => {
//     const isApproved = subject === 'Approved';
//     const feedbackContent = feedback ? `<div><h1>Admin Feedback: <span class="highlight" style="color: red;"><u>${feedback}</u></span></h1></div>` : '';
//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     width: 80%;
//                     margin: auto;
//                     background: #ffffff;
//                     padding: 20px;
//                     border-radius: 10px;
//                 }
//                 .header {
//                     background: #007bff;
//                     color: #ffffff;
//                     padding: 10px 0;
//                     text-align: center;
//                 }
//                 .content {
//                     margin: 20px 0;
//                 }
//                 .content p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                 }
//                 .content .highlight {
//                     color: #007bff;
//                     font-weight: bold;
//                 }
//                 .details {
//                     background: #f9f9f9;
//                     padding: 10px;
//                     border-radius: 10px;
//                     margin-top: 20px;
//                 }
//                 .details p {
//                     margin: 0;
//                     font-size: 14px;
//                 }
//                 .footer {
//                     text-align: center;
//                     margin-top: 20px;
//                     color: #888;
//                 }
//                 .footer a {
//                     color: #007bff;
//                     text-decoration: none;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <h1>This is a System Generated Email</h1>
//             </div>
//             <div class="container">
//                 <div style="text-align: center;">
//                     <img src="https://via.placeholder.com/150" alt="Logo" style="width: 150px; height: auto;">
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${user.firstname}</h2>
//                     <p>Your deposit request of <span class="highlight">${Number(deposit.amount).toFixed(2)} ${deposit.method_currency}</span> via <span class="highlight">${gateway.name}</span> has been ${isApproved ? 'approved' : 'rejected'}.</p>
//                     <h3>Details of your Deposit:</h3>
//                     <div class="details">
//                         <p>Amount: <span class="highlight">${Number(deposit.amount).toFixed(2)} ${deposit.method_currency}</span></p>
//                         <p>Charge: <span class="highlight" style="color: red;">${Number(deposit.charge).toFixed(2)} ${deposit.method_currency}</span></p>
//                         <p>Total: <span class="highlight" style="color: red;">${Number(deposit.final_amount).toFixed(2)} ${deposit.method_currency}</span></p>
//                         <p>Pay via: <span class="highlight">${gateway.name}</span></p>
//                         <p>Transaction Number: <span class="highlight">${deposit.trx}</span></p>
//                         <p>Your Current Balance is: <span class="highlight">${Number(userBalance.balance).toFixed(2)} ${deposit.method_currency}</span></p>
//                     </div>
//                     ${feedbackContent}
//                 </div>
//                 <div class="footer">
//                     <p>© 2024 <a href="https://moneyforyou.com">moneyforyou Company</a>. All Rights Reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;
// };
// withdraw
// export const emailContent_withdraw = (user, transaction, method, balance, subject, feedback = null) => {
//     const isApproved = subject === 'Approved';
//     const feedbackContent = feedback ? `<div><h1>Admin Feedback: <span class="highlight" style="color: red;"><u>${feedback}</u></span></h1></div>` : '';
//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     width: 80%;
//                     margin: auto;
//                     background: #ffffff;
//                     padding: 20px;
//                     border-radius: 10px;
//                 }
//                 .header {
//                     background: #007bff;
//                     color: #ffffff;
//                     padding: 10px 0;
//                     text-align: center;
//                 }
//                 .content {
//                     margin: 20px 0;
//                 }
//                 .content p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                 }
//                 .content .highlight {
//                     color: #007bff;
//                     font-weight: bold;
//                 }
//                 .details {
//                     background: #f9f9f9;
//                     padding: 10px;
//                     border-radius: 10px;
//                     margin-top: 20px;
//                 }
//                 .details p {
//                     margin: 0;
//                     font-size: 14px;
//                 }
//                 .footer {
//                     text-align: center;
//                     margin-top: 20px;
//                     color: #888;
//                 }
//                 .footer a {
//                     color: #007bff;
//                     text-decoration: none;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <h1>This is a System Generated Email</h1>
//             </div>
//             <div class="container">
//                 <div style="text-align: center;">
//                     <img src="https://via.placeholder.com/150" alt="Logo" style="width: 150px; height: auto;">
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${user.firstname}</h2>
//                     <p>Your withdraw request of <span class="highlight">${Number(transaction.amount).toFixed(2)} ${transaction.currency}</span> via <span class="highlight">${method.name}</span> has been ${isApproved ? 'approved' : 'rejected'}.</p>
//                     <h3>Details of your Withdraw:</h3>
//                     <div class="details">
//                         <p>Amount: <span class="highlight">${Number(transaction.amount).toFixed(2)} ${transaction.currency}</span></p>
//                         <p>Charge: <span class="highlight" style="color: red;">${Number(transaction.charge).toFixed(2)} ${transaction.currency}</span></p>
//                         <p>Total: <span class="highlight" style="color: red;">${Number(transaction.after_charge).toFixed(2)} ${transaction.currency}</span></p>
//                         <p>Pay via: <span class="highlight">${method.name}</span></p>
//                         <p>Transaction Number: <span class="highlight">${transaction.trx}</span></p>
//                         <p>Your Current Balance is: <span class="highlight">${Number(balance.balance).toFixed(2)} ${transaction.currency}</span></p>
//                     </div>
//                     ${feedbackContent}
//                 </div>
//                 <div class="footer">
//                     <p>© 2024 <a href="https://moneyforyou.com">moneyforyou Company</a>. All Rights Reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;
// };
// autopay
// export const emailContent_pay = (user, installment, plan, transaction, userBalance) => {
//     const isBalancePayment = userBalance !== null;
//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     width: 80%;
//                     margin: auto;
//                     background: #ffffff;
//                     padding: 20px;
//                     border-radius: 10px;
//                 }
//                 .header {
//                     background: #007bff;
//                     color: #ffffff;
//                     padding: 10px 0;
//                     text-align: center;
//                 }
//                 .content {
//                     margin: 20px 0;
//                 }
//                 .content p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                 }
//                 .content .highlight {
//                     color: #007bff;
//                     font-weight: bold;
//                 }
//                 .details {
//                     background: #f9f9f9;
//                     padding: 10px;
//                     border-radius: 10px;
//                     margin-top: 20px;
//                 }
//                 .details p {
//                     margin: 0;
//                     font-size: 14px;
//                 }
//                 .footer {
//                     text-align: center;
//                     margin-top: 20px;
//                     color: #888;
//                 }
//                 .footer a {
//                     color: #007bff;
//                     text-decoration: none;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <h1>This is a System Generated Email</h1>
//             </div>
//             <div class="container">
//                 <div style="text-align: center;">
//                     <img src="${process.env.USER_DOMAIN}/public/banner_logo.png" alt="Company Logo">
//                 </div>
//                 <div class="content">
//                     <h2>สวัสดี ${user.firstname}</h2>
//                     <p>คุณมีการชำระสินเชื่อ <span class="highlight">${plan.name}</span> เรียบร้อยแล้ว</p>
//                     <h3>รายละเอียดการชำระ:</h3>
//                     <div class="details">
//                         <p>ยอดชำระต่องวด: <span class="highlight">${Number(installment.paid).toFixed(2)} บาท</span></p>
//                         <p>ล่าช้า: <span class="highlight">${installment.delay_days} วัน</span></p>
//                         <p>ค่าปรับ: <span class="highlight" style="color: red;">${Number(installment.delay_charge).toFixed(2)} บาท</span></p>
//                         <p>ยอดรวมที่ต้องชำระ: <span class="highlight">${Number(transaction.amount).toFixed(2)} บาท</span></p>
//                         <p>เลขที่สัญญา: <span class="highlight">${transaction.trx}</span></p>
//                         <p>วันที่ชำระ: <span class="highlight">${installment.given_at.toLocaleDateString()}</span></p>
//                         ${isBalancePayment ? `
//                         <p>ยอดคงเหลือในระบบ: <span class="highlight">${Number(userBalance.balance).toFixed(2)} บาท</span></p>
//                         ` : `
//                         <p>ชำระผ่าน: <span class="highlight">QR Code</span></p>
//                         `}
//                     </div>
//                     <h1 style="text-align: center;">ขอบคุณที่ใช้บริการ</h1>
//                 </div>
//                 <div class="footer">
//                     <p>© 2024 <a href="https://moneyforyou.com">moneyforyou Company</a>. All Rights Reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;
// };
// เลือกส่งเป็นบุคคล
// export const sendNotification = async (req, res) => {
//     const { to, subject, message } = req.body;
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.GMAIL_USER,
//             pass: process.env.GMAIL_PASS
//         }
//     });
//     try {
//         let recipients = [];
//         if (Array.isArray(to)) {
//             // ดึงข้อมูลของผู้รับหลายคน
//             const users = await orm(system_users).find({
//                 where: to.map(email => ({ email }))
//             });
//             recipients = users.map(user => ({ id: user.id, email: user.email }));
//         } else if (to === 'All Users') {
//             // ดึง user_id และอีเมลของผู้ใช้ทั้งหมดจากฐานข้อมูล
//             const users = await orm(system_users).find();
//             recipients = users.map(user => ({ id: user.id, email: user.email }));
//         } else {
//             // กรณีส่งไปยังผู้ใช้คนเดียว
//             const user = await orm(system_users).findOne({ where: { email: to } });
//             if (!user) {
//                 return res.status(404).json({ error: 'User not found' });
//             }
//             recipients = [{ id: user.id, email: user.email }];
//         }
//         const results = [];
//         for (const recipient of recipients) {
//             const mailOptions = {
//                 from: process.env.GMAIL_USER,
//                 to: recipient.email,
//                 subject: subject,
//                 html: message
//             };
//             const sentEmail = await transporter.sendMail(mailOptions);
//             let save = {}
//             save = await orm(NotificationEmail).save({
//                 user_id: recipient.id,
//                 sent_from: process.env.GMAIL_USER,
//                 sent_to: recipient.email,
//                 subject: subject,
//                 message: message,
//                 notification_type: 'email',
//             });
//             results.push({ sentEmail });
//         }
//         return res.success('Emails sent successfully.', results );
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// };
