"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var loan_cateogory_1 = require("../controller/loan_cateogory");
var admin_loan_1 = require("../controller/admin_loan");
var report_4 = require("../controller/report");
var schema_1 = require("../schema");
var user_loan_1 = require("../controller/user_loan");
var guarantee_1 = require("../controller/guarantee");
var loan_alert_1 = require("../controller/loan_alert");
var multer_1 = require("../../../middlewares/multer");
var calurate_1 = require("../controller/calurate");
exports.default = (function (router) {
    router.post('/property/create', [middlewares_1.isStore], (0, middlewares_1.warper)(guarantee_1.addProperty));
    router.get('/property', [middlewares_1.isList], (0, middlewares_1.warper)(guarantee_1.getProperty));
    router.get('/property/:id', [middlewares_1.isList], (0, middlewares_1.warper)(guarantee_1.getPropertyId));
    router.put('/property/update/:id', [middlewares_1.isUpdate], (0, middlewares_1.warper)(guarantee_1.updateProperty));
    router.delete('/property/delete/:id', [middlewares_1.isRemove], (0, middlewares_1.warper)(guarantee_1.deleteProperty));
    // create loan guarantee
    router.post('/guarantee/create', [middlewares_1.isStore], (0, middlewares_1.warper)(guarantee_1.addGuarantee));
    router.get('/guarantee', [middlewares_1.isList], (0, middlewares_1.warper)(guarantee_1.getGuarantee));
    router.get('/guarantee/:id', [middlewares_1.isList], (0, middlewares_1.warper)(guarantee_1.getGuaranteeId));
    router.put('/guarantee/update/:id', [middlewares_1.isUpdate], (0, middlewares_1.warper)(guarantee_1.updateGuarantee));
    router.delete('/guarantee/delete/:id', [middlewares_1.isRemove], (0, middlewares_1.warper)(guarantee_1.deleteGuarantee));
    // create loan_plan
    router.post('/plan/loan/create', [middlewares_1.isStore, (0, middlewares_1.class_checker)(schema_1.createLoanPlan)], (0, middlewares_1.warper)(loan_cateogory_1.create_plan));
    router.post('/plan/loan/upload/:loanPlan_id', [middlewares_1.isStore], multer_1.upload.single('images'), (0, middlewares_1.warper)(loan_cateogory_1.uploadPlanImage));
    router.get('/plan/loan/all', [middlewares_1.isList], (0, middlewares_1.warper)(loan_cateogory_1.get_plan));
    router.get('/plan/loan/edit/:loanPlan_id', [middlewares_1.isList], (0, middlewares_1.warper)(loan_cateogory_1.get_planId));
    router.put('/plan/loan/edit/:loanPlan_id', [middlewares_1.isUpdate], (0, middlewares_1.warper)(loan_cateogory_1.update_plan));
    router.delete('/plan/loan/delete/:id', [middlewares_1.isRemove], (0, middlewares_1.warper)(loan_cateogory_1.removePlan));
    // get loans 
    router.get("/loan/:status?", [middlewares_1.isList], (0, middlewares_1.warper)(admin_loan_1.get_loans));
    // admin detail & installment
    router.get("/loan/detail/:id", [middlewares_1.isShow], (0, middlewares_1.warper)(admin_loan_1.get_loanDetail));
    router.put("/loan/detail/:id", [middlewares_1.isApprove], (0, middlewares_1.warper)(admin_loan_1.edit_loanDetail));
    router.get("/loan/installment/:id", [middlewares_1.isList], (0, middlewares_1.warper)(admin_loan_1.get_installments));
    // approve & reject
    router.post("/loan/approve/:reference", [middlewares_1.isApprove], (0, middlewares_1.warper)(admin_loan_1.approveLoan));
    router.post("/loan/reject/:reference", [middlewares_1.isReject], (0, middlewares_1.warper)(admin_loan_1.rejectLoan));
    router.post("/loan/bad/:id", [middlewares_1.isReject], (0, middlewares_1.warper)(admin_loan_1.badLoan));
    router.get("/dashboard", [middlewares_1.isList], (0, middlewares_1.warper)(admin_loan_1.dashboard));
    router.get("/dashboard/graph", [middlewares_1.isList], (0, middlewares_1.warper)(admin_loan_1.dashboardGraph));
    router.get("/dashboard/lastcustomer", [middlewares_1.isList], (0, middlewares_1.warper)(admin_loan_1.lastCustomer));
    router.post("/loan/register", [middlewares_1.isStore, (0, middlewares_1.class_checker)(schema_1.takeLoan)], (0, middlewares_1.warper)(admin_loan_1.takeLoan_admin));
    router.post('/loan/pay', [middlewares_1.isStore, (0, middlewares_1.class_checker)(schema_1.Payment)], (0, middlewares_1.warper)(admin_loan_1.payment));
    // report
    router.get("/report/newloan", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.report_newLoan));
    router.get("/report/installment", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.report_installment));
    router.get("/report/due", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.report_due));
    router.get("/report/bank-1", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.report_1));
    router.get("/report/bank-2", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.report_2));
    router.get("/report/bank-3", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.report_3));
    router.get("/report/stamp", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.report_stamp));
    router.get("/report/tax", [middlewares_1.isList], (0, middlewares_1.warper)(report_4.tax));
    router.post('/loan/payment/calcurate', (0, middlewares_1.warper)(calurate_1.ApiCalcurator));
    router.post('/loan/remove/:reference', [middlewares_1.isRemove], (0, middlewares_1.warper)(admin_loan_1.removeLoan));
    router.post('/user/remove/:user_id', [middlewares_1.isRemove], (0, middlewares_1.warper)(user_loan_1.removeUser));
    // loan alert
    router.get('/loan/alert/beforedue', [middlewares_1.isList], (0, middlewares_1.warper)(loan_alert_1.get_beforeDue));
    router.get('/loan/alert/overdue', [middlewares_1.isList], (0, middlewares_1.warper)(loan_alert_1.get_overDue));
    router.post('/loan/alert/due', [middlewares_1.isStore], (0, middlewares_1.warper)(loan_alert_1.notificate_Due));
    // router.post('/loan/alert/afterdue', warper(notificate_afterDue))
});
