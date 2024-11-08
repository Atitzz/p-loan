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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTP = exports.getOTP = exports.verifyOTP = void 0;
var axios_1 = require("axios");
var data_source_1 = require("../../../data-source");
var entities_1 = require("../../Users/entities");
var entities_2 = require("../entities");
var Utils_1 = require("../../../Utils");
var entities_3 = require("../../Users_AccessToken/entities");
// export const requestOTP = async (req,res) =>{
//   const {mobile} = req.params;
//   const __existUser = await orm(Users).findOne({where:{mobile:mobile}});
//   if(!__existUser) return res.error('หมายเลขโทรศัพท์ไม่ถูกต้อง');
//   if(__existUser.la === 'enable') return res.error('หมายเลขโทรศัพท์นี้ลงทะเบียนแล้ว');
//   return res.success('โปรดระบุรหัส OTP ที่ได้รับ',{token:'xxx'})
// }
var verifyOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, mobile, otp_code, __existUsers, __existSMS, response, __existRegisted, token, __token, __existToken, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, mobile = _a.mobile, otp_code = _a.otp_code;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: id } })];
            case 1:
                __existUsers = _b.sent();
                if (!__existUsers)
                    return [2 /*return*/, res.error('ไม่พบข้อมูลผู้ใช้งาน')];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_SMS).findOne({ where: { mobile: mobile } })];
            case 2:
                __existSMS = _b.sent();
                if (!__existSMS)
                    return [2 /*return*/, res.error('กรุณาขอรหัส OTP ก่อนทำรายการ')];
                _b.label = 3;
            case 3:
                _b.trys.push([3, 15, , 16]);
                return [4 /*yield*/, axios_1.default.post("".concat(process.env.SMS_ENDPOINT, "/otp-sms/verify"), {
                        token: __existSMS.token,
                        otp_code: otp_code
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(process.env.SMS_KEY)
                        },
                    })];
            case 4:
                response = _b.sent();
                if (!response.data.data.is_valid)
                    return [2 /*return*/, res.error(response.data.data.message)];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { mobile: mobile } })];
            case 5:
                __existRegisted = _b.sent();
                if (!__existRegisted) return [3 /*break*/, 12];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__assign(__assign({}, __existRegisted), { line_id: __existUsers.line_id, display_name: __existUsers.display_name, picture_url: __existUsers.picture_url, mobile: mobile, username: __existUsers.username == null ? mobile : __existUsers.username, sv: 'verified' }))];
            case 6:
                _b.sent();
                token = req.headers['authorization'];
                if (!token) return [3 /*break*/, 9];
                __token = token.split(' ')[1];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_3.UsersAccessToken).findOne({ where: { token: __token } })];
            case 7:
                __existToken = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_3.UsersAccessToken).save(__assign(__assign({}, __existToken), { userid: __existRegisted.id }))];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                if (!(__existUsers.id !== __existRegisted.id)) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).delete(id)];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11: return [3 /*break*/, 14];
            case 12: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__assign(__assign({}, __existUsers), { mobile: mobile, username: __existUsers.username == null ? mobile : __existUsers.username, sv: 'verified' }))];
            case 13:
                _b.sent();
                _b.label = 14;
            case 14:
                result = __assign(__assign({}, req.user), { status: true });
                delete result.password;
                delete result.pin;
                delete result.line_id;
                delete result.token;
                delete result.roles;
                delete result.permissions;
                result.mobile = (0, Utils_1.obfuscateTel)(mobile);
                res.success("ขอบคุณที่ทำรายการ", result);
                return [3 /*break*/, 16];
            case 15:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error("การทำรายการไม่สำเร็จ")];
            case 16: return [2 /*return*/];
        }
    });
}); };
exports.verifyOTP = verifyOTP;
var getOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mobile, data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                mobile = req.params.mobile;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_SMS).findOne({ where: { mobile: mobile } })];
            case 1:
                data = _a.sent();
                return [2 /*return*/, res.success("Successfully", data)];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getOTP = getOTP;
var resendOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mobile, __random, response, __existSMS, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                mobile = req.body.mobile;
                __random = (0, Utils_1.Random_String)(6);
                if (!mobile)
                    return [2 /*return*/, res.error("กรุณากรอกหมายเลขโทรศัพท์")];
                return [4 /*yield*/, axios_1.default.post("".concat(process.env.SMS_ENDPOINT, "/otp-sms/send"), {
                        recipient: mobile,
                        sender_name: process.env.SMS_SENDER,
                        ref_code: __random,
                        custom_message: "OTP: {otp} (Ref:{refcode}) \u0E01\u0E23\u0E38\u0E13\u0E32\u0E17\u0E33\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E20\u0E32\u0E22\u0E43\u0E19\u0E40\u0E27\u0E25\u0E32 {validity} \u0E19\u0E32\u0E17\u0E35 \u0E2B\u0E49\u0E32\u0E21\u0E41\u0E08\u0E49\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E01\u0E31\u0E1A\u0E1A\u0E38\u0E04\u0E04\u0E25\u0E2D\u0E37\u0E48\u0E19\u0E17\u0E38\u0E01\u0E01\u0E23\u0E13\u0E35"
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(process.env.SMS_KEY)
                        },
                    })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_SMS).findOne({ where: { mobile: mobile } })];
            case 2:
                __existSMS = _a.sent();
                if (!__existSMS) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_SMS).save(__assign(__assign({}, __existSMS), { ref_code: __random, token: response.data.data.token }))];
            case 3:
                __existSMS = _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_SMS).save({
                    mobile: mobile,
                    ref_code: __random,
                    token: response.data.data.token
                })];
            case 5:
                __existSMS = _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/, res.success("Successfully", __existSMS)];
            case 7:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.resendOTP = resendOTP;
