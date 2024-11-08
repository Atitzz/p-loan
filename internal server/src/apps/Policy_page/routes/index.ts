import {  warper } from "../../../middlewares";
import {
    createPolicyPage,
    getPolicyPages,
    getPolicyPageById,
    updatePolicyPage,
    deletePolicyPage
} from "../controller/policy_page";

export default (router) => {
    router.post('/loan/policy-pages', warper(createPolicyPage));
    router.get('/loan/policy-pages', warper(getPolicyPages));
    router.get('/loan/policy-pages/:id', warper(getPolicyPageById));
    router.put('/loan/policy-pages/:id', warper(updatePolicyPage));
    router.delete('/loan/policy-pages/:id', warper(deletePolicyPage));
}