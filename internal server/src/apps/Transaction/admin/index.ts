import {  warper } from "../../../middlewares";
import {
    transactions_admin,
    transactions_dept

} from "../controller/transaction";


export default (router) => {
    router.get('/report/transaction', warper(transactions_admin));
    router.get('/report/transaction/dept', warper(transactions_dept));
}