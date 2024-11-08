import { AccessToken, class_checker, isAdmin, isList, isRemove, isShow, isStore, isUpdate, warper } from "../../../middlewares";
import { Users } from "../../Users/entities";
import { list, show, store, update } from "../controller/admin";

import { AdminCreateUser, AdminUpdate } from "../schema";
export default (router) => {
    router.post('/customer/users',[isStore,class_checker(AdminCreateUser)],warper(store))
    router.put('/customer/users',[isUpdate,class_checker(AdminUpdate)],warper(update))
    router.get('/customer/users/details/:id',[isShow], warper(show));
    router.get('/customer/users/status/:status',[isList], warper(list));
    router.get('/customer/users/ev/:ev',[isList], warper(list));
    router.get('/customer/users/sv/:sv',[isList], warper(list));
    router.get('/customer/users/kyc/:kyc',[isList], warper(list));
    router.get('/customer/users/all',[isList], warper(list));
}