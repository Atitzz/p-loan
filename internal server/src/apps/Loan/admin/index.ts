import { class_checker, isAdmin, isStore, isShow, isList, isRemove, isUpdate, warper, isApprove, isReject } from "../../../middlewares";
import {
    create_plan,
    uploadPlanImage,
    get_plan,
    get_planId,
    update_plan,
    delete_plan,
    removePlan
} from "../controller/loan_cateogory";

import {
    dashboard,
    dashboardGraph,
    lastCustomer,
    approveLoan,
    rejectLoan,
    badLoan,
    get_loanDetail,
    edit_loanDetail,
    get_installments,
    get_loans,
    takeLoan_admin,
    payment,
    removeLoan,
} from "../controller/admin_loan";

import {
    report_newLoan,
    report_installment,
    report_due,
    report_1,
    report_2,
    report_3,
    report_stamp,
    tax
} from "../controller/report"

import {
    takeLoan,
    Payment,
    createLoanPlan
} from "../schema"

import { removeUser } from "../controller/user_loan"

import {
    addProperty,
    getProperty,
    getPropertyId,
    updateProperty,
    deleteProperty,
    addGuarantee,
    getGuarantee,
    getGuaranteeId,
    updateGuarantee,
    deleteGuarantee
} from "../controller/guarantee"

import { get_beforeDue, get_overDue, notificate_Due } from "../controller/loan_alert"


import { upload } from "../../../middlewares/multer"
import { ApiCalcurator } from "../controller/calurate";
import { LoanPlan } from "../entities/loan_plan";

export default (router) => {
    router.post('/property/create', [isStore], warper(addProperty));
    router.get('/property', [isList], warper(getProperty));
    router.get('/property/:id', [isList], warper(getPropertyId));
    router.put('/property/update/:id', [isUpdate], warper(updateProperty));
    router.delete('/property/delete/:id', [isRemove], warper(deleteProperty));
    // create loan guarantee
    router.post('/guarantee/create', [isStore], warper(addGuarantee));
    router.get('/guarantee', [isList], warper(getGuarantee));
    router.get('/guarantee/:id', [isList], warper(getGuaranteeId));
    router.put('/guarantee/update/:id', [isUpdate], warper(updateGuarantee));
    router.delete('/guarantee/delete/:id', [isRemove], warper(deleteGuarantee));

    // create loan_plan
    router.post('/plan/loan/create', [isStore, class_checker(createLoanPlan)], warper(create_plan));
    router.post('/plan/loan/upload/:loanPlan_id', [isStore], upload.single('images'), warper(uploadPlanImage));
    router.get('/plan/loan/all', [isList], warper(get_plan));
    router.get('/plan/loan/edit/:loanPlan_id', [isList], warper(get_planId));
    router.put('/plan/loan/edit/:loanPlan_id', [isUpdate], warper(update_plan));
    router.delete('/plan/loan/delete/:id', [isRemove], warper(removePlan));


    // get loans 
    router.get("/loan/:status?", [isList], warper(get_loans))
    // admin detail & installment
    router.get("/loan/detail/:id", [isShow], warper(get_loanDetail))
    router.put("/loan/detail/:id", [isApprove], warper(edit_loanDetail))
    router.get("/loan/installment/:id", [isList], warper(get_installments))
    // approve & reject
    router.post("/loan/approve/:reference", [isApprove], warper(approveLoan))
    router.post("/loan/reject/:reference", [isReject], warper(rejectLoan))
    router.post("/loan/bad/:id", [isReject], warper(badLoan))

    router.get("/dashboard", [isList], warper(dashboard))
    router.get("/dashboard/graph", [isList], warper(dashboardGraph))
    router.get("/dashboard/lastcustomer", [isList], warper(lastCustomer))

    router.post("/loan/register", [isStore, class_checker(takeLoan)], warper(takeLoan_admin))

    router.post('/loan/pay', [isStore, class_checker(Payment)], warper(payment));

    // report
    router.get("/report/newloan", [isList], warper(report_newLoan))
    router.get("/report/installment", [isList], warper(report_installment))
    router.get("/report/due", [isList], warper(report_due))
    router.get("/report/bank-1", [isList], warper(report_1))
    router.get("/report/bank-2", [isList], warper(report_2))
    router.get("/report/bank-3", [isList], warper(report_3))
    router.get("/report/stamp", [isList], warper(report_stamp))
    router.get("/report/tax", [isList], warper(tax))

    router.post('/loan/payment/calcurate', warper(ApiCalcurator));

    router.post('/loan/remove/:reference', [isRemove], warper(removeLoan))
    router.post('/user/remove/:user_id', [isRemove], warper(removeUser))

    // loan alert
    router.get('/loan/alert/beforedue', [isList], warper(get_beforeDue))
    router.get('/loan/alert/overdue', [isList], warper(get_overDue))
    router.post('/loan/alert/due', [isStore], warper(notificate_Due))
    // router.post('/loan/alert/afterdue', warper(notificate_afterDue))
}
