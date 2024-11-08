"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var folders_1 = require("../controller/folders");
exports.default = (function (router) {
    router.post('/system/folder', [middlewares_1.isStore], (0, middlewares_1.warper)(folders_1.store));
    router.put('/system/folder', [middlewares_1.isUpdate], (0, middlewares_1.warper)(folders_1.update));
    router.get('/system/folder', [middlewares_1.isList], (0, middlewares_1.warper)(folders_1.list));
    router.delete('/system/folder', [middlewares_1.isRemove], (0, middlewares_1.warper)(folders_1.remove));
});
