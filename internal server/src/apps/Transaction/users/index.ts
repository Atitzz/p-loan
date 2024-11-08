import { warper } from "../../../middlewares";
import {
    transactions_user,

} from "../controller/transaction";


export default (router) => {
    router.get('/transactions', warper(transactions_user));
}