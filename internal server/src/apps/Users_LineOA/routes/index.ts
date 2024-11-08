import { warper } from "../../../middlewares";
import { callback, connectCallback, login } from "../controller";

export default (router) => {
    // router.get('/users/connect',warper(connectCallback));
    router.get('/users/callback',warper(callback));
    router.get('/users/login',warper(login));
}