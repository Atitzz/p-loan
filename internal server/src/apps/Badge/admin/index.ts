import { warper } from "../../../middlewares";
import { badge } from "../controller";

export default (router) => {
    // create loan guarantee
    router.get('/badge', warper(badge));
}