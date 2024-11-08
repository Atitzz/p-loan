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
exports.deletePolicyPage = exports.updatePolicyPage = exports.getPolicyPageById = exports.getPolicyPages = exports.createPolicyPage = void 0;
var frontend_1 = require("../entities/frontend");
var data_source_1 = require("../../../data-source");
// -------------------------------- Policy -------------------------------- //
// สร้างหน้า Policy ใหม่
var createPolicyPage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, dataKeys, dataValues, seoContent, tempname, slug, newPolicyPage, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, dataKeys = _a.dataKeys, dataValues = _a.dataValues, seoContent = _a.seoContent, tempname = _a.tempname, slug = _a.slug;
                newPolicyPage = (0, data_source_1.orm)(frontend_1.Frontend).create({ dataKeys: dataKeys, dataValues: dataValues, seoContent: seoContent, tempname: tempname, slug: slug });
                return [4 /*yield*/, (0, data_source_1.orm)(frontend_1.Frontend).save(newPolicyPage)];
            case 1:
                _b.sent();
                return [2 /*return*/, res.success('Create Policy Success', newPolicyPage)];
            case 2:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPolicyPage = createPolicyPage;
// แสดงข้อมูลหน้า Policy ทั้งหมด
var getPolicyPages = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var policyPages, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, data_source_1.orm)(frontend_1.Frontend).find({})];
            case 1:
                policyPages = _a.sent();
                if (!policyPages) {
                    return [2 /*return*/, res.status(404).json({ message: 'Policy page not found' })];
                }
                return [2 /*return*/, res.success('Get Policy Success', policyPages)];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPolicyPages = getPolicyPages;
// แสดงข้อมูลหน้า Policy ตาม ID
var getPolicyPageById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, policyPage, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, data_source_1.orm)(frontend_1.Frontend).findOne({ where: { id: id } })];
            case 1:
                policyPage = _a.sent();
                if (!policyPage) {
                    return [2 /*return*/, res.status(404).json({ message: 'Policy page not found' })];
                }
                return [2 /*return*/, res.success('Get PolicyId Success', policyPage)];
            case 2:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPolicyPageById = getPolicyPageById;
// อัปเดตหน้า Policy
var updatePolicyPage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, dataKeys, dataValues, seoContent, tempname, slug, policyPage, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = req.params.id;
                _a = req.body, dataKeys = _a.dataKeys, dataValues = _a.dataValues, seoContent = _a.seoContent, tempname = _a.tempname, slug = _a.slug;
                return [4 /*yield*/, (0, data_source_1.orm)(frontend_1.Frontend).findOne({ where: { id: id } })];
            case 1:
                policyPage = _b.sent();
                if (!policyPage) {
                    return [2 /*return*/, res.status(404).json({ message: 'Policy page not found' })];
                }
                (0, data_source_1.orm)(frontend_1.Frontend).merge(policyPage, { dataKeys: dataKeys, dataValues: dataValues, seoContent: seoContent, tempname: tempname, slug: slug });
                return [4 /*yield*/, (0, data_source_1.orm)(frontend_1.Frontend).save(policyPage)];
            case 2:
                _b.sent();
                return [2 /*return*/, res.success('Updated Policy Success', policyPage)];
            case 3:
                err_4 = _b.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updatePolicyPage = updatePolicyPage;
// ลบหน้า Policy
var deletePolicyPage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, policyPage, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, (0, data_source_1.orm)(frontend_1.Frontend).findOne({ where: { id: id } })];
            case 1:
                policyPage = _a.sent();
                if (!policyPage) {
                    return [2 /*return*/, res.status(404).json({ message: 'Policy page not found' })];
                }
                return [4 /*yield*/, (0, data_source_1.orm)(frontend_1.Frontend).remove(policyPage)];
            case 2:
                _a.sent();
                return [2 /*return*/, res.success('Policy page deleted successfully', policyPage)];
            case 3:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deletePolicyPage = deletePolicyPage;
