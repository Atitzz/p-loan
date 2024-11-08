import {  warper } from "../../../middlewares";
import {
    createTicket,
    get_supportTicket,
    viewTicket,
    replyToTicket,
    closeTicket
} from "../controller/user_ticket";

import { upload } from "../../../middlewares/multer"


export default (router) => {
    router.post('/ticket/new', upload.array('attachment', 5), warper(createTicket));
    router.get('/ticket', warper(get_supportTicket))
    router.get('/ticket/view/:ticketId', warper(viewTicket));
    router.post('/ticket/reply/:ticketId', upload.array('attachment', 5), warper(replyToTicket));
    router.put('/ticket/closed/:ticketId', warper(closeTicket)); 
}