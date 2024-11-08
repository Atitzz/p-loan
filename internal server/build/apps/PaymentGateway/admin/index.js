"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var paymentdetail_1 = require("../controller/paymentdetail");
exports.default = (function (router) {
    router.get('/report/payment', [middlewares_1.isList], (0, middlewares_1.warper)(paymentdetail_1.get_paymentDetail));
});
