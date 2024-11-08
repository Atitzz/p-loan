"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var admin_ticket_1 = require("../controller/admin_ticket");
var user_ticket_1 = require("../controller/user_ticket");
var multer_1 = require("../../../middlewares/multer");
exports.default = (function (router) {
    router.get('/ticket/:status?', (0, middlewares_1.warper)(admin_ticket_1.allTicket));
    router.get('/ticket/view/:ticketId', (0, middlewares_1.warper)(admin_ticket_1.detailTicket));
    router.post('/ticket/reply/:ticketId', multer_1.upload.array('attachment', 5), (0, middlewares_1.warper)(admin_ticket_1.replyToTicket));
    router.put('/ticket/closed/:ticketId', (0, middlewares_1.warper)(user_ticket_1.closeTicket));
    router.delete('/ticket/remove/:messageId', (0, middlewares_1.warper)(admin_ticket_1.deleteMessage));
});
