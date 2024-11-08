import {  AccessToken, isAdmin, warper } from "../../../middlewares";
import { update } from "../../Users/controller/admin";
import { list, remove, store } from "../controller";

export default (router) => {
    router.get('/users',warper(list));
    router.post('/users',warper(store));
    router.post('/users',warper(update));
    router.delete('/users/:id',warper(remove));
}