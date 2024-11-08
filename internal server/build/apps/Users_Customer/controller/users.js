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
exports.logout = exports.loginUsers = exports.acceptPrivacy = exports.register = exports.setPIN = exports.verifyPIN = exports.setPassword = exports.changePasswords = exports.current = void 0;
var data_source_1 = require("../../../data-source");
var entities_1 = require("../../Users/entities");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var entities_2 = require("../../Users_AccessToken/entities");
var Utils_1 = require("../../../Utils");
var current = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        result = __assign(__assign({}, req.user), { status: true });
        delete result.password;
        delete result.pin;
        delete result.line_id;
        delete result.token;
        delete result.roles;
        delete result.permissions;
        result.mobile = (0, Utils_1.obfuscateTel)(result.mobile);
        return [2 /*return*/, res.success("get user", result)];
    });
}); };
exports.current = current;
var changePasswords = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, mobile, password, newPassword, created_at, updated_at, deleted_at, obj, __existUsers, passwordIsValid, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, username = _a.username, mobile = _a.mobile, password = _a.password, newPassword = _a.newPassword, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "username", "mobile", "password", "newPassword", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            id: req.user.id,
                        },
                    })];
            case 1:
                __existUsers = _b.sent();
                if (!__existUsers)
                    return [2 /*return*/, res.error("กรุณาเข้าสู่ระบบ!", [])];
                passwordIsValid = bcrypt.compareSync(password, __existUsers.password);
                if (!passwordIsValid)
                    return [2 /*return*/, res.error("รหัสผ่านไม่ถูกต้อง")];
                __existUsers.password = bcrypt.hashSync(newPassword, 8);
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, __existUsers.createLog(req, "changePassword", "Users", obj)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__existUsers)];
            case 4:
                result = _b.sent();
                delete result.password;
                return [2 /*return*/, res.success("เปลี่ยนรหัสผ่านเสร็จสิ้น!", result)];
            case 5:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.changePasswords = changePasswords;
var setPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, mobile, password, created_at, updated_at, deleted_at, obj, __existUsers, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, username = _a.username, mobile = _a.mobile, password = _a.password, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "username", "mobile", "password", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            id: req.user.id,
                        },
                    })];
            case 1:
                __existUsers = _b.sent();
                if (!__existUsers)
                    return [2 /*return*/, res.error("กรุณาเข้าสู่ระบบ!", [])];
                __existUsers.password = bcrypt.hashSync(password, 8);
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, __existUsers.createLog(req, "setPassword", "Users", obj)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__existUsers)];
            case 4:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("ตั้งรหัสผ่านเสร็จสิ้น!", result)];
            case 5:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.setPassword = setPassword;
var verifyPIN = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pin;
    return __generator(this, function (_a) {
        pin = req.body.pin;
        if (req.user.pa == "enable") {
            if (req.user.pin != pin)
                return [2 /*return*/, res.error("รหัส PIN ไม่ถูกต้อง!")];
        }
        return [2 /*return*/, res.success()];
    });
}); };
exports.verifyPIN = verifyPIN;
var setPIN = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, mobile, pin, created_at, updated_at, deleted_at, obj, __existUsers, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, username = _a.username, mobile = _a.mobile, pin = _a.pin, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "username", "mobile", "pin", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            id: req.user.id,
                        },
                    })];
            case 1:
                __existUsers = _b.sent();
                if (!__existUsers)
                    return [2 /*return*/, res.error("กรุณาเข้าสู่ระบบ!", [])];
                __existUsers.pin = pin;
                __existUsers.pa = "enable";
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, __existUsers.createLog(req, "setPIN", "Users", obj)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__existUsers)];
            case 4:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("ตั้งรหัสผ่านเสร็จสิ้น!", result)];
            case 5:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.setPIN = setPIN;
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, mobile, password, created_at, updated_at, deleted_at, obj, __existUsers, Keys, data, result, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, username = _a.username, mobile = _a.mobile, password = _a.password, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "username", "mobile", "password", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            mobile: mobile,
                        },
                    })];
            case 1:
                __existUsers = _b.sent();
                if (__existUsers)
                    return [2 /*return*/, res.error("หมายเลขของคุณลงทะเบียนแล้ว!", [
                            { field: "mobile", message: "หมายเลขของคุณลงทะเบียนแล้ว" },
                        ])];
                Keys = Object.keys(obj);
                data = new entities_1.Users();
                Keys.forEach(function (key) {
                    data[key] = obj[key];
                });
                data.mobile = mobile;
                data.password = bcrypt.hashSync(password, 8);
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, data.createLog(req, "register", "Users", obj)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(data)];
            case 4:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                // await orm(Users_Email).save({
                //   from: process.env.GMAIL_USER,
                //   to: data.email,
                //   user_id: result.id,
                //   token: token,
                // });
                // send_mail(
                //   data.email,
                //   "email verification",
                //   htmlEmailVerify(
                //     `${process.env.USER_DOMAIN}/activated?token=${token}`,
                //     data.username
                //   )
                // );
                return [2 /*return*/, res.success("สมัครสมาชิกสำเร็จ!", result)];
            case 5:
                err_4 = _b.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
var acceptPrivacy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var version, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                version = req.body.version;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: req.user.id } })];
            case 1:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.error("ไม่พบผู้ใช้งานในระบบ")];
                user.accept_privacy = version;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(user)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.success("Accept Successfully!", {})];
        }
    });
}); };
exports.acceptPrivacy = acceptPrivacy;
var loginUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mobile, password, user, passwordIsValid, accessToken, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, mobile = _a.mobile, password = _a.password;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { mobile: mobile } })];
            case 1:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.error("หมายเลขโทรศัพท์ หรือ รหัสผ่านไม่ถูกต้อง")];
                if (!user.password)
                    return [2 /*return*/, res.error("กรุณาเข้าสู่ระบบผ่าน Line")];
                passwordIsValid = bcrypt.compareSync(password, user.password);
                if (!passwordIsValid)
                    return [2 /*return*/, res.error("หมายเลขโทรศัพท์ หรือ รหัสผ่านไม่ถูกต้อง")];
                if (user.status === "banned")
                    return [2 /*return*/, res.error("".concat(user.status, ", ").concat(user.ban_reason))];
                if (user.sv === "unverified")
                    return [2 /*return*/, res.custom(900, "\u0E01\u0E23\u0E38\u0E13\u0E32\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C", {
                            url: "otp/".concat(user.mobile),
                        })];
                accessToken = jwt.sign({}, process.env.USER_SERECT_KEY, {
                    expiresIn: "1d",
                });
                user.accesstoken = accessToken;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).save({
                        token: accessToken,
                        userid: user.id,
                        last_used_at: new Date(),
                        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(user)];
            case 3:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("Login Successfully!", __assign({}, result))];
        }
    });
}); };
exports.loginUsers = loginUsers;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                accessToken = jwt.sign({ id: req.user.id }, process.env.USER_SERECT_KEY, {
                    expiresIn: "1s",
                });
                req.user.accesstoken = accessToken;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(req.user)];
            case 1:
                _a.sent();
                return [2 /*return*/, res.success("logged out successfully")];
        }
    });
}); };
exports.logout = logout;
