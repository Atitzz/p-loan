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
exports.get_paymentDetail = void 0;
var data_source_1 = require("../../../data-source");
var qrpayment_1 = require("../entities/qrpayment");
var typeorm_1 = require("typeorm");
var get_paymentDetail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, start, end, perPage, offset, whereClause, startDate, endDate, _total, payment, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit, start = _a.start, end = _a.end;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                whereClause = {};
                if (search) {
                    whereClause.total = (0, typeorm_1.Like)("%".concat(search, "%"));
                }
                if (start && end) {
                    startDate = new Date(start);
                    endDate = new Date(end);
                    endDate.setHours(23, 59, 59, 999);
                    whereClause.created_at = (0, typeorm_1.Between)(startDate, endDate);
                }
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).count({ where: whereClause })];
            case 2:
                _total = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(qrpayment_1.QRPayment).find({
                        where: whereClause,
                        take: perPage,
                        skip: offset,
                        order: { created_at: 'DESC' },
                    })];
            case 3:
                payment = _b.sent();
                if (!payment)
                    return [2 /*return*/, res.error('ไม่พบรายการชำระ')];
                return [2 /*return*/, res.success('รายการสแกนชำระ', payment, _total)];
            case 4:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.get_paymentDetail = get_paymentDetail;
