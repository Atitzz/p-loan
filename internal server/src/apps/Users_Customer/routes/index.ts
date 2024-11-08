import { class_checker, warper } from "../../../middlewares";
import {  loginUsers, register } from "../../Users_Customer/controller/users";
import { Login, Register } from "../schema";

export default (router) => {
    router.post('/users/register',[class_checker(Register)],warper(register));
    router.post('/users/login',[class_checker(Login)],warper(loginUsers));
}