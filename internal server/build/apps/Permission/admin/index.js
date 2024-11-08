"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
var entities_1 = require("../entities");
exports.default = (function (router) {
    router.post('/system/permission', [middlewares_1.isStore, middlewares_1.isManageUsers, (0, middlewares_1.class_checker)(entities_1.Permissions)], (0, middlewares_1.warper)(controller_1.store));
    router.put('/system/permission/:pid', [middlewares_1.isUpdate, middlewares_1.isManageUsers], (0, middlewares_1.warper)(controller_1.update));
    router.get('/system/permission', [middlewares_1.isList, middlewares_1.isManageUsers], (0, middlewares_1.warper)(controller_1.list));
    router.get('/system/permission/:id', [middlewares_1.isShow, middlewares_1.isManageUsers], (0, middlewares_1.warper)(controller_1.show));
    router.delete('/system/permission', [middlewares_1.isRemove, middlewares_1.isManageUsers, (0, middlewares_1.class_checker)(entities_1.Permissions)], (0, middlewares_1.warper)(controller_1.remove));
});
