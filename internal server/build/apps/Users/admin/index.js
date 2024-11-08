"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var admin_1 = require("../controller/admin");
var admin_2 = require("../controller/admin");
exports.default = (function (router) {
    // router.post('/system/users',[isStore,class_checker(Users)],warper(store));
    // router.put('/system/users',[isUpdate,class_checker(Users)],warper(update))
    // router.get('/system/users/details/:id',[isShow], warper(show));
    // router.get('/system/users/all',[isList], warper(list));
    // router.delete('/system/users',[isRemove,class_checker(Users)], warper(remove));
    router.get('/logout', (0, middlewares_1.warper)(admin_2.logout));
    router.get('/current', (0, middlewares_1.warper)(admin_2.current));
    router.post('/system/set/roles', [middlewares_1.isManageUsers], (0, middlewares_1.warper)(admin_1.addRoles));
});
