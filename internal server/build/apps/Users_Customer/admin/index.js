"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var admin_1 = require("../controller/admin");
var schema_1 = require("../schema");
exports.default = (function (router) {
    router.post('/customer/users', [middlewares_1.isStore, (0, middlewares_1.class_checker)(schema_1.AdminCreateUser)], (0, middlewares_1.warper)(admin_1.store));
    router.put('/customer/users', [middlewares_1.isUpdate, (0, middlewares_1.class_checker)(schema_1.AdminUpdate)], (0, middlewares_1.warper)(admin_1.update));
    router.get('/customer/users/details/:id', [middlewares_1.isShow], (0, middlewares_1.warper)(admin_1.show));
    router.get('/customer/users/status/:status', [middlewares_1.isList], (0, middlewares_1.warper)(admin_1.list));
    router.get('/customer/users/ev/:ev', [middlewares_1.isList], (0, middlewares_1.warper)(admin_1.list));
    router.get('/customer/users/sv/:sv', [middlewares_1.isList], (0, middlewares_1.warper)(admin_1.list));
    router.get('/customer/users/kyc/:kyc', [middlewares_1.isList], (0, middlewares_1.warper)(admin_1.list));
    router.get('/customer/users/all', [middlewares_1.isList], (0, middlewares_1.warper)(admin_1.list));
});
