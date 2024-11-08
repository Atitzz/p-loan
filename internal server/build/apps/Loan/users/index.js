"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// user register loan
var middlewares_1 = require("../../../middlewares");
var user_loan_1 = require("../controller/user_loan");
var loan_cateogory_1 = require("../controller/loan_cateogory");
var guarantee_1 = require("../controller/guarantee");
exports.default = (function (router) {
    // เหมือนหน้า routes user
    router.get('/plan/loan/all', (0, middlewares_1.warper)(loan_cateogory_1.get_plan));
    router.get('/plan/loan/:loanPlan_id', (0, middlewares_1.warper)(loan_cateogory_1.get_planId));
    // ทำให้ใหม่
    router.get("/loan/plan", user_loan_1.category_plan);
    router.get("/loan/application-form/:plan_id", (0, middlewares_1.warper)(user_loan_1.get_applicationForm));
    router.post("/loan/register", (0, middlewares_1.warper)(user_loan_1.takeLoan));
    router.get('/guarantee', (0, middlewares_1.warper)(guarantee_1.getGuarantee));
    router.get("/loan/list/:status?", (0, middlewares_1.warper)(user_loan_1.my_loan));
    router.get("/loan/loancontract/:loan_id", (0, middlewares_1.warper)(user_loan_1.myloanContract));
    router.get("/loan/installment/logs/:loan_id", (0, middlewares_1.warper)(user_loan_1.installments));
    router.get("/loan/installment/due/:loan_id", (0, middlewares_1.warper)(user_loan_1.due_installment));
    router.get("/loan/pay/:loan_id/:installment_id", (0, middlewares_1.warper)(user_loan_1.getPaymentDetails));
    router.post('/loan/pay', (0, middlewares_1.warper)(user_loan_1.payment));
});
