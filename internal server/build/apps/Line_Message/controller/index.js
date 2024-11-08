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
exports.manualSlip = exports.manualNotificate = exports.manualCharge = exports.manualReject = exports.manualApprove = exports.store = exports.callPayment = void 0;
var axios_1 = require("axios");
var controller_1 = require("../../PaymentGateway/controller");
var module_1 = require("../module");
var path = require("path");
var Utils_1 = require("../../../Utils");
var example = {
    destination: "xxxxxxxxxx",
    events: [
        {
            type: "message",
            message: {
                type: "text",
                id: "468789577898262530",
                quotedMessageId: "468789532432007169",
                quoteToken: "q3Plxr4AgKd...",
                text: "Chicken, please.", // Text of the sent message
            },
            webhookEventId: "01H810YECXQQZ37VAXPF6H9E6T",
            deliveryContext: {
                isRedelivery: false,
            },
            timestamp: 1692251666727,
            source: {
                type: "group",
                groupId: "Ca56f94637c...",
                userId: "U4af4980629...",
            },
            replyToken: "38ef843bde154d9b91c21320ffd17a0f",
            mode: "active",
        },
    ],
};
var callPayment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, from, loan_number, amount, result, filePath;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, from = _a.from, loan_number = _a.loan_number, amount = _a.amount;
                return [4 /*yield*/, (0, controller_1.LineCreateQR)({
                        loan_number: loan_number,
                        amount: amount,
                    })];
            case 1:
                result = _b.sent();
                // let message;
                // if (result)
                //   message = [
                //     {
                //       type: "image",
                //       originalContentUrl: String(result),
                //       previewImageUrl: String(result),
                //     },
                //   ];
                // else
                //   message = [
                //     {
                //       type: "text",
                //       text: "ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก",
                //     },
                //   ];
                // try {
                //   await axios.post(
                //     "https://api.line.me/v2/bot/message/push",
                //     {
                //       to: from,
                //       messages: message,
                //     },
                //     {
                //       headers: {
                //         "Content-Type": "application/json",
                //         Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
                //       },
                //     }
                //   );
                // } catch (err) {
                //   console.log(err);
                //   return res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก");
                // }
                if (result) {
                    filePath = path.join(__dirname, "../../../uploads", result.replace("".concat(process.env.USER_DOMAIN, "/file/"), ""));
                    return [2 /*return*/, res.download(filePath, result.replace("".concat(process.env.USER_DOMAIN, "/file/qrcode/"), ""), function (err) {
                            if (err) {
                                console.log(err);
                                return res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก");
                            }
                        })];
                }
                else
                    return [2 /*return*/, res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก")];
                return [2 /*return*/];
        }
    });
}); };
exports.callPayment = callPayment;
var store = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, destination, events, __event, __userId, data, params, loan_number, amount, result, message, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, destination = _a.destination, events = _a.events;
                __event = events[0];
                __userId = __event.source.userId;
                if (!(__event.type === "message")) return [3 /*break*/, 3];
                if (!(__event.message.text == "เช็คยอด")) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, module_1.Call_Balance)(__userId)];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2: return [3 /*break*/, 8];
            case 3:
                if (!(__event.type === "postback")) return [3 /*break*/, 8];
                data = __event.postback.data;
                params = new URLSearchParams(data);
                loan_number = params.get("loan_number");
                amount = params.get("amount");
                return [4 /*yield*/, (0, controller_1.LineCreateQR)({
                        loan_number: loan_number,
                        amount: amount,
                    })];
            case 4:
                result = _b.sent();
                message = void 0;
                if (result)
                    message = [
                        {
                            type: "image",
                            originalContentUrl: String(result),
                            previewImageUrl: String(result),
                        },
                        {
                            type: "text",
                            text: "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E2A\u0E31\u0E0D\u0E0D\u0E32 ".concat(loan_number),
                        },
                        {
                            type: "text",
                            text: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E40\u0E07\u0E34\u0E19 ".concat((0, Utils_1.toTHB)(amount)),
                        },
                        {
                            type: "text",
                            text: "QR CODE \u0E19\u0E35\u0E49\u0E21\u0E35\u0E2D\u0E32\u0E22\u0E38\u0E01\u0E32\u0E23\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19 10 \u0E19\u0E32\u0E17\u0E35",
                        },
                    ];
                else
                    message = [
                        {
                            type: "text",
                            text: "ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก",
                        },
                    ];
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/push", {
                        to: __userId,
                        messages: message,
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                        },
                    })];
            case 6:
                _b.sent();
                return [3 /*break*/, 8];
            case 7:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก")];
            case 8: return [2 /*return*/, res.success("success", events)];
        }
    });
}); };
exports.store = store;
var manualApprove = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, planName, amount, name;
    return __generator(this, function (_b) {
        _a = req.body, to = _a.to, planName = _a.planName, amount = _a.amount, name = _a.name;
        try {
            (0, module_1.Line_Approve)(to, planName, amount, name);
            return [2 /*return*/, res.success()];
        }
        catch (err) {
            return [2 /*return*/, res.error(err)];
        }
        return [2 /*return*/];
    });
}); };
exports.manualApprove = manualApprove;
var manualReject = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, planName, amount, name;
    return __generator(this, function (_b) {
        _a = req.body, to = _a.to, planName = _a.planName, amount = _a.amount, name = _a.name;
        try {
            (0, module_1.Line_Reject)(to, planName, amount, name);
            return [2 /*return*/, res.success()];
        }
        catch (err) {
            return [2 /*return*/, res.error(err)];
        }
        return [2 /*return*/];
    });
}); };
exports.manualReject = manualReject;
var manualCharge = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, to, planName, loan_number, amount, date;
    return __generator(this, function (_b) {
        _a = req.body, to = _a.to, planName = _a.planName, loan_number = _a.loan_number, amount = _a.amount, date = _a.date;
        try {
            (0, module_1.Line_SendNotificateCharge)(to, planName, loan_number, amount, date);
            return [2 /*return*/, res.success()];
        }
        catch (err) {
            return [2 /*return*/, res.error(err)];
        }
        return [2 /*return*/];
    });
}); };
exports.manualCharge = manualCharge;
var manualNotificate = function (req, res) {
    var _a = req.body, to = _a.to, planName = _a.planName, loan_number = _a.loan_number, amount = _a.amount, date = _a.date;
    try {
        (0, module_1.Line_SendNotificate)(to, planName, loan_number, amount, date);
        return res.success();
    }
    catch (err) {
        return res.error(err);
    }
};
exports.manualNotificate = manualNotificate;
var manualSlip = function (req, res) {
    var _a = req.body, to = _a.to, planName = _a.planName, loan_number = _a.loan_number, amount = _a.amount, date = _a.date;
    try {
        (0, module_1.Line_SendSlip)();
        return res.success();
    }
    catch (err) {
        return res.error(err);
    }
};
exports.manualSlip = manualSlip;
