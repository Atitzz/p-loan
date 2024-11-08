
import { AccessToken, isAdmin, isList, isRemove, warper } from "../../../middlewares";
import { list, remove } from "../controller/admin";

export default (router) => {
    router.get('/accesstoken',[isList], warper(list));
    router.delete('/accesstoken',[isRemove], warper(remove));
}