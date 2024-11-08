import { warper, isList, isApprove } from "../../../middlewares"
import { list, store, update } from "../controller"

export default (router) => {
    router.put("/contactus", [isApprove], warper(update))
    router.get("/contactus", [isList], warper(list))
}