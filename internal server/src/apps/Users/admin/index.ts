import { AccessToken, class_checker, isAdmin, isList, isManageUsers, isRemove, isShow, isStore, isUpdate, warper } from "../../../middlewares";
import { addRoles, list, remove, show, store, update } from "../controller/admin";
import { current, logout } from "../controller/admin";
import { Users } from "../entities";

export default (router) => {
    // router.post('/system/users',[isStore,class_checker(Users)],warper(store));
    // router.put('/system/users',[isUpdate,class_checker(Users)],warper(update))
    // router.get('/system/users/details/:id',[isShow], warper(show));
    // router.get('/system/users/all',[isList], warper(list));
    // router.delete('/system/users',[isRemove,class_checker(Users)], warper(remove));
    router.get('/logout',warper(logout));
    router.get('/current', warper(current));
    router.post('/system/set/roles',[isManageUsers],warper(addRoles));
    
}