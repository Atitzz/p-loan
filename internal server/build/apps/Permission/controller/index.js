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
exports.remove = exports.show = exports.list = exports.update = exports.store = void 0;
var typeorm_1 = require("typeorm");
var data_source_1 = require("../../../data-source");
var entities_1 = require("../entities");
var store = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, roles, created_at, updated_at, deleted_at, obj, Keys, data, result, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, roles = _a.roles, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "roles", "created_at", "updated_at", "deleted_at"]);
                Keys = Object.keys(obj);
                data = new entities_1.Permissions();
                Keys.forEach(function (key) {
                    data[key] = obj[key];
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, data.createLog(req, "store", "Permissions", obj)];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).save(data)];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.success("Created Successfully!", result)];
            case 4:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.store = store;
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, key, created_at, updated_at, deleted_at, obj, data, Keys, result, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, key = _a.key, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "key", "created_at", "updated_at", "deleted_at"]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).findOne({
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
                    if (data[key])
                        data[key] = obj[key];
                });
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                return [4 /*yield*/, data.createLog(req, "update", "Permissions", obj)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).save(data)];
            case 4:
                result = _b.sent();
                return [2 /*return*/, res.success("Update Successfully!", result)];
            case 5:
                err_2 = _b.sent();
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.update = update;
var list = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, perPage, offset, whereClause, _total, existed;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = {};
                if (search) {
                    whereClause.name = (0, typeorm_1.Like)("%".concat(search, "%"));
                }
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).count({ where: whereClause })];
            case 1:
                _total = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).find({
                        where: whereClause,
                        take: perPage,
                        skip: offset,
                    })];
            case 2:
                existed = _b.sent();
                return [2 /*return*/, res.success("Get Successfully", existed, _total)];
        }
    });
}); };
exports.list = list;
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!id)
                    return [2 /*return*/, res.error("404 not found")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).findOne({
                        where: { id: id },
                    })];
            case 1:
                data = _a.sent();
                if (!data)
                    return [2 /*return*/, res.error("404 not found")];
                return [2 /*return*/, res.success("Successfully!", data)];
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
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).findOne({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                data = _a.sent();
                if (!data)
                    return [2 /*return*/, res.error("404 not found")];
                return [4 /*yield*/, data.createLog(req, "remove", "Permissions", data)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Permissions).delete(id)];
            case 3:
                _a.sent();
                return [2 /*return*/, res.success("Deleted Successfully!", data)];
        }
    });
}); };
exports.remove = remove;
