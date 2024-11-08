import { warper } from "../../../middlewares";
import { callPayment, store } from "../controller";

export default (router) => {
    router.post('/admin/message', warper(store));
    router.get('/users/la/payment', warper(callPayment));
}