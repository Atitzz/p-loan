import { AccessToken, class_checker, isAdmin, isList, isManageUsers, isRemove, isShow, isStore, isUpdate, warper } from "../../../middlewares";
import { list, remove, show, store, update } from "../controller";
import { Roles } from "../entities";

export default (router) => {
    router.post('/system/roles',[isStore,isManageUsers, class_checker(Roles)],warper(store));
    router.put('/system/roles/:pid',[isUpdate,isManageUsers,class_checker(Roles)],warper(update))
    router.get('/system/roles',[isList,isManageUsers], warper(list));
    router.get("/system/roles/:id",[isShow,isManageUsers], warper(show))
    router.delete('/system/roles',[isRemove,isManageUsers], warper(remove));
}