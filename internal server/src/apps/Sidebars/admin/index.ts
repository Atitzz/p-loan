
import { AccessToken, isAdmin, isList, isRemove, isStore, isUpdate, warper } from "../../../middlewares";
import { menu_delete, menu_get, menu_post, menu_put } from "../controller/munu";
import { route_delete, route_get, route_post, route_put } from "../controller/route";

export default (router) => {
    router.post('/route',[isStore],warper(route_post));
    router.put('/route',[isUpdate],warper(route_put))
    router.get('/route',[isList], warper(route_get));
    router.delete('/route',[isRemove], warper(route_delete));

    router.post('/menu',[isStore], warper(menu_post));
    router.put('/menu',[isUpdate], warper(menu_put))
    router.get('/menu',[isList], warper(menu_get));
    router.delete('/menu',[isRemove], warper(menu_delete));
}