"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
var schema_1 = require("../schema");
exports.default = (function (router) {
    router.post("/policy", [middlewares_1.isStore, (0, middlewares_1.class_checker)(schema_1.isPolicy)], (0, middlewares_1.warper)(controller_1.store));
    router.put("/policy/:pid", [middlewares_1.isUpdate, (0, middlewares_1.class_checker)(schema_1.isPolicy)], (0, middlewares_1.warper)(controller_1.update));
    router.get("/policy", [middlewares_1.isList], (0, middlewares_1.warper)(controller_1.list));
    router.get("/policy/:id", [middlewares_1.isList], (0, middlewares_1.warper)(controller_1.show));
    router.delete("/policy", [middlewares_1.isRemove], (0, middlewares_1.warper)(controller_1.remove));
});
