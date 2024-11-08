"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
exports.default = (function (router) {
    router.put("/nonloan/apply-now", [middlewares_1.isApprove], (0, middlewares_1.warper)(controller_1.update));
    router.get("/nonloan/apply-now", [middlewares_1.isList], (0, middlewares_1.warper)(controller_1.list));
});
