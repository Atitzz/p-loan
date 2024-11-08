"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
exports.default = (function (router) {
    // router.post('/notification/email', warper(sendNotification));
    // report notification history
    router.get('/report/notification/history', (0, middlewares_1.warper)(controller_1.notification_history));
});
