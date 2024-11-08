import { warper } from "../../../middlewares";
import { LineConnect, LineRevoke } from "../controller";

export default (router) => {
    // router.get('/line/connect',warper(LineConnect));
    router.get('/line/revoke',warper(LineRevoke));
}