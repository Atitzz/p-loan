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
exports.deleteGuarantee = exports.updateGuarantee = exports.getGuaranteeId = exports.getGuarantee = exports.addGuarantee = exports.deleteProperty = exports.updateProperty = exports.getPropertyId = exports.getProperty = exports.addProperty = void 0;
var data_source_1 = require("../../../data-source");
var loan_guarantee_1 = require("../entities/loan_guarantee");
var loan_property_1 = require("../entities/loan_property");
var typeorm_1 = require("typeorm");
// ประเภท หลักประกัน
var addProperty = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, created_at, updated_at, deleted_at, obj, property, lastProperty, newIndex, newproperty, savedProperty, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at"]);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (!obj.name) {
                    return [2 /*return*/, res.error("กรุณาระบุชื่อประเภท")];
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).findOne({ where: { name: obj.name } })];
            case 2:
                property = _b.sent();
                if (property)
                    return [2 /*return*/, res.error('มีประเภทหลักประกันนี้อยู่แล้ว')];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).findOne({
                        where: {},
                        order: { index: 'DESC' }
                    })];
            case 3:
                lastProperty = _b.sent();
                newIndex = lastProperty ? lastProperty.index + 1 : 1;
                newproperty = new loan_property_1.LoanProperty();
                newproperty.name = obj.name;
                newproperty.index = newIndex;
                return [4 /*yield*/, newproperty.createLog(req, "create", "loan_property", obj)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).save(newproperty)];
            case 5:
                savedProperty = _b.sent();
                return [2 /*return*/, res.success('เพิ่มประเภทหลักประกันสำเร็จ', savedProperty)];
            case 6:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.addProperty = addProperty;
var getProperty = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, perPage, offset, trimmedSearch, whereClause, _total, property, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                trimmedSearch = search.trim().replace(/\s+/g, ' ');
                whereClause = {};
                if (search) {
                    whereClause = { name: (0, typeorm_1.Like)("%".concat(trimmedSearch, "%")) };
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).count({ where: whereClause })];
            case 2:
                _total = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).find({
                        where: whereClause,
                        take: perPage,
                        skip: offset,
                        order: { index: 'ASC' }
                    })];
            case 3:
                property = _b.sent();
                if (!property)
                    return [2 /*return*/, res.error('ไม่พบหลักประกัน')];
                return [2 /*return*/, res.success('ประเภทหลักประกันทั้งหมด', property, _total)];
            case 4:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getProperty = getProperty;
var getPropertyId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, property, guarantees, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).findOne({ where: { id: _id } })];
            case 2:
                property = _a.sent();
                if (!property)
                    return [2 /*return*/, res.error('ไม่พบหลักประกัน')];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).find({
                        where: { type: property.name },
                        order: { index: 'ASC' }
                    })];
            case 3:
                guarantees = _a.sent();
                return [2 /*return*/, res.success('หลักประกัน', { property: property, guarantees: guarantees })];
            case 4:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getPropertyId = getPropertyId;
var updateProperty = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, obj, _id, property, guarantees, _i, guarantees_1, guarantee, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                obj = __rest(req.body, []);
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).findOne({ where: { id: _id } })];
            case 2:
                property = _a.sent();
                if (!property)
                    return [2 /*return*/, res.error('ไม่ประเภทพบหลักประกัน')];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).find({ where: { type: property.name } })];
            case 3:
                guarantees = _a.sent();
                if (obj.name) {
                    property.name = obj.name;
                }
                if (obj.index) {
                    property.index = obj.index;
                }
                return [4 /*yield*/, property.createLog(req, "update", "loan_property", obj)];
            case 4:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).save(property)];
            case 5:
                _a.sent();
                if (!(guarantees.length > 0)) return [3 /*break*/, 9];
                _i = 0, guarantees_1 = guarantees;
                _a.label = 6;
            case 6:
                if (!(_i < guarantees_1.length)) return [3 /*break*/, 9];
                guarantee = guarantees_1[_i];
                guarantee.type = obj.name;
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).save(guarantee)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/, res.success('แก้ไขประเภทหลักประกันสำเร็จ', property)];
            case 10:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.updateProperty = updateProperty;
var deleteProperty = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, property, guarantees, _i, guarantees_2, guarantee, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 10, , 11]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).findOne({ where: { id: _id } })];
            case 2:
                property = _a.sent();
                if (!property)
                    return [2 /*return*/, res.error('ไม่พบหลักประกัน')];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).find({ where: { type: property.name } })];
            case 3:
                guarantees = _a.sent();
                if (!(guarantees.length > 0)) return [3 /*break*/, 7];
                _i = 0, guarantees_2 = guarantees;
                _a.label = 4;
            case 4:
                if (!(_i < guarantees_2.length)) return [3 /*break*/, 7];
                guarantee = guarantees_2[_i];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).delete(guarantee.id)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 4];
            case 7: return [4 /*yield*/, property.createLog(req, "remove", "loan_property", property)];
            case 8:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_property_1.LoanProperty).delete(_id)];
            case 9:
                _a.sent();
                return [2 /*return*/, res.success('ลบหลักประกันสำเร็จ', property)];
            case 10:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.deleteProperty = deleteProperty;
// หลักประกัน
var addGuarantee = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, created_at, updated_at, deleted_at, obj, lastGuarantee, newIndex, guarantee, newGuarantee, savedGuarantee, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at"]);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (!obj.type) {
                    return [2 /*return*/, res.error("กรุณาเลือกประเภท")];
                }
                if (!obj.name) {
                    return [2 /*return*/, res.error("กรุณาระบุชื่อหลักประกัน")];
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).findOne({
                        where: { type: obj.type },
                        order: { index: 'DESC' }
                    })];
            case 2:
                lastGuarantee = _b.sent();
                newIndex = lastGuarantee ? lastGuarantee.index + 1 : 1;
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).findOne({ where: { name: obj.name, type: obj.type } })];
            case 3:
                guarantee = _b.sent();
                if (guarantee)
                    return [2 /*return*/, res.error('มีหลักประกันนี้อยู่แล้ว')];
                newGuarantee = new loan_guarantee_1.LoanGuarantee();
                newGuarantee.type = obj.type;
                newGuarantee.name = obj.name;
                newGuarantee.index = newIndex;
                return [4 /*yield*/, newGuarantee.createLog(req, "create", "loan_guarantee", obj)];
            case 4:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).save(newGuarantee)];
            case 5:
                savedGuarantee = _b.sent();
                return [2 /*return*/, res.success('เพิ่มหลักประกันสำเร็จ', savedGuarantee)];
            case 6:
                err_6 = _b.sent();
                console.log(err_6);
                return [2 /*return*/, res.error(err_6.detail || err_6.routine)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.addGuarantee = addGuarantee;
var getGuarantee = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, perPage, offset, whereClause, _total, guarantee, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                whereClause = {};
                if (search) {
                    whereClause.name = (0, typeorm_1.Like)("%".concat(search, "%"));
                }
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).count({ where: whereClause })];
            case 2:
                _total = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).find({
                        where: whereClause,
                        take: perPage,
                        skip: offset,
                        order: { type: 'DESC', index: 'ASC' },
                    })];
            case 3:
                guarantee = _b.sent();
                if (!guarantee)
                    return [2 /*return*/, res.error('ไม่พบหลักประกัน')];
                return [2 /*return*/, res.success('หลักประกันทั้งหมด', guarantee, _total)];
            case 4:
                err_7 = _b.sent();
                console.log(err_7);
                return [2 /*return*/, res.error(err_7.detail || err_7.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getGuarantee = getGuarantee;
var getGuaranteeId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, guarantee, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).findOne({ where: { id: _id } })];
            case 2:
                guarantee = _a.sent();
                if (!guarantee)
                    return [2 /*return*/, res.error('ไม่พบหลักประกัน')];
                return [2 /*return*/, res.success('หลักประกัน', guarantee)];
            case 3:
                err_8 = _a.sent();
                console.log(err_8);
                return [2 /*return*/, res.error(err_8.detail || err_8.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGuaranteeId = getGuaranteeId;
var updateGuarantee = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, obj, _id, guarantee, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                obj = __rest(req.body, []);
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).findOne({ where: { id: _id } })];
            case 2:
                guarantee = _a.sent();
                if (!guarantee)
                    return [2 /*return*/, res.error('ไม่พบหลักประกัน')];
                guarantee.type = obj.type || guarantee.type;
                guarantee.name = obj.name || guarantee.name;
                if (obj.index !== undefined) {
                    guarantee.index = obj.index;
                }
                return [4 /*yield*/, guarantee.createLog(req, "update", "loan_guarantee", obj)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).save(guarantee)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('แก้ไขหลักประกันสำเร็จ', guarantee)];
            case 5:
                err_9 = _a.sent();
                console.log(err_9);
                return [2 /*return*/, res.error(err_9.detail || err_9.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateGuarantee = updateGuarantee;
var deleteGuarantee = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, guarantee, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).findOne({ where: { id: _id } })];
            case 2:
                guarantee = _a.sent();
                if (!guarantee)
                    return [2 /*return*/, res.error('ไม่พบหลักประกัน')];
                return [4 /*yield*/, guarantee.createLog(req, "remove", "loan_guarantee", guarantee)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_guarantee_1.LoanGuarantee).delete(_id)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('ลบหลักประกันสำเร็จ', guarantee)];
            case 5:
                err_10 = _a.sent();
                console.log(err_10);
                return [2 /*return*/, res.error(err_10.detail || err_10.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteGuarantee = deleteGuarantee;
