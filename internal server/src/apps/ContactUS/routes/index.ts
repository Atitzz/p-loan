import { warper } from "../../../middlewares"
import { list, store } from "../controller"

export default (router) => {
    router.post("/users/contactus", warper(store))
   
}