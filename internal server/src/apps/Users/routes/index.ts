import { class_checker, warper } from "../../../middlewares";
import {  loginAdmin } from "../controller/admin";
import { Login } from "../schema";

export default (router) => {
    router.post('/admin/login',[class_checker(Login)],warper(loginAdmin));
}