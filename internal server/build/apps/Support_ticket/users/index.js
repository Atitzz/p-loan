"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var user_ticket_1 = require("../controller/user_ticket");
var multer_1 = require("../../../middlewares/multer");
exports.default = (function (router) {
    router.post('/ticket/new', multer_1.upload.array('attachment', 5), (0, middlewares_1.warper)(user_ticket_1.createTicket));
    router.get('/ticket', (0, middlewares_1.warper)(user_ticket_1.get_supportTicket));
    router.get('/ticket/view/:ticketId', (0, middlewares_1.warper)(user_ticket_1.viewTicket));
    router.post('/ticket/reply/:ticketId', multer_1.upload.array('attachment', 5), (0, middlewares_1.warper)(user_ticket_1.replyToTicket));
    router.put('/ticket/closed/:ticketId', (0, middlewares_1.warper)(user_ticket_1.closeTicket));
});
