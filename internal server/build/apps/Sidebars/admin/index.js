"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var munu_1 = require("../controller/munu");
var route_1 = require("../controller/route");
exports.default = (function (router) {
    router.post('/route', [middlewares_1.isStore], (0, middlewares_1.warper)(route_1.route_post));
    router.put('/route', [middlewares_1.isUpdate], (0, middlewares_1.warper)(route_1.route_put));
    router.get('/route', [middlewares_1.isList], (0, middlewares_1.warper)(route_1.route_get));
    router.delete('/route', [middlewares_1.isRemove], (0, middlewares_1.warper)(route_1.route_delete));
    router.post('/menu', [middlewares_1.isStore], (0, middlewares_1.warper)(munu_1.menu_post));
    router.put('/menu', [middlewares_1.isUpdate], (0, middlewares_1.warper)(munu_1.menu_put));
    router.get('/menu', [middlewares_1.isList], (0, middlewares_1.warper)(munu_1.menu_get));
    router.delete('/menu', [middlewares_1.isRemove], (0, middlewares_1.warper)(munu_1.menu_delete));
});
