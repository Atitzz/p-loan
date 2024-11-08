import { warper } from "../../../middlewares";
import { emailVerify } from "../controller";

export default (router) => {
    router.get('/users/activated',warper(emailVerify));
}