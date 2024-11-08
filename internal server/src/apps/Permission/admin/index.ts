import { AccessToken, class_checker, isAdmin, isList, isManageUsers, isRemove, isShow, isStore, isUpdate, warper } from "../../../middlewares";
import { list, remove, show, store, update } from "../controller";
import { Permissions } from "../entities";

export default (router) => {
    router.post('/system/permission',[isStore,isManageUsers,class_checker(Permissions)],warper(store));
    router.put('/system/permission/:pid',[isUpdate,isManageUsers],warper(update))
    router.get('/system/permission',[isList,isManageUsers], warper(list));
    router.get('/system/permission/:id',[isShow,isManageUsers], warper(show));
    router.delete('/system/permission',[isRemove,isManageUsers,class_checker(Permissions)], warper(remove));
}