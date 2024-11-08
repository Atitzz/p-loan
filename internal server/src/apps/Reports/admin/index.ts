
import { AccessToken, isAdmin, isList, isRemove, warper } from "../../../middlewares";
import { list } from "../../Syetem_Logs/controller";
export default (router) => {
    router.get('/report/logs',[isList], warper(list));
}