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
exports.connectCallback = exports.LineConnect = exports.callback = exports.LineRevoke = exports.login = void 0;
var uuidv4_1 = require("uuidv4");
var axios_1 = require("axios");
var qs = require("qs");
var jwt = require("jsonwebtoken");
var entities_1 = require("../../Users/entities");
var data_source_1 = require("../../../data-source");
var entities_2 = require("../../Users_AccessToken/entities");
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mobile, state, lineLoginUrl;
    return __generator(this, function (_a) {
        mobile = req.params.mobile;
        state = (0, uuidv4_1.uuid)();
        if (mobile)
            state = mobile;
        lineLoginUrl = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=".concat(process.env.LINE_CHANNEL_ID, "&redirect_uri=").concat(encodeURIComponent(process.env.CALLBACK_URI), "&state=").concat(state, "&scope=profile%20openid%20email");
        res.redirect(lineLoginUrl);
        return [2 /*return*/];
    });
}); };
exports.login = login;
var LineRevoke = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var existingUser, token, __token, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                    where: { id: req.user.id },
                })];
            case 1:
                existingUser = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__assign(__assign({}, existingUser), { line_id: null, la: "disable" }))];
            case 2:
                _a.sent();
                token = req.headers['authorization'];
                __token = token.split(' ')[1];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).findOne({
                        where: {
                            token: __token
                        },
                    })];
            case 3:
                data = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).softDelete(data.id)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success("ยกเลิกการเชื่อมต่อ Line สำเร็จ!")];
        }
    });
}); };
exports.LineRevoke = LineRevoke;
var callback = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, code, state, tokenResponse, access_token, profileResponse, profile, existingUser, accessToken, __user, accessToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, code = _a.code, state = _a.state;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                return [4 /*yield*/, axios_1.default.post("https://api.line.me/oauth2/v2.1/token", qs.stringify({
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: process.env.CALLBACK_URI,
                        client_id: process.env.LINE_CHANNEL_ID,
                        client_secret: process.env.LINE_CHANNEL_SECRET,
                    }), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    })];
            case 2:
                tokenResponse = _b.sent();
                access_token = tokenResponse.data.access_token;
                return [4 /*yield*/, axios_1.default.get("https://api.line.me/v2/profile", {
                        headers: {
                            Authorization: "Bearer ".concat(access_token),
                        },
                    })];
            case 3:
                profileResponse = _b.sent();
                profile = profileResponse.data;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: { line_id: profile.userId },
                    })];
            case 4:
                existingUser = _b.sent();
                if (!existingUser) return [3 /*break*/, 7];
                // สร้าง session หรือใช้ตัวแทนในระบบ
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__assign(__assign({}, existingUser), { display_name: profile.displayName, picture_url: profile.pictureUrl }))];
            case 5:
                // สร้าง session หรือใช้ตัวแทนในระบบ
                _b.sent();
                accessToken = jwt.sign({ id: existingUser.id }, process.env.SERECT_KEY, {
                    expiresIn: "1d",
                });
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).save({
                        token: accessToken,
                        userid: existingUser.id,
                        last_used_at: new Date(),
                        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
                    })];
            case 6:
                _b.sent();
                return [2 /*return*/, res.redirect("".concat(process.env.REDIRECT_URI, "/line/").concat(accessToken))];
            case 7: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save({
                    line_id: profile.userId,
                    display_name: profile.displayName,
                    picture_url: profile.pictureUrl,
                    la: "enable",
                })];
            case 8:
                __user = _b.sent();
                accessToken = jwt.sign({ id: __user.id }, process.env.SERECT_KEY, {
                    expiresIn: "1d",
                });
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).save({
                        token: accessToken,
                        userid: __user.id,
                        last_used_at: new Date(),
                        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
                    })];
            case 9:
                _b.sent();
                return [2 /*return*/, res.redirect("".concat(process.env.REDIRECT_URI, "/line/").concat(accessToken))];
            case 10: return [3 /*break*/, 12];
            case 11:
                error_1 = _b.sent();
                console.log(error_1);
                res.status(500).json(error_1.response.data);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.callback = callback;
var LineConnect = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var lineLoginUrl;
    return __generator(this, function (_a) {
        lineLoginUrl = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=".concat(process.env.LINE_CHANNEL_ID, "&redirect_uri=").concat(encodeURIComponent(process.env.CONNECT_URI), "&state=").concat(req.user.id, "&scope=profile%20openid%20email");
        res.success("redirect", { url: lineLoginUrl });
        return [2 /*return*/];
    });
}); };
exports.LineConnect = LineConnect;
var connectCallback = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, code, state, tokenResponse, access_token, profileResponse, profile, existingUser, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, code = _a.code, state = _a.state;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, axios_1.default.post("https://api.line.me/oauth2/v2.1/token", qs.stringify({
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: process.env.CONNECT_URI,
                        client_id: process.env.LINE_CHANNEL_ID,
                        client_secret: process.env.LINE_CHANNEL_SECRET,
                    }), {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                    })];
            case 2:
                tokenResponse = _b.sent();
                access_token = tokenResponse.data.access_token;
                return [4 /*yield*/, axios_1.default.get("https://api.line.me/v2/profile", {
                        headers: {
                            Authorization: "Bearer ".concat(access_token),
                        },
                    })];
            case 3:
                profileResponse = _b.sent();
                profile = profileResponse.data;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: { id: state },
                    })];
            case 4:
                existingUser = _b.sent();
                if (!existingUser)
                    res.error("User not found");
                // const existingLine = await orm(Users).find({
                //   where: { line_id: profile.userId },
                // });
                // if(existingLine) return res.redirect(`${process.env.REDIRECT_URI}/line/existed`);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__assign(__assign({}, existingUser), { line_id: profile.userId, display_name: profile.displayName, picture_url: profile.pictureUrl, la: "enable" }))];
            case 5:
                // const existingLine = await orm(Users).find({
                //   where: { line_id: profile.userId },
                // });
                // if(existingLine) return res.redirect(`${process.env.REDIRECT_URI}/line/existed`);
                _b.sent();
                return [2 /*return*/, res.redirect("".concat(process.env.REDIRECT_URI, "/profile/manage"))];
            case 6:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, res.redirect("".concat(process.env.REDIRECT_URI, "/profile/manage"))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.connectCallback = connectCallback;
