import {  warper } from "../../../middlewares";
import {
    // sendNotification,
    notification_history
} from "../controller";

export default (router) => {
    // router.post('/notification/email', warper(sendNotification));

    // report notification history
    router.get('/report/notification/history', warper(notification_history));
}