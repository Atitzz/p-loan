import { isShow, warper } from "../../../middlewares";

import { 
    category_plan,
} from "../controller/user_loan"
import {
    // get_categoryId,
    get_plan,
    get_planId,
} from "../controller/loan_cateogory";

import { get_applicationForm } from "../controller/user_loan"
import { calcurator } from "../controller/calurate";

export default (router) => {
    router.get('/users/plan/loan/all', warper(get_plan));
    router.get('/users/plan/loan/:loanPlan_id', warper(get_planId));
    router.get('/users/category', warper(category_plan));
    router.get("/users/loan/application-form/:plan_id", warper(get_applicationForm))
    router.post("/users/loan/calcurate", warper(calcurator))
    router.post("/admin/loan/calcurate", warper(calcurator))
}