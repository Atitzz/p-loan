"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var admin_1 = require("../controller/admin");
exports.default = (function (router) {
    router.get('/logout', (0, middlewares_1.warper)(admin_1.logout));
});
