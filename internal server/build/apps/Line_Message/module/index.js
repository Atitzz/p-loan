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
exports.Line_SendNotificateDue = exports.Line_SendSlip = exports.Line_KYC_Apply = exports.Line_Approve = exports.Line_Reject = exports.Line_SendNotificate = exports.Line_SendNotificateCharge = exports.Call_Balance = void 0;
var axios_1 = require("axios");
var data_source_1 = require("../../../data-source");
var entities_1 = require("../../Users/entities");
var Utils_1 = require("../../../Utils");
var Call_Balance = function (to) { return __awaiter(void 0, void 0, void 0, function () {
    var __content, message, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, callBalance(to)];
            case 1:
                __content = _a.sent();
                message = void 0;
                if (__content.contents.length > 0) {
                    message = [
                        {
                            type: "flex",
                            altText: "เช็คยอดชำระ",
                            contents: __content,
                        },
                    ];
                }
                else {
                    message = [
                        {
                            type: "text",
                            text: "ขณะนี้คุณไม่มีสินเชื่อ",
                        },
                    ];
                }
                return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                        to: to,
                        messages: message,
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                        },
                    })];
            case 2: return [2 /*return*/, _a.sent()];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, err_1];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.Call_Balance = Call_Balance;
var callBalance = function (line_id) { return __awaiter(void 0, void 0, void 0, function () {
    var __user, parameters, loanQuery, loanResult, __content;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                    where: { line_id: line_id },
                })];
            case 1:
                __user = _a.sent();
                if (!__user)
                    return [2 /*return*/, {
                            type: "carousel",
                            contents: [],
                        }];
                parameters = [__user.id];
                loanQuery = "\n      SELECT l.*,lp.name plan_name FROM (\nSELECT * FROM loan WHERE user_id = ?\n) l \nLEFT JOIN loan_plan lp ON l.plan_id = lp.id\n        ";
                return [4 /*yield*/, data_source_1.AppDataSource.query(loanQuery, parameters)];
            case 2:
                loanResult = _a.sent();
                __content = loanResult
                    .filter(function (loan) {
                    return String(loan.status).toLowerCase() == "running" ||
                        String(loan.status).toLowerCase() == "due";
                })
                    .map(function (loan) {
                    return contentCheckSlip(loan.plan_name, loan.loan_number, (0, Utils_1.toTHB)(loan.amount), (0, Utils_1.toTHB)(loan.remaining), (0, Utils_1.toTHB)(loan.per_installment), (0, Utils_1.toDate)(loan.installment_due, 1), "".concat(Number(loan.given_installment) + 1), loan.total_installment, line_id);
                });
                return [2 /*return*/, {
                        type: "carousel",
                        contents: __content,
                    }];
        }
    });
}); };
var contentCheckSlip = function (planName, loan_number, loan_amount, loan_remaining, amount, date, installment, total_installment, line_id) {
    if (planName === void 0) { planName = "Easy Loans"; }
    if (loan_number === void 0) { loan_number = "ABC12345"; }
    if (loan_amount === void 0) { loan_amount = "50,000 บาท"; }
    if (loan_remaining === void 0) { loan_remaining = "50,000 บาท"; }
    if (amount === void 0) { amount = "1,250 บาท"; }
    if (date === void 0) { date = "12 สิงหาคม 2567"; }
    if (installment === void 0) { installment = "1"; }
    if (total_installment === void 0) { total_installment = "12"; }
    if (line_id === void 0) { line_id = ""; }
    return {
        type: "bubble",
        body: {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: "แจ้งเตือน",
                    weight: "bold",
                    size: "xl",
                    contents: [],
                },
                {
                    type: "text",
                    text: "คุณมีกำหนดชำระสินเชื่อ",
                    color: "#666666",
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "lg",
                    spacing: "sm",
                    contents: [
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "สินเชื่อ",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: planName,
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 2,
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "เลขที่สัญญา",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: loan_number,
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 2,
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "ยอดกู้",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: loan_amount,
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 2,
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "ยอดคงเหลือ",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: loan_remaining,
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 2,
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "จำนวน",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: amount,
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 2,
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "กำหนดชำระ",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: date,
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 2,
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "งวดที่",
                                    color: "#aaaaaa",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: "".concat(installment, "/").concat(total_installment),
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 2,
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "*กรุณาชำระภายในวันที่กำหนด",
                            color: "#ff0000",
                            size: "xs",
                            margin: "md",
                        },
                    ],
                },
            ],
        },
        footer: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
                {
                    type: "button",
                    style: "primary",
                    height: "sm",
                    color: "#DBAE5B",
                    action: {
                        type: "uri",
                        label: "ชำระเงิน",
                        uri: "".concat(process.env.USER_DOMAIN, "/payment/").concat(encodeURIComponent(loan_number), "/").concat(encodeURIComponent(amount.replace(/[^\d.]/g, ""))),
                    },
                },
                // {
                //   type: "button",
                //   style: "primary",
                //   height: "sm",
                //   color: "#DBAE5B",
                //   action: {
                //     type: "postback",
                //     label: "ชำระเงิน",
                //     displayText:"ขอ QR Code ชำระเงินค่างวด",
                //     data: `?from=${encodeURIComponent(
                //       line_id
                //     )}&loan_number=${encodeURIComponent(
                //       loan_number
                //     )}&amount=${encodeURIComponent(
                //       amount.replace(/[^\d.]/g, "")
                //     )}`,
                //   },
                // },
                {
                    type: "box",
                    layout: "vertical",
                    contents: [],
                    margin: "sm",
                },
            ],
            flex: 0,
        },
    };
};
var Line_SendNotificateCharge = function (to, planName, loan_number, amount, date) {
    if (to === void 0) { to = "Ud75689398caa0a79d6a26faa0ae71fe4"; }
    if (planName === void 0) { planName = "Easy Loans"; }
    if (loan_number === void 0) { loan_number = "ABC12345"; }
    if (amount === void 0) { amount = "1,250 บาท"; }
    if (date === void 0) { date = "12 สิงหาคม 2567"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var __content, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __content = {
                        type: "bubble",
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "แจ้งเตือน",
                                    weight: "bold",
                                    size: "xl",
                                    contents: [],
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "สินเชื่อ",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: planName,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "เลขที่สัญญา",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: loan_number,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "จำนวน",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: amount,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "กำหนดชำระ",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: date,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "*การชำระหนี้ของคุณเกินเวลาที่กำหนด ทางบริษัทจะมีการคิดค่าทวงถาม ตามเงื่อนไขที่กำหนด ",
                                                    wrap: true,
                                                    color: "#FF0000",
                                                    size: "sm",
                                                    flex: 6,
                                                },
                                            ],
                                        },
                                    ],
                                    margin: "lg",
                                },
                            ],
                            margin: "lg",
                        },
                        footer: {
                            type: "box",
                            layout: "vertical",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "button",
                                    style: "primary",
                                    height: "sm",
                                    action: {
                                        type: "uri",
                                        label: "เรียนรู้เพิ่มเติม",
                                        uri: "https://www.moneyforyou.co.th/terms-conditions/",
                                    },
                                    color: "#DBAE5B",
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [],
                                    margin: "sm",
                                },
                            ],
                            flex: 0,
                        },
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: to,
                            messages: [
                                {
                                    type: "flex",
                                    altText: "แจ้งเตือนเกินกำหนดชำระ",
                                    contents: __content,
                                },
                            ],
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            },
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [2 /*return*/, err_2];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Line_SendNotificateCharge = Line_SendNotificateCharge;
var Line_SendNotificate = function (to, planName, loan_number, amount, date, installment, total_installment) {
    if (to === void 0) { to = "Ud75689398caa0a79d6a26faa0ae71fe4"; }
    if (planName === void 0) { planName = "Easy Loans"; }
    if (loan_number === void 0) { loan_number = "ABC12345"; }
    if (amount === void 0) { amount = "1,250 บาท"; }
    if (date === void 0) { date = "12 สิงหาคม 2567"; }
    if (installment === void 0) { installment = "1"; }
    if (total_installment === void 0) { total_installment = "12"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var __content, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __content = {
                        type: "bubble",
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "แจ้งเตือน",
                                    weight: "bold",
                                    size: "xl",
                                    contents: [],
                                },
                                {
                                    type: "text",
                                    text: "คุณมีกำหนดชำระสินเชื่อ",
                                    color: "#666666",
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    margin: "lg",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "สินเชื่อ",
                                                    color: "#aaaaaa",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                                {
                                                    type: "text",
                                                    text: planName,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "เลขที่สัญญา",
                                                    color: "#aaaaaa",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                                {
                                                    type: "text",
                                                    text: loan_number,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "จำนวน",
                                                    color: "#aaaaaa",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                                {
                                                    type: "text",
                                                    text: amount,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "กำหนดชำระ",
                                                    color: "#aaaaaa",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                                {
                                                    type: "text",
                                                    text: date,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "งวดที่",
                                                    color: "#aaaaaa",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                                {
                                                    type: "text",
                                                    text: "".concat(installment, "/").concat(total_installment),
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "*กรุณาชำระภายในวันที่กำหนด",
                                            color: "#ff0000",
                                            size: "xs",
                                            margin: "md",
                                        },
                                    ],
                                },
                            ],
                        },
                        footer: {
                            type: "box",
                            layout: "vertical",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "button",
                                    style: "primary",
                                    height: "sm",
                                    action: {
                                        type: "uri",
                                        label: "ชำระสินเชื่อ",
                                        uri: process.env.REDIRECT_URI,
                                    },
                                    color: "#DBAE5B",
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [],
                                    margin: "sm",
                                },
                            ],
                            flex: 0,
                        },
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: to,
                            messages: [
                                {
                                    type: "flex",
                                    altText: "แจ้งเตือนครบกำหนดชำระ",
                                    contents: __content,
                                },
                            ],
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            },
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [2 /*return*/, err_3];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Line_SendNotificate = Line_SendNotificate;
var Line_Reject = function (to, loan_plan, amount, name, reason) {
    if (to === void 0) { to = "Ud75689398caa0a79d6a26faa0ae71fe4"; }
    if (loan_plan === void 0) { loan_plan = "Easy Loans"; }
    if (amount === void 0) { amount = "50,000 บาท"; }
    if (name === void 0) { name = "ทดสอบระบบ"; }
    if (reason === void 0) { reason = ""; }
    return __awaiter(void 0, void 0, void 0, function () {
        var __content, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __content = {
                        type: "bubble",
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: __spreadArray(__spreadArray([
                                {
                                    type: "text",
                                    text: "แจ้งเตือน",
                                    weight: "bold",
                                    size: "xl",
                                },
                                {
                                    type: "text",
                                    text: "การขอสินเชื่อถูกปฏิเสธ",
                                    color: "#ff0000",
                                }
                            ], (reason
                                ? [
                                    {
                                        type: "text",
                                        text: "*\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38: ".concat(reason),
                                        wrap: true,
                                        color: "#000000",
                                        margin: "sm",
                                    },
                                ]
                                : []), true), [
                                {
                                    type: "box",
                                    layout: "vertical",
                                    margin: "lg",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "สินเชื่อ: ",
                                                    color: "#000000",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                                {
                                                    type: "text",
                                                    text: loan_plan,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 5,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            margin: "lg",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "box",
                                                    layout: "baseline",
                                                    spacing: "sm",
                                                    contents: [
                                                        {
                                                            type: "text",
                                                            text: "ยอดกู้: ",
                                                            color: "#000000",
                                                            size: "sm",
                                                            flex: 2,
                                                        },
                                                        {
                                                            type: "text",
                                                            text: amount,
                                                            wrap: true,
                                                            color: "#666666",
                                                            size: "sm",
                                                            flex: 5,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            margin: "lg",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "box",
                                                    layout: "baseline",
                                                    spacing: "sm",
                                                    contents: [
                                                        {
                                                            type: "text",
                                                            text: "ผู้กู้: ",
                                                            color: "#000000",
                                                            size: "sm",
                                                            flex: 2,
                                                        },
                                                        {
                                                            type: "text",
                                                            text: name,
                                                            wrap: true,
                                                            color: "#666666",
                                                            size: "sm",
                                                            flex: 5,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ], false),
                        },
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: to,
                            messages: [
                                {
                                    type: "flex",
                                    altText: "แจ้งเตือนการปฎิเสธสินเชื่อ",
                                    contents: __content,
                                },
                            ],
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            },
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_4 = _a.sent();
                    console.log(err_4);
                    return [2 /*return*/, err_4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Line_Reject = Line_Reject;
var Line_Approve = function (to, loan_plan, loan_number, amount, total_installment, name, date) {
    if (to === void 0) { to = "Ud75689398caa0a79d6a26faa0ae71fe4"; }
    if (loan_plan === void 0) { loan_plan = "Easy Loans"; }
    if (loan_number === void 0) { loan_number = "6ACCF03FC1F9"; }
    if (amount === void 0) { amount = "50,000 บาท"; }
    if (total_installment === void 0) { total_installment = "12"; }
    if (name === void 0) { name = "ทดสอบระบบ"; }
    if (date === void 0) { date = "12 สิงหาคม 2567"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var __content, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __content = {
                        type: "bubble",
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "แจ้งเตือน",
                                    weight: "bold",
                                    size: "xl",
                                },
                                {
                                    type: "text",
                                    text: "การขอสินเชื่อได้รับการอนุมัติแล้ว",
                                    color: "#008000",
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    margin: "lg",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "สินเชื่อ: ",
                                                    color: "#000000",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                                {
                                                    type: "text",
                                                    text: loan_plan,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 5,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "เลขที่สัญญา: ",
                                                    color: "#000000",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                                {
                                                    type: "text",
                                                    text: loan_number,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 5,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            margin: "lg",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "box",
                                                    layout: "baseline",
                                                    spacing: "sm",
                                                    contents: [
                                                        {
                                                            type: "text",
                                                            text: "ยอดกู้: ",
                                                            color: "#000000",
                                                            size: "sm",
                                                            flex: 2,
                                                        },
                                                        {
                                                            type: "text",
                                                            text: amount,
                                                            wrap: true,
                                                            color: "#666666",
                                                            size: "sm",
                                                            flex: 5,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            margin: "lg",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "box",
                                                    layout: "baseline",
                                                    spacing: "sm",
                                                    contents: [
                                                        {
                                                            type: "text",
                                                            text: "จำนวนงวด: ",
                                                            color: "#000000",
                                                            size: "sm",
                                                            flex: 2,
                                                        },
                                                        {
                                                            type: "text",
                                                            text: total_installment,
                                                            wrap: true,
                                                            color: "#666666",
                                                            size: "sm",
                                                            flex: 5,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "vertical",
                                            margin: "lg",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "box",
                                                    layout: "baseline",
                                                    spacing: "sm",
                                                    contents: [
                                                        {
                                                            type: "text",
                                                            text: "ผู้กู้: ",
                                                            color: "#000000",
                                                            size: "sm",
                                                            flex: 2,
                                                        },
                                                        {
                                                            type: "text",
                                                            text: name,
                                                            wrap: true,
                                                            color: "#666666",
                                                            size: "sm",
                                                            flex: 5,
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            margin: "lg",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "วันที่อนุมัติ:",
                                                    color: "#000000",
                                                    size: "sm",
                                                    flex: 2,
                                                },
                                                {
                                                    type: "text",
                                                    text: date,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 5,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: to,
                            messages: [
                                {
                                    type: "flex",
                                    altText: "แจ้งเตือนการอนุมัติสินเชื่อ",
                                    contents: __content,
                                },
                            ],
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            },
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_5 = _a.sent();
                    console.log(err_5);
                    return [2 /*return*/, err_5];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Line_Approve = Line_Approve;
var Line_KYC_Apply = function (to, fullname, approve_at /*ครอบ toDate(new Date(),1)*/, status /* 0 = reject ,1 = approve  ใส่เป็น string*/, reason) {
    if (to === void 0) { to = "Ud75689398caa0a79d6a26faa0ae71fe4"; }
    if (fullname === void 0) { fullname = "แอดมิน - ทดสอบ"; }
    if (approve_at === void 0) { approve_at = "9 กันยายน 2024"; }
    if (status === void 0) { status = "1"; }
    if (reason === void 0) { reason = ""; }
    return __awaiter(void 0, void 0, void 0, function () {
        var __content, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __content = {
                        type: "bubble",
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "ยืนยันตัวตน",
                                    weight: "bold",
                                    size: "xl",
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    margin: "lg",
                                    spacing: "sm",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "ชื่อ",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                                {
                                                    type: "text",
                                                    text: fullname,
                                                    wrap: true,
                                                    size: "sm",
                                                    flex: 5,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "วันที่",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                                {
                                                    type: "text",
                                                    text: approve_at,
                                                    wrap: true,
                                                    size: "sm",
                                                    flex: 5,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    margin: "md",
                                    contents: [
                                        {
                                            type: "text",
                                            text: status == "1" ? "อนุมัติแล้ว" : "ถูกปฏิเสธ",
                                            color: status == "1" ? "#198754" : "#eb0000",
                                            flex: 0,
                                            wrap: true,
                                            weight: "bold",
                                            size: "xl",
                                        },
                                    ],
                                },
                            ],
                        },
                    };
                    if (status == "0" && reason)
                        __content.body.contents.push({
                            type: "box",
                            layout: "baseline",
                            margin: "md",
                            contents: [
                                {
                                    type: "text",
                                    text: "*\u0E2A\u0E32\u0E40\u0E2B\u0E15\u0E38 : ".concat(reason),
                                    color: "#000000",
                                    flex: 0,
                                    wrap: true,
                                    weight: "bold",
                                    size: "sm",
                                },
                            ],
                        });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: to,
                            messages: [
                                {
                                    type: "flex",
                                    altText: "แจ้งเตือนการยืนยันตัวตน",
                                    contents: __content,
                                },
                            ],
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            },
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_6 = _a.sent();
                    console.log(err_6);
                    return [2 /*return*/, err_6];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Line_KYC_Apply = Line_KYC_Apply;
var Line_SendSlip = function (to, loan_plan, biller_number, loan_number, date, installment, orders, total, paid) {
    if (to === void 0) { to = "Ud75689398caa0a79d6a26faa0ae71fe4"; }
    if (loan_plan === void 0) { loan_plan = "Easy Loans"; }
    if (biller_number === void 0) { biller_number = "b244123"; }
    if (loan_number === void 0) { loan_number = "ab123456"; }
    if (date === void 0) { date = "12 สิงหาคม 2567"; }
    if (installment === void 0) { installment = "1/2"; }
    if (orders === void 0) { orders = [
        {
            name: "เงินต้น",
            amount: "1,250 บาท",
        },
        {
            name: "ดอกเบี้ย",
            amount: "125 บาท",
        },
        {
            name: "ค่าทวงถาม",
            amount: "0 บาท",
        },
    ]; }
    if (total === void 0) { total = "1,400 บาท"; }
    if (paid === void 0) { paid = "วลีศิลป์"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var __orders, __content, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __orders = orders.map(function (order) {
                        return {
                            type: "box",
                            layout: "baseline",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: order.name,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 1,
                                },
                                {
                                    type: "text",
                                    text: order.amount,
                                    wrap: true,
                                    color: "#666666",
                                    size: "sm",
                                    flex: 1,
                                },
                            ],
                        };
                    });
                    __content = {
                        type: "bubble",
                        body: {
                            type: "box",
                            layout: "vertical",
                            contents: [
                                {
                                    type: "text",
                                    text: "ใบเสร็จ",
                                    weight: "bold",
                                    size: "xl",
                                    contents: [],
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "เลขที่",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: biller_number,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "เลขที่สัญญา",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: loan_number,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "สินเชื่อ",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: loan_plan,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "วันที่",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: date,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "งวดที่",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: installment,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                    ],
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: "รายการ",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: "จำนวนเงิน",
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    weight: "bold",
                                                },
                                            ],
                                        },
                                    ],
                                    margin: "lg",
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    margin: "sm",
                                    spacing: "sm",
                                    contents: __orders,
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                    text: "รวม",
                                                    weight: "bold",
                                                },
                                                {
                                                    type: "text",
                                                    text: total,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 1,
                                                },
                                            ],
                                        },
                                    ],
                                    margin: "md",
                                },
                                {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "box",
                                            layout: "baseline",
                                            spacing: "sm",
                                            contents: [
                                                {
                                                    type: "text",
                                                    text: paid,
                                                    wrap: true,
                                                    color: "#666666",
                                                    size: "sm",
                                                    flex: 6,
                                                },
                                            ],
                                        },
                                    ],
                                    margin: "lg",
                                },
                            ],
                            margin: "lg",
                        },
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: to,
                            messages: [
                                {
                                    type: "flex",
                                    altText: "การชำระเงินสำเร็จขอบคุณที่ทำรายการ",
                                    contents: __content,
                                },
                            ],
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            },
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_7 = _a.sent();
                    console.log(err_7);
                    return [2 /*return*/, err_7];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Line_SendSlip = Line_SendSlip;
//ปิงเพิ่ม
var Line_SendNotificateDue = function (to, planName, loan_number, amount, date, installment, total_installment, loan_amount, loan_remaining) {
    if (to === void 0) { to = "Ud75689398caa0a79d6a26faa0ae71fe4"; }
    if (planName === void 0) { planName = "Easy Loans"; }
    if (loan_number === void 0) { loan_number = "ABC12345"; }
    if (amount === void 0) { amount = "1,250 บาท"; }
    if (date === void 0) { date = "12 สิงหาคม 2567"; }
    if (installment === void 0) { installment = "1"; }
    if (total_installment === void 0) { total_installment = "12"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var __content, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    __content = contentCheckSlip(planName, loan_number, loan_amount, loan_remaining, amount, date, installment, total_installment, to);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                            to: to,
                            messages: [
                                {
                                    type: "flex",
                                    altText: "แจ้งเตือนครบกำหนดชำระ",
                                    contents: __content,
                                },
                            ],
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            },
                        })];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_8 = _a.sent();
                    console.log(err_8);
                    return [2 /*return*/, err_8];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.Line_SendNotificateDue = Line_SendNotificateDue;
