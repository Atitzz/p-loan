import {  warper } from "../../../middlewares";
import {
    allTicket,
    detailTicket,
    replyToTicket,
    deleteMessage
} from "../controller/admin_ticket";

import { closeTicket } from "../controller/user_ticket"

import { upload } from "../../../middlewares/multer"


export default (router) => {
    router.get('/ticket/:status?', warper(allTicket)); 
    router.get('/ticket/view/:ticketId', warper(detailTicket));
    router.post('/ticket/reply/:ticketId', upload.array('attachment', 5), warper(replyToTicket));
    router.put('/ticket/closed/:ticketId', warper(closeTicket)); 
    router.delete('/ticket/remove/:messageId', warper(deleteMessage)); 
}