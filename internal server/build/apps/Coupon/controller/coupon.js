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
exports.delete_coupon = exports.get_coupon_status = exports.use_coupon = exports.claim_coupon_code = exports.create_coupons = void 0;
var data_source_1 = require("../../../data-source");
var coupon_1 = require("../entities/coupon");
var uuid_1 = require("uuid");
var typeorm_1 = require("typeorm");
// สร้างคูปอง
var create_coupons = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, code, expiry_date, obj, coupons, i, coupon, save, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, code = _a.code, expiry_date = _a.expiry_date, obj = __rest(_a, ["code", "expiry_date"]);
                if (obj.discount_amount <= 0)
                    return [2 /*return*/, res.error('Discount amount must be greater than zero')];
                if (obj.total_coupons <= 0)
                    return [2 /*return*/, res.error('Number of coupons must be greater than zero')];
                if (new Date(expiry_date) <= new Date())
                    return [2 /*return*/, res.error('Expiry date must be in the future')];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                coupons = [];
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < obj.total_coupons)) return [3 /*break*/, 5];
                coupon = new coupon_1.Coupon();
                coupon.code = (0, uuid_1.v4)();
                coupon.coupon_type = obj.coupon_type;
                coupon.description = obj.description;
                coupon.discount_amount = obj.discount_amount;
                coupon.expiry_date = new Date(expiry_date);
                coupon.total_coupons = obj.total_coupons;
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).save(coupon)];
            case 3:
                save = _b.sent();
                coupons.push(save);
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/, res.success('Created Coupons Successfully', coupons)];
            case 6:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.create_coupons = create_coupons;
// รับคูปอง
var claim_coupon_code = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _userId, coupon_type, usedCoupon, existingCoupon, coupon, now, expiryDate, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.id;
                _userId = parseInt(userId) || -1;
                coupon_type = req.body.coupon_type;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).findOne({ where: { user_id: _userId, used: true, coupon_type: coupon_type } })];
            case 2:
                usedCoupon = _a.sent();
                if (usedCoupon)
                    return [2 /*return*/, res.error('คุณใช้สิทธินี้ไปแล้ว')];
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).findOne({ where: { user_id: _userId, used: false, claimed_at: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()) } })];
            case 3:
                existingCoupon = _a.sent();
                if (existingCoupon)
                    return [2 /*return*/, res.error('คุณเคยกดรับโค้ดนี้ไปแล้ว')];
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).findOne({ where: { used: false, coupon_type: coupon_type } })];
            case 4:
                coupon = _a.sent();
                if (!coupon)
                    return [2 /*return*/, res.error('No available coupons')];
                now = new Date();
                expiryDate = new Date(coupon.expiry_date);
                if (now > expiryDate)
                    return [2 /*return*/, res.error('แพคเกจนี้หมดอายุแล้ว')];
                // บันทึกเวลารับสิทธิ และ ผู้รับสิทธิ
                coupon.claimed_at = new Date();
                coupon.user_id = _userId;
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).save(coupon)];
            case 5:
                _a.sent();
                return [2 /*return*/, res.success('Coupon Claimed Successfully', coupon)];
            case 6:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.status(500).json({ message: err_2.detail || err_2.routine })];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.claim_coupon_code = claim_coupon_code;
// ใช้คูปอง
var use_coupon = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _userId, code, coupon, now, expiryDate, COUPON_EXPIRATION_TIME, newCoupon, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.id;
                _userId = parseInt(userId) || -1;
                code = req.body.code;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).findOne({ where: { code: code, user_id: _userId, used: false } })];
            case 2:
                coupon = _a.sent();
                if (!coupon)
                    return [2 /*return*/, res.error('คูปองนี้ถูกใช้ไปแล้ว')];
                now = new Date();
                expiryDate = new Date(coupon.expiry_date);
                COUPON_EXPIRATION_TIME = 1000 * 60 * 30;
                // ปรับปรุงการเปรียบเทียบวันหมดอายุ
                if (now > expiryDate)
                    return [2 /*return*/, res.error('แพคเกจนี้หมดอายุแล้ว')];
                if (!(coupon.claimed_at && (now.getTime() - new Date(coupon.claimed_at).getTime() > COUPON_EXPIRATION_TIME))) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).remove(coupon)];
            case 3:
                _a.sent();
                newCoupon = new coupon_1.Coupon();
                newCoupon.code = (0, uuid_1.v4)();
                newCoupon.coupon_type = coupon.coupon_type;
                newCoupon.description = coupon.description;
                newCoupon.discount_amount = coupon.discount_amount;
                newCoupon.expiry_date = coupon.expiry_date;
                newCoupon.total_coupons = coupon.total_coupons;
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).save(newCoupon)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.error('คูปองหมดอายุ กรุณากดรับใหม่')];
            case 5:
                coupon.used = true;
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).save(coupon)];
            case 6:
                _a.sent();
                return [2 /*return*/, res.success('Used Coupon Successfully', coupon)];
            case 7:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.status(500).json({ message: err_3.detail || err_3.routine })];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.use_coupon = use_coupon;
// ดูจำนวนที่เหลือ และประวัติการใช้
var get_coupon_status = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var coupon_type, coupons, totalCoupons, usedCoupons, stats, detail, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                coupon_type = req.body.coupon_type;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).find({ where: { coupon_type: coupon_type } })];
            case 2:
                coupons = _a.sent();
                totalCoupons = coupons.length;
                usedCoupons = coupons.filter(function (coupon) { return coupon.used; }).length;
                stats = {
                    TotalCoupon: totalCoupons,
                    UsedCoupon: usedCoupons,
                    availableCoupons: totalCoupons - usedCoupons
                };
                detail = coupons.map(function (item) {
                    return {
                        user_id: item.user_id,
                        code: item.code,
                        claimed_at: item.claimed_at,
                        used: item.used,
                    };
                });
                return [2 /*return*/, res.success('Get Status Coupon', { stats: stats, detail: detail })];
            case 3:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.status(500).json({ message: err_4.detail || err_4.routine })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.get_coupon_status = get_coupon_status;
var delete_coupon = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var coupon_type, coupon, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                coupon_type = req.body.coupon_type;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).find({ where: { coupon_type: coupon_type } })];
            case 2:
                coupon = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(coupon_1.Coupon).remove(coupon)];
            case 3:
                _a.sent();
                return [2 /*return*/, res.success('remove successfully', coupon)];
            case 4:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.status(500).json({ message: err_5.detail || err_5.routine })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.delete_coupon = delete_coupon;
