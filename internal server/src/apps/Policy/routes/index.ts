import {warper } from "../../../middlewares"
import { fetch } from "../controller"


export default (router) => {
    router.get("/users/policy", warper(fetch))
}