import { class_checker, isList, isRemove, isStore, isUpdate, warper } from "../../../middlewares"
import { list, remove, show, store, update } from "../controller"
import { isPolicy } from "../schema"

export default (router) => {
    router.post("/policy",[isStore,class_checker(isPolicy)], warper(store))
    router.put("/policy/:pid",[isUpdate,class_checker(isPolicy)], warper(update))
    router.get("/policy",[isList], warper(list))
    router.get("/policy/:id",[isList], warper(show))
    router.delete("/policy",[isRemove], warper(remove))
}