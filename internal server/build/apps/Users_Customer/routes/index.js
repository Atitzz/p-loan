"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var users_1 = require("../../Users_Customer/controller/users");
var schema_1 = require("../schema");
exports.default = (function (router) {
    router.post('/users/register', [(0, middlewares_1.class_checker)(schema_1.Register)], (0, middlewares_1.warper)(users_1.register));
    router.post('/users/login', [(0, middlewares_1.class_checker)(schema_1.Login)], (0, middlewares_1.warper)(users_1.loginUsers));
});
