import { AccessToken, class_checker, isAdmin, isList, isRemove, isStore, isUpdate, warper } from "../../../middlewares";
import { list, remove, store, update } from "../controller/folders";


export default (router) => {
    router.post('/system/folder',[isStore],warper(store));
    router.put('/system/folder',[isUpdate],warper(update))
    router.get('/system/folder',[isList], warper(list));
    router.delete('/system/folder',[isRemove], warper(remove));
}