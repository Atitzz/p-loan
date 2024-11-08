"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var users_1 = require("../controller/users");
var schema_1 = require("../schema");
exports.default = (function (router) {
    router.get('/current', (0, middlewares_1.warper)(users_1.current));
    router.post('/update/password', [(0, middlewares_1.class_checker)(schema_1.CheckChangePassword)], (0, middlewares_1.warper)(users_1.changePasswords));
    router.post('/set/password', [(0, middlewares_1.class_checker)(schema_1.CheckSetPassword), middlewares_1.usePIN], (0, middlewares_1.warper)(users_1.setPassword));
    router.post('/set/pin', [(0, middlewares_1.class_checker)(schema_1.CheckSetPIN)], (0, middlewares_1.warper)(users_1.setPIN));
    router.post('/verify/pin', (0, middlewares_1.warper)(users_1.verifyPIN));
    router.post('/accept/privacy', (0, middlewares_1.warper)(users_1.acceptPrivacy));
});
