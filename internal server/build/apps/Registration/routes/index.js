"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var admin_1 = require("../../Users/controller/admin");
var controller_1 = require("../controller");
exports.default = (function (router) {
    router.get('/users', (0, middlewares_1.warper)(controller_1.list));
    router.post('/users', (0, middlewares_1.warper)(controller_1.store));
    router.post('/users', (0, middlewares_1.warper)(admin_1.update));
    router.delete('/users/:id', (0, middlewares_1.warper)(controller_1.remove));
});
