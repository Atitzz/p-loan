"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
var schema_1 = require("../schema");
exports.default = (function (router) {
    // router.get("/users/requestotp/:mobile", warper(getOTP));
    router.post("/users/resendotp", (0, middlewares_1.warper)(controller_1.resendOTP));
    router.post("/users/verifyotp", [(0, middlewares_1.class_checker)(schema_1.VerifyMobile)], (0, middlewares_1.warper)(controller_1.verifyOTP));
});
