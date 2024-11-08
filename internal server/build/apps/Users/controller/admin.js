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
exports.remove = exports.show = exports.list = exports.update = exports.store = exports.addRoles = exports.logout = exports.loginAdmin = exports.current = void 0;
var typeorm_1 = require("typeorm");
var data_source_1 = require("../../../data-source");
var Menu_1 = require("../../Sidebars/entities/Menu");
var entities_1 = require("../entities");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var entities_2 = require("../../Users_AccessToken/entities");
var entities_3 = require("../../Permission/entities");
var entities_4 = require("../../Roles/entities");
var Route_1 = require("../../Sidebars/entities/Route");
function current(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var __user, isRole, _loop_1, _i, _a, key, __menus, __route;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: { id: req.user.id },
                    })];
                case 1:
                    __user = _b.sent();
                    if (!__user)
                        return [2 /*return*/, res.error("unauth", { status: false })];
                    isRole = false;
                    _loop_1 = function (key) {
                        if (__user.roles.find(function (x) { return String(x.key).toLowerCase() === String(key).toLowerCase(); })) {
                            isRole = true;
                        }
                    };
                    for (_i = 0, _a = ['admin', 'employee']; _i < _a.length; _i++) {
                        key = _a[_i];
                        _loop_1(key);
                    }
                    if (!isRole)
                        return [2 /*return*/, res.error("roles deny!")];
                    if (!__user.permissions)
                        return [2 /*return*/, res.error("permissions deny!", { status: false })];
                    return [4 /*yield*/, (0, data_source_1.orm)(Menu_1.Menu)
                            .createQueryBuilder("menu")
                            .leftJoinAndSelect("menu.route", "route")
                            .leftJoinAndSelect("menu.permissions", "permissions")
                            .where("permissions.id = :permissionsId", {
                            permissionsId: __user.permissions.id,
                        })
                            .orderBy("menu.index", "ASC")
                            .addOrderBy("route.index", "ASC")
                            .getMany()];
                case 2:
                    __menus = _b.sent();
                    return [4 /*yield*/, (0, data_source_1.orm)(Route_1.Route).find({
                            where: {
                                type: "route",
                            },
                        })];
                case 3:
                    __route = _b.sent();
                    delete __user.password;
                    delete __user.accesstoken;
                    delete __user.pin;
                    __user.status = true;
                    return [2 /*return*/, res.success("Successfully!", __assign(__assign({}, __user), { sidebars: __menus, route: __route }))];
            }
        });
    });
}
exports.current = current;
var loginAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, user, isRole, _loop_2, _i, _b, key, passwordIsValid, accessToken, __menus, __route, result;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { username: username } })];
            case 1:
                user = _c.sent();
                if (!user)
                    return [2 /*return*/, res.error("username invalid!")];
                isRole = false;
                _loop_2 = function (key) {
                    if (user.roles.find(function (x) { return String(x.key).toLowerCase() === String(key).toLowerCase(); })) {
                        isRole = true;
                    }
                };
                for (_i = 0, _b = ['admin', 'employee']; _i < _b.length; _i++) {
                    key = _b[_i];
                    _loop_2(key);
                }
                if (!isRole)
                    return [2 /*return*/, res.error("roles deny!")];
                if (!user.permissions)
                    return [2 /*return*/, res.error("permissions deny!", { status: false })];
                passwordIsValid = bcrypt.compareSync(password, user.password);
                if (!passwordIsValid)
                    return [2 /*return*/, res.error("password invalid!")];
                if (user.status === "banned")
                    return [2 /*return*/, res.error("".concat(user.status, ", ").concat(user.ban_reason))];
                accessToken = jwt.sign({}, process.env.SERECT_KEY, {
                    expiresIn: "1d",
                });
                return [4 /*yield*/, (0, data_source_1.orm)(Menu_1.Menu)
                        .createQueryBuilder("menu")
                        .leftJoinAndSelect("menu.route", "route")
                        .leftJoinAndSelect("menu.permissions", "permissions")
                        .where("permissions.id = :permissionsId", {
                        permissionsId: user.permissions.id,
                    })
                        .orderBy("menu.index", "ASC")
                        .addOrderBy("route.index", "ASC")
                        .getMany()];
            case 2:
                __menus = _c.sent();
                user.accesstoken = accessToken;
                return [4 /*yield*/, (0, data_source_1.orm)(Route_1.Route).find({
                        where: {
                            type: "route",
                        },
                    })];
            case 3:
                __route = _c.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).save({
                        token: accessToken,
                        userid: user.id,
                        last_used_at: new Date(),
                        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
                    })];
            case 4:
                _c.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(user)];
            case 5:
                result = _c.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("Login Successfully!", __assign(__assign({}, result), { sidebars: __menus, route: __route }))];
        }
    });
}); };
exports.loginAdmin = loginAdmin;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).findOne({
                    where: {
                        token: req.user.token,
                    },
                })];
            case 1:
                data = _a.sent();
                if (!data)
                    return [2 /*return*/, res.error("404 not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.UsersAccessToken).softDelete(data.id)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.success("logged out successfully!", data)];
        }
    });
}); };
exports.logout = logout;
var addRoles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, permission, roles, created_at, updated_at, deleted_at, obj, __existUsers, __existPermissions, __existRoles, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, permission = _a.permission, roles = _a.roles, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "permission", "roles", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                __existUsers = _b.sent();
                if (!__existUsers)
                    return [2 /*return*/, res.error("user not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_3.Permissions).findOne({
                        where: { id: permission },
                    })];
            case 2:
                __existPermissions = _b.sent();
                __existUsers.permissions = __existPermissions;
                if (!permission)
                    __existUsers.permissions = null;
                if (!Array.isArray(roles))
                    return [2 /*return*/, res.error("roles request array!")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_4.Roles).find({ where: { key: (0, typeorm_1.In)(roles) } })];
            case 3:
                __existRoles = _b.sent();
                __existUsers.roles = __existRoles;
                _b.label = 4;
            case 4:
                _b.trys.push([4, 7, , 8]);
                return [4 /*yield*/, __existUsers.createLog(req, "add Role & permissions", "Users", { permission: permission, roles: roles })];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(__existUsers)];
            case 6:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("Update Successfully!", result)];
            case 7:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.addRoles = addRoles;
var store = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, password, permission, roles, created_at, updated_at, deleted_at, obj, __existUsers, __existPermissions, __existRoles, Keys, data, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, username = _a.username, password = _a.password, permission = _a.permission, roles = _a.roles, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "username", "password", "permission", "roles", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            username: username,
                        },
                    })];
            case 1:
                __existUsers = _b.sent();
                if (__existUsers)
                    return [2 /*return*/, res.error("dupplicated username")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_3.Permissions).findOne({
                        where: { id: permission },
                    })];
            case 2:
                __existPermissions = _b.sent();
                if (!__existPermissions)
                    return [2 /*return*/, res.error("permission not found")];
                if (!Array.isArray(roles))
                    return [2 /*return*/, res.error("roles request array!")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_4.Roles).find({ where: { id: (0, typeorm_1.In)(roles) } })];
            case 3:
                __existRoles = _b.sent();
                if (!__existRoles)
                    return [2 /*return*/, res.error("permission not found")];
                Keys = Object.keys(obj);
                data = new entities_1.Users();
                Keys.forEach(function (key) {
                    data[key] = obj[key];
                });
                data.username = username;
                data.password = bcrypt.hashSync(password, 8);
                data.permissions = __existPermissions;
                data.roles = __existRoles;
                _b.label = 4;
            case 4:
                _b.trys.push([4, 7, , 8]);
                return [4 /*yield*/, data.createLog(req, "store", "Users", obj)];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(data)];
            case 6:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("Created Successfully!", result)];
            case 7:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.store = store;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, password, permission, roles, created_at, updated_at, deleted_at, obj, data, Keys, __existPermissions, __existRoles, result, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, username = _a.username, password = _a.password, permission = _a.permission, roles = _a.roles, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "username", "password", "permission", "roles", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                data = _b.sent();
                Keys = Object.keys(obj);
                if (data)
                    return [2 /*return*/, res.error("404 not found")];
                Keys.forEach(function (key) {
                    if (data[key])
                        data[key] = obj[key];
                });
                if (password)
                    data.password = bcrypt.hashSync(password, 8);
                if (!permission) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_3.Permissions).findOne({
                        where: { id: permission },
                    })];
            case 2:
                __existPermissions = _b.sent();
                if (!__existPermissions)
                    return [2 /*return*/, res.error("permission not found")];
                data.permissions = __existPermissions;
                _b.label = 3;
            case 3:
                if (!roles) return [3 /*break*/, 5];
                if (!Array.isArray(roles))
                    return [2 /*return*/, res.error("roles request array!")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_4.Roles).find({ where: { id: (0, typeorm_1.In)(roles) } })];
            case 4:
                __existRoles = _b.sent();
                if (!__existRoles)
                    return [2 /*return*/, res.error("permission not found")];
                data.roles = __existRoles;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 8, , 9]);
                return [4 /*yield*/, data.createLog(req, "update", "Users", obj)];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(data)];
            case 7:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("Update Successfully!", result)];
            case 8:
                err_3 = _b.sent();
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var list = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status, ev, sv, kyc, _b, search, page, limit, perPage, offset, whereClause, queryBuilder, _total, existed;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.params, status = _a.status, ev = _a.ev, sv = _a.sv, kyc = _a.kyc;
                _b = req.query, search = _b.search, page = _b.page, limit = _b.limit;
                console.log(req.user);
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = {};
                if (search)
                    whereClause.firstname = (0, typeorm_1.Like)("%".concat(search, "%"));
                queryBuilder = (0, data_source_1.orm)(entities_1.Users)
                    .createQueryBuilder("user")
                    .leftJoinAndSelect("user.roles", "roles")
                    .leftJoinAndSelect("user.permissions", "permissions")
                    .where(whereClause)
                    .andWhere("roles.id IS NOT NULL");
                return [4 /*yield*/, queryBuilder.getCount()];
            case 1:
                _total = _c.sent();
                return [4 /*yield*/, queryBuilder
                        .orderBy("user.id", "DESC")
                        .take(perPage)
                        .skip(offset)
                        .getMany()];
            case 2:
                existed = _c.sent();
                return [2 /*return*/, res.success("Get Successfully", existed.map(function (_a) {
                        var password = _a.password, accesstoken = _a.accesstoken, user = __rest(_a, ["password", "accesstoken"]);
                        return user;
                    }), _total)];
        }
    });
}); };
exports.list = list;
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, query, result, __data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!id) {
                    return [2 /*return*/, (0, exports.list)(req, res)];
                }
                query = "\n        SELECT\n            u.*,\n            SUM(\n                CASE WHEN LOWER(lp.status) = 'pending' THEN 1 ELSE 0\n            END\n        ) AS loan_pending,\n        SUM(\n            CASE WHEN LOWER(lp.status) = 'running' THEN 1 ELSE 0\n        END\n        ) AS loan_running,\n        SUM(\n            CASE WHEN LOWER(lp.status) = 'due' THEN 1 ELSE 0\n        END\n        ) AS loan_due,\n        SUM(\n            CASE WHEN LOWER(lp.status) = 'pain' THEN 1 ELSE 0\n        END\n        ) AS loan_pain,\n        SUM(\n            CASE WHEN LOWER(lp.status) = 'reject' THEN 1 ELSE 0\n        END\n        ) AS loan_reject\n        FROM\n            (\n            SELECT\n                *\n            FROM\n                system_users\n            WHERE\n                id = ?\n        ) u\n        LEFT JOIN loan lp ON lp.user_id = u.id;\n  ";
                return [4 /*yield*/, data_source_1.AppDataSource.manager.query(query, [id, id])];
            case 1:
                result = _a.sent();
                __data = result[0];
                delete __data.password;
                delete __data.pin;
                return [2 /*return*/, res.success("Get Successfully", __data)];
        }
    });
}); };
exports.show = show;
var remove = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.query.id;
                if (!id)
                    return [2 /*return*/, res.error("404 not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                data = _a.sent();
                if (!data)
                    return [2 /*return*/, res.error("404 not found")];
                return [4 /*yield*/, data.createLog(req, "remove", "Users", data)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).delete(id)];
            case 3:
                _a.sent();
                return [2 /*return*/, res.success("Deleted Successfully!", data)];
        }
    });
}); };
exports.remove = remove;
