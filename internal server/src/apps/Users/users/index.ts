import { warper } from "../../../middlewares";
import { logout } from "../controller/admin";


export default (router) => {
    router.get('/logout',warper(logout));
}