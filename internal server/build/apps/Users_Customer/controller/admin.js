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
exports.show = exports.list = exports.update = exports.store = void 0;
var typeorm_1 = require("typeorm");
var data_source_1 = require("../../../data-source");
var entities_1 = require("../../Users/entities");
var entities_2 = require("../../KYC/entities");
var __1 = require("../../..");
var store = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, password, permission, roles, created_at, updated_at, deleted_at, imgBack, imgBook, imgFront, obj, __existed, Keys, data, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, username = _a.username, password = _a.password, permission = _a.permission, roles = _a.roles, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, imgBack = _a.imgBack, imgBook = _a.imgBook, imgFront = _a.imgFront, obj = __rest(_a, ["id", "username", "password", "permission", "roles", "created_at", "updated_at", "deleted_at", "imgBack", "imgBook", "imgFront"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({
                        where: {
                            mobile: obj.mobile,
                        },
                    })];
            case 1:
                __existed = _b.sent();
                Keys = Object.keys(obj);
                if (__existed)
                    return [2 /*return*/, res.error("ผู้ใช้งานมีการลงทะเบียนไว้แล้ว!", [{ field: "mobile", message: "ผู้ใช้งานมีการลงทะเบียนไว้แล้ว!" }])];
                data = new entities_1.Users();
                Keys.forEach(function (key) {
                    data[key] = obj[key];
                });
                _b.label = 2;
            case 2:
                _b.trys.push([2, 6, , 7]);
                return [4 /*yield*/, data.createLog(req, "create", "Users", __assign(__assign({}, obj), { imgBack: '', imgBook: '', imgFront: '' }))];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(data)];
            case 4:
                result = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_KYC).save(__assign(__assign({}, obj), { status: "pending", imgBack: imgBack, imgBook: imgBook, imgFront: imgFront, user_id: result.id }))];
            case 5:
                _b.sent();
                delete result.password;
                delete result.pin;
                __1.io.emit('users', { action: 1 });
                return [2 /*return*/, res.success("Create Successfully!", result)];
            case 6:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.store = store;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, username, password, permission, roles, created_at, updated_at, deleted_at, obj, data, Keys, data_1, result, err_2;
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
                if (!data)
                    return [2 /*return*/, res.error("404 not found")];
                Keys.forEach(function (key) {
                    data[key] = obj[key];
                });
                if (!(String(obj.kyc).toLowerCase() == "unverified")) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_KYC).findOne({
                        where: {
                            user_id: id,
                        },
                    })];
            case 2:
                data_1 = _b.sent();
                if (!data_1) return [3 /*break*/, 4];
                data_1.status = "pending";
                return [4 /*yield*/, (0, data_source_1.orm)(entities_2.Users_KYC).save(data_1)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _b.trys.push([4, 7, , 8]);
                return [4 /*yield*/, data.createLog(req, "update", "Users", __assign(__assign({}, data), { imgBack: '', imgBook: '', imgFront: '' }))];
            case 5:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).save(data)];
            case 6:
                result = _b.sent();
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("Update Successfully!", result)];
            case 7:
                err_2 = _b.sent();
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var list = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, status, ev, sv, kyc, _b, search, page, limit, perPage, offset, whereClause, _total, existed;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.params, status = _a.status, ev = _a.ev, sv = _a.sv, kyc = _a.kyc;
                _b = req.query, search = _b.search, page = _b.page, limit = _b.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = {};
                if (search)
                    whereClause.firstname = (0, typeorm_1.Like)("%".concat(search, "%"));
                if (status)
                    whereClause.status = String(status).toLowerCase();
                if (ev)
                    whereClause.ev = String(ev).toLowerCase();
                if (sv)
                    whereClause.sv = String(sv).toLowerCase();
                if (kyc)
                    whereClause.kyc = String(kyc).toLowerCase();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).count({ where: whereClause })];
            case 1:
                _total = _c.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).find({
                        where: whereClause,
                        order: { id: "DESC" },
                        take: perPage,
                        skip: offset,
                    })];
            case 2:
                existed = _c.sent();
                return [2 /*return*/, res.success("Get Successfully", existed.map(function (_a) {
                        var password = _a.password, accesstoken = _a.accesstoken, permissions = _a.permissions, user = __rest(_a, ["password", "accesstoken", "permissions"]);
                        return user;
                    }), _total)];
        }
    });
}); };
exports.list = list;
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!id) {
                    return [2 /*return*/, (0, exports.list)(req, res)];
                }
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: id } })];
            case 1:
                result = _a.sent();
                if (!result)
                    return [2 /*return*/, res.error('ไม่พบลูกค้าดังกล่าว!')];
                delete result.password;
                delete result.pin;
                return [2 /*return*/, res.success("Get Successfully", result)];
        }
    });
}); };
exports.show = show;
// export const show = async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return list(req, res);
//   }
//   const query = `
// WITH user_transactions AS (
//     SELECT
//         user_id,
//         SUM(balance) AS total_balance,
//         SUM(deposits) AS total_deposits,
//         SUM(withdrawals) AS total_withdrawals,
//         COUNT(id) AS transactions_count
//     FROM
//         users_transactions
//     WHERE
//         user_id = ?
//     GROUP BY
//         user_id
// )
// SELECT
//     u.*,
//     COALESCE(ut.total_balance, 0) AS balance,
//     COALESCE(ut.total_deposits, 0) AS deposits,
//     COALESCE(ut.total_withdrawals, 0) AS withdrawals,
//     COALESCE(ut.transactions_count, 0) AS transactions,
//     SUM(CASE WHEN LOWER(lp.status) = 'pending' THEN 1 ELSE 0 END) AS loan_pending,
//     SUM(CASE WHEN LOWER(lp.status) = 'running' THEN 1 ELSE 0 END) AS loan_running,
//     SUM(CASE WHEN LOWER(lp.status) = 'due' THEN 1 ELSE 0 END) AS loan_due,
//     SUM(CASE WHEN LOWER(lp.status) = 'pain' THEN 1 ELSE 0 END) AS loan_pain,
//     SUM(CASE WHEN LOWER(lp.status) = 'reject' THEN 1 ELSE 0 END) AS loan_reject
// FROM
//     system_users u
// LEFT JOIN
//     loan lp ON lp.user_id = u.id
// LEFT JOIN
//     user_transactions ut ON ut.user_id = u.id
// WHERE
//     u.id = ?
//     `;
//   const result = await AppDataSource.manager.query(query, [id, id]);
//   const __data = result[0];
//   delete __data.password;
//   delete __data.pin;
//   return res.success("Get Successfully", __data);
// };
