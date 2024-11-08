"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var admin_1 = require("../controller/admin");
exports.default = (function (router) {
    // router.get('/system/users/kyc/:status',[isList], warper(list));
    router.put('/customer/users/kyc/details/:pid', [middlewares_1.isUpdate], (0, middlewares_1.warper)(admin_1.update));
    router.get('/customer/users/kyc/details/:id', [middlewares_1.isShow], (0, middlewares_1.warper)(admin_1.show));
    router.post('/customer/users/kyc/approve/:id', [middlewares_1.isApprove], (0, middlewares_1.warper)(admin_1.Approve));
    router.post('/customer/users/kyc/reject/:id', [middlewares_1.isReject], (0, middlewares_1.warper)(admin_1.Reject));
});
