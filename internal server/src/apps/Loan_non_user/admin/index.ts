import { warper, isList, isApprove } from "../../../middlewares"
import { list, store, update } from "../controller"


export default (router) => {
    router.put("/nonloan/apply-now", [isApprove], warper(update))
    router.get("/nonloan/apply-now", [isList], warper(list))
}