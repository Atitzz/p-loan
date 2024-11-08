"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
exports.default = (function (router) {
    router.post('/send_notificate', (0, middlewares_1.warper)(controller_1.manualNotificate));
    router.post('/send_slip', (0, middlewares_1.warper)(controller_1.manualSlip));
    router.post('/send_charge', (0, middlewares_1.warper)(controller_1.manualCharge));
    router.post('/send_reject', (0, middlewares_1.warper)(controller_1.manualReject));
    router.post('/send_approve', (0, middlewares_1.warper)(controller_1.manualApprove));
});
