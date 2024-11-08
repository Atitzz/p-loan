"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
var entities_1 = require("../entities");
exports.default = (function (router) {
    router.post('/profile/kyc', [(0, middlewares_1.class_checker)(entities_1.Users_KYC)], (0, middlewares_1.warper)(controller_1.store));
});
