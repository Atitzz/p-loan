"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var user_loan_1 = require("../controller/user_loan");
var loan_cateogory_1 = require("../controller/loan_cateogory");
var user_loan_2 = require("../controller/user_loan");
var calurate_1 = require("../controller/calurate");
exports.default = (function (router) {
    router.get('/users/plan/loan/all', (0, middlewares_1.warper)(loan_cateogory_1.get_plan));
    router.get('/users/plan/loan/:loanPlan_id', (0, middlewares_1.warper)(loan_cateogory_1.get_planId));
    router.get('/users/category', (0, middlewares_1.warper)(user_loan_1.category_plan));
    router.get("/users/loan/application-form/:plan_id", (0, middlewares_1.warper)(user_loan_2.get_applicationForm));
    router.post("/users/loan/calcurate", (0, middlewares_1.warper)(calurate_1.calcurator));
    router.post("/admin/loan/calcurate", (0, middlewares_1.warper)(calurate_1.calcurator));
});
