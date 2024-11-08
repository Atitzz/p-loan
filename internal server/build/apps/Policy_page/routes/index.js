"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var policy_page_1 = require("../controller/policy_page");
exports.default = (function (router) {
    router.post('/loan/policy-pages', (0, middlewares_1.warper)(policy_page_1.createPolicyPage));
    router.get('/loan/policy-pages', (0, middlewares_1.warper)(policy_page_1.getPolicyPages));
    router.get('/loan/policy-pages/:id', (0, middlewares_1.warper)(policy_page_1.getPolicyPageById));
    router.put('/loan/policy-pages/:id', (0, middlewares_1.warper)(policy_page_1.updatePolicyPage));
    router.delete('/loan/policy-pages/:id', (0, middlewares_1.warper)(policy_page_1.deletePolicyPage));
});
