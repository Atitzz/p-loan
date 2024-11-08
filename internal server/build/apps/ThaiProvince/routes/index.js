"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
exports.default = (function (router) {
    router.get('/users/province', (0, middlewares_1.warper)(controller_1.province));
    router.get('/users/district', (0, middlewares_1.warper)(controller_1.district));
    router.get('/users/subdistrict', (0, middlewares_1.warper)(controller_1.subdistrict));
    router.get('/admin/province', (0, middlewares_1.warper)(controller_1.province));
    router.get('/admin/district', (0, middlewares_1.warper)(controller_1.district));
    router.get('/admin/subdistrict', (0, middlewares_1.warper)(controller_1.subdistrict));
});
