"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
exports.default = (function (router) {
    // create loan guarantee
    router.get('/badge', (0, middlewares_1.warper)(controller_1.badge));
});
