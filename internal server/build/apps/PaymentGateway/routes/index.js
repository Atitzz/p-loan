"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
exports.default = (function (router) {
    router.post('/paysolutions/callback', (0, middlewares_1.warper)(controller_1.callback));
    router.get('/users/payment/:loan_number/:amount', (0, middlewares_1.warper)(controller_1.createPayment));
    router.get('/admin/payment/:loan_number/:amount', (0, middlewares_1.warper)(controller_1.createPaymentAdmin));
});
