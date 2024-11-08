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
exports.class_checker = exports.Catch = exports.Error = exports.Custom = exports.Success = exports.warper = exports.errorHandle = exports.isSuperAdmin = exports.isShow = exports.isReject = exports.isApprove = exports.isRemove = exports.isUpdate = exports.isStore = exports.isManageUsers = exports.isList = exports.isAdmin = exports.usePIN = exports.AccessUsers = exports.AccessToken = void 0;
var jwt = require("jsonwebtoken");
var data_source_1 = require("../data-source");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
function AccessToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var token, __token, decoded, query, params, users, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = req.headers["authorization"];
                    if (!token) return [3 /*break*/, 3];
                    __token = token.split(" ")[1];
                    decoded = jwt.verify(__token, process.env.SERECT_KEY);
                    if (!decoded) return [3 /*break*/, 2];
                    query = "\n              SELECT\n                  u.*,\n                  uat.token,\n                  uat.expires_at,\n                  JSON_ARRAYAGG(\n                      JSON_OBJECT('key', r.key, 'name', r.name)\n                  ) AS roles,\n                      JSON_OBJECT(\n                          'key',\n                          p.key,\n                          'name',\n                          p.name,\n                          'approve',\n                          p.approve,\n                          'reject',\n                          p.reject,\n                          'show',\n                          p.show,\n                          'list',\n                          p.list,\n                          'store',\n                          p.store,\n                          'update',\n                          p.update,\n                          'remove',\n                          p.remove,\n                           'manage_users',\n                          p.manage_users\n                  ) AS permissions\n              FROM\n                  (\n                  SELECT\n                      *\n                  FROM\n                      users_access_token\n                  WHERE\n                      token = ? AND deleted_at IS NULL\n              ) uat\n              LEFT JOIN system_users u ON\n                  u.id = uat.userid\n              LEFT JOIN system_roles_users_system_users mr ON\n                  mr.systemUsersId = uat.userid\n              LEFT JOIN system_roles r ON\n                  r.id = mr.systemRolesId\n              LEFT JOIN system_permissions p ON\n                  p.id = u.permissionsId\n              GROUP BY\n                  u.id,\n                  uat.token,\n                  uat.expires_at;\n      ";
                    params = [__token];
                    return [4 /*yield*/, data_source_1.AppDataSource.query(query, params)];
                case 1:
                    users = _a.sent();
                    if (users.length < 1)
                        return [2 /*return*/, res.error("กรุณาเข้าสู่ระบบ!")];
                    if (users[0].expires_at > Date.now()) {
                        req.user = users[0];
                        return [2 /*return*/, next()];
                    }
                    else
                        return [2 /*return*/, res.error("โทเค็นหมดอายุ!")];
                    _a.label = 2;
                case 2: return [2 /*return*/, res.error("การเข้าสู่ระบบผิดพลาด!")];
                case 3: return [2 /*return*/, res.error("โทเค็นไม่ถูกต้อง!")];
                case 4:
                    err_1 = _a.sent();
                    console.log(err_1);
                    if (err_1 === null || err_1 === void 0 ? void 0 : err_1.expiredAt)
                        return [2 /*return*/, res.error("โทเค็นหมดอายุ!")];
                    else
                        return [2 /*return*/, res.error("การเข้าสู่ระบบผิดพลาด!")];
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.AccessToken = AccessToken;
function AccessUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var token, __token, decoded, query, params, users, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = req.headers["authorization"];
                    if (!token) return [3 /*break*/, 3];
                    __token = token.split(" ")[1];
                    decoded = jwt.verify(__token, process.env.USER_SERECT_KEY);
                    if (!decoded) return [3 /*break*/, 2];
                    query = "\n               SELECT\n                  u.*,\n                  uat.token,\n                  uat.expires_at,\n                  JSON_ARRAYAGG(\n                      JSON_OBJECT('key', r.key, 'name', r.name)\n                  ) AS roles,\n                      JSON_OBJECT(\n                          'key',\n                          p.key,\n                          'name',\n                          p.name,\n                          'approve',\n                          p.approve,\n                          'reject',\n                          p.reject,\n                          'show',\n                          p.show,\n                          'list',\n                          p.list,\n                          'store',\n                          p.store,\n                          'update',\n                          p.update,\n                          'remove',\n                          p.remove,\n                           'manage_users',\n                          p.manage_users\n                  ) AS permissions\n              FROM\n                  (\n                  SELECT\n                      *\n                  FROM\n                      users_access_token\n                  WHERE\n                      token = ? AND deleted_at IS NULL\n              ) uat\n              LEFT JOIN system_users u ON\n                  u.id = uat.userid\n              LEFT JOIN system_roles_users_system_users mr ON\n                  mr.systemUsersId = uat.userid\n              LEFT JOIN system_roles r ON\n                  r.id = mr.systemRolesId\n              LEFT JOIN system_permissions p ON\n                  p.id = u.permissionsId\n              GROUP BY\n                  u.id,\n                  uat.token,\n                  uat.expires_at;\n      ";
                    params = [__token];
                    return [4 /*yield*/, data_source_1.AppDataSource.query(query, params)];
                case 1:
                    users = _a.sent();
                    if (users.length < 1)
                        return [2 /*return*/, res.error("กรุณาเข้าสู่ระบบ!")];
                    if (users[0].expires_at > Date.now()) {
                        req.user = users[0];
                        if (req.user.id === null)
                            return [2 /*return*/, res.error("ไม่พบโทเค็น!")];
                        return [2 /*return*/, next()];
                    }
                    else
                        return [2 /*return*/, res.error("โทเค็นหมดอายุ!")];
                    _a.label = 2;
                case 2: return [2 /*return*/, res.error("การเข้าสู่ระบบผิดพลาด!")];
                case 3: return [2 /*return*/, res.error("ไม่พบโทเค็น!")];
                case 4:
                    err_2 = _a.sent();
                    console.log(err_2);
                    if (err_2 === null || err_2 === void 0 ? void 0 : err_2.expiredAt)
                        return [2 /*return*/, res.error("โทเค็นหมดอายุ!")];
                    else
                        return [2 /*return*/, res.error("การเข้าสู่ระบบผิดพลาด!")];
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.AccessUsers = AccessUsers;
var usePIN = function (req, res, next) {
    var user = req.user;
    var pin = req.headers["x-sign-pin"];
    if (user.pa == "enable") {
        if (user.pin != pin)
            return res.error("รหัส PIN ไม่ถูกต้อง!");
    }
    next();
};
exports.usePIN = usePIN;
var isAdmin = function (keys) { return function (req, res, next) {
    var _a;
    if (!Array.isArray(keys))
        return res.error("roles request array!");
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.roles))
        return res.error("username invalid!");
    var isRole = false;
    var _loop_1 = function (key) {
        if (req.user.roles.find(function (x) { return String(x.key).toLowerCase() === String(key).toLowerCase(); })) {
            isRole = true;
        }
    };
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        _loop_1(key);
    }
    if (isRole)
        return next();
    return res.error("roles deny!");
}; };
exports.isAdmin = isAdmin;
var isList = function (req, res, next) {
    if (req.user.permissions.list !== "true")
        return res.error("permission list deny!");
    return next();
};
exports.isList = isList;
var isManageUsers = function (req, res, next) {
    if (req.user.permissions.manage_users !== "true")
        return res.error("permission manage users deny!");
    return next();
};
exports.isManageUsers = isManageUsers;
var isStore = function (req, res, next) {
    if (req.user.permissions.store !== "true")
        return res.error("permission store deny!");
    return next();
};
exports.isStore = isStore;
var isUpdate = function (req, res, next) {
    if (req.user.permissions.update !== "true")
        return res.error("permission update deny!");
    return next();
};
exports.isUpdate = isUpdate;
var isRemove = function (req, res, next) {
    if (req.user.permissions.remove !== "true")
        return res.error("permission remove deny!");
    return next();
};
exports.isRemove = isRemove;
var isApprove = function (req, res, next) {
    if (req.user.permissions.approve !== "true")
        return res.error("permission approve deny!");
    return next();
};
exports.isApprove = isApprove;
var isReject = function (req, res, next) {
    if (req.user.permissions.reject !== "true")
        return res.error("permission reject deny!");
    return next();
};
exports.isReject = isReject;
var isShow = function (req, res, next) {
    if (req.user.permissions.show !== "true")
        return res.error("permission show deny!");
    return next();
};
exports.isShow = isShow;
var isSuperAdmin = function (req, res, next) {
    if (req.user.roles.find(function (x) { return String(x.key).toLowerCase() === "superadmin"; })) {
        return next();
    }
    return res.error("roles deny!");
};
exports.isSuperAdmin = isSuperAdmin;
function errorHandle(err, req, res, next) {
    console.log(err);
    return res.catch("Internal Server Error");
}
exports.errorHandle = errorHandle;
function warper(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}
exports.warper = warper;
var Success = function (req, res, next) {
    var _a = req.query, page = _a.page, limit = _a.limit;
    var perPage = parseInt(limit) || 20;
    var offset = parseInt(page) || 0;
    res.success = function (msg, data, total) {
        return res.json({
            system_response: {
                status: 200,
                message: msg || "Success",
                data_type: !Array.isArray(data) ? "object" : "array",
            },
            data: data || {},
            pages: {
                page: offset,
                total: total || 1,
                limit: perPage,
            },
        });
    };
    return next();
};
exports.Success = Success;
var Custom = function (req, res, next) {
    var _a = req.query, page = _a.page, limit = _a.limit;
    var perPage = parseInt(limit) || 20;
    var offset = parseInt(page) || 0;
    res.custom = function (status, msg, data, total) {
        return res.status(400).json({
            system_response: {
                status: status,
                message: msg || "Custom",
                data_type: !Array.isArray(data) ? "object" : "array",
            },
            data: data || {},
            pages: {
                page: offset,
                total: total || 1,
                limit: perPage,
            },
        });
    };
    return next();
};
exports.Custom = Custom;
var Error = function (req, res, next) {
    var _a = req.query, page = _a.page, limit = _a.limit;
    var perPage = parseInt(limit) || 1;
    var offset = parseInt(page) || 0;
    res.error = function (msg, data, total) {
        if (data === void 0) { data = []; }
        return res.status(400).json({
            system_response: {
                status: 400,
                message: msg || "Invalid",
                data_type: !Array.isArray(data) ? "object" : "array",
            },
            data: data || [],
            pages: {
                page: offset,
                total: total || 0,
                limit: perPage,
            },
        });
    };
    return next();
};
exports.Error = Error;
var Catch = function (req, res, next) {
    var _a = req.query, page = _a.page, limit = _a.limit;
    var perPage = parseInt(limit) || 1;
    var offset = parseInt(page) || 0;
    res.catch = function (msg, data, total) {
        return res.status(400).json({
            system_response: {
                status: 500,
                message: msg || "Internal Server Error",
                data_type: !Array.isArray(data) ? "object" : "array",
            },
            data: data || {},
            pages: {
                page: offset,
                total: total || 0,
                limit: perPage,
            },
        });
    };
    return next();
};
exports.Catch = Catch;
var class_checker = function (className) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var instance, errors, customErrors, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    instance = (0, class_transformer_1.plainToClass)(className, req.body);
                    return [4 /*yield*/, (0, class_validator_1.validate)(instance)];
                case 1:
                    errors = _a.sent();
                    if (errors.length > 0) {
                        customErrors = errors.map(function (error) { return ({
                            field: error.property,
                            message: Object.values(error.constraints).join(", "),
                        }); });
                        return [2 /*return*/, res.error("Data validation failed", customErrors)];
                    }
                    next(); // หลังจากตรวจสอบผ่าน validation ให้เรียกฟังก์ชันถัดไป
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error in class_checker middleware:", error_1);
                    return [2 /*return*/, res.catch("Internal Server Error")];
                case 3: return [2 /*return*/];
            }
        });
    }); };
};
exports.class_checker = class_checker;
