"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var coupon_1 = require("../controller/coupon");
exports.default = (function (router) {
    router.post('/create_coupons', (0, middlewares_1.warper)(coupon_1.create_coupons));
    router.post('/claim_coupon_code', (0, middlewares_1.warper)(coupon_1.claim_coupon_code));
    router.post('/use_coupon', (0, middlewares_1.warper)(coupon_1.use_coupon));
    router.get('/coupon_status', (0, middlewares_1.warper)(coupon_1.get_coupon_status));
    router.delete('/delete_coupon', (0, middlewares_1.warper)(coupon_1.delete_coupon));
});
