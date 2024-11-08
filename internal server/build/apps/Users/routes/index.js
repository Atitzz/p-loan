"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var admin_1 = require("../controller/admin");
var schema_1 = require("../schema");
exports.default = (function (router) {
    router.post('/admin/login', [(0, middlewares_1.class_checker)(schema_1.Login)], (0, middlewares_1.warper)(admin_1.loginAdmin));
});
