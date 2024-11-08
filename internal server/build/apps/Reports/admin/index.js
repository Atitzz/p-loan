"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../../Syetem_Logs/controller");
exports.default = (function (router) {
    router.get('/report/logs', [middlewares_1.isList], (0, middlewares_1.warper)(controller_1.list));
});
