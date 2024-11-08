import { AccessToken, class_checker, isAdmin, isList, warper } from "../../../middlewares";
import { list } from "../controller";


export default (router) => {
    router.get('/system/file',[isList], warper(list));
}