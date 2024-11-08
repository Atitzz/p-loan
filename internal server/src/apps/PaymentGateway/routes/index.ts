import { warper } from "../../../middlewares";
import { callback, createPayment, createPaymentAdmin } from "../controller";


export default (router) => {
    router.post('/paysolutions/callback', warper(callback));
    router.get('/users/payment/:loan_number/:amount', warper(createPayment));
    router.get('/admin/payment/:loan_number/:amount', warper(createPaymentAdmin));
}