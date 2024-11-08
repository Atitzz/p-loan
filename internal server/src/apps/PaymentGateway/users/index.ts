import { warper } from "../../../middlewares";
import { callback, createQR } from "../controller";


export default (router) => {
    router.post('/payment/create', warper(createQR));
}