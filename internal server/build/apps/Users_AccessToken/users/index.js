"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var users_1 = require("../controller/users");
exports.default = (function (router) {
    router.get('/accesstoken', [middlewares_1.isList], (0, middlewares_1.warper)(users_1.list));
    router.delete('/accesstoken', [middlewares_1.isRemove], (0, middlewares_1.warper)(users_1.remove));
});
