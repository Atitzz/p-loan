// user register loan
import {  warper } from "../../../middlewares";

import {
    takeLoan,
    get_applicationForm,
    my_loan,
    installments,
    // installmentAll,
    payment,
    category_plan,
    getPaymentDetails,
    myloanContract,
    due_installment
} from "../controller/user_loan"

import {
    get_plan,
    get_planId
} from "../controller/loan_cateogory";

import { getGuarantee } from "../controller/guarantee"


export default (router) => {
    // เหมือนหน้า routes user
    router.get('/plan/loan/all', warper(get_plan));
    router.get('/plan/loan/:loanPlan_id', warper(get_planId));

    // ทำให้ใหม่
    router.get("/loan/plan", category_plan)
    router.get("/loan/application-form/:plan_id", warper(get_applicationForm))

    router.post("/loan/register", warper(takeLoan))
    router.get('/guarantee', warper(getGuarantee));

    router.get("/loan/list/:status?", warper(my_loan))
    router.get("/loan/loancontract/:loan_id", warper(myloanContract))
    router.get("/loan/installment/logs/:loan_id", warper(installments))
    router.get("/loan/installment/due/:loan_id", warper(due_installment))

    router.get("/loan/pay/:loan_id/:installment_id", warper(getPaymentDetails))
    router.post('/loan/pay', warper(payment));
}