"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTicket = exports.replyToTicket = exports.viewTicket = exports.get_supportTicket = exports.createTicket = void 0;
var support_ticket_1 = require("../entities/support_ticket");
var support_message_1 = require("../entities/support_message");
var support_attachment_1 = require("../entities/support_attachment");
var data_source_1 = require("../../../data-source");
var Utils_1 = require("../../../Utils");
var enum_1 = require("../../Utils/enum");
var uuid_1 = require("uuid");
var entities_1 = require("../../Users/entities");
// user
var createTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, _a, subject, message, priority, user, ticket, supportMessage_1, attachments, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.user.id;
                _a = req.body, subject = _a.subject, message = _a.message, priority = _a.priority;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 9, , 10]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: userId } })];
            case 2:
                user = _b.sent();
                ticket = new support_ticket_1.SupportTicket();
                ticket.userId = userId;
                ticket.name = user.username;
                ticket.email = user.email;
                ticket.subject = subject;
                ticket.priority = priority;
                ticket.lastReply = new Date();
                ticket.ticket = "Ticket#".concat((0, uuid_1.v4)().replace(/\D/g, '').slice(0, 6));
                return [4 /*yield*/, (0, data_source_1.orm)(support_ticket_1.SupportTicket).save(ticket)];
            case 3:
                _b.sent();
                return [4 /*yield*/, ticket.createLog(req, 'create', 'support_ticket', {
                        userId: ticket.userId,
                        name: ticket.name,
                        email: ticket.email,
                        subject: ticket.subject,
                        priority: ticket.priority,
                        lasyReply: ticket.lastReply,
                        status: enum_1.ticket_status.Open,
                    })];
            case 4:
                _b.sent();
                supportMessage_1 = new support_message_1.SupportMessage();
                supportMessage_1.supportTicketId = ticket.id;
                supportMessage_1.message = message;
                return [4 /*yield*/, (0, data_source_1.orm)(support_message_1.SupportMessage).save(supportMessage_1)];
            case 5:
                _b.sent();
                return [4 /*yield*/, supportMessage_1.createLog(req, 'create', 'support_message', {
                        id: supportMessage_1.id,
                        supportTicketId: supportMessage_1.supportTicketId,
                        message: supportMessage_1.message,
                    })];
            case 6:
                _b.sent();
                if (!req.files) return [3 /*break*/, 8];
                attachments = req.files.map(function (file) {
                    var filename = (0, Utils_1.writeFile)("Ticket-".concat((0, uuid_1.v4)()), file, 'internal server/src/uploads/ticket');
                    var attachment = new support_attachment_1.SupportAttachment();
                    attachment.supportMessageId = supportMessage_1.id;
                    attachment.attachment = filename;
                    return attachment;
                });
                return [4 /*yield*/, (0, data_source_1.orm)(support_attachment_1.SupportAttachment).save(attachments)];
            case 7:
                _b.sent();
                _b.label = 8;
            case 8: return [2 /*return*/, res.success('Ticket created successfully', { ticket: ticket, supportMessage: supportMessage_1 })];
            case 9:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.createTicket = createTicket;
var get_supportTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, ticket, result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(support_ticket_1.SupportTicket).find({ where: { userId: userId } })];
            case 2:
                ticket = _a.sent();
                if (!ticket)
                    return [2 /*return*/, res.error('Ticket not found')];
                result = ticket.map(function (data) {
                    var created_at = data.created_at, updated_at = data.updated_at, deleted_at = data.deleted_at, userId = data.userId, name = data.name, email = data.email, choose = __rest(data, ["created_at", "updated_at", "deleted_at", "userId", "name", "email"]);
                    return choose;
                });
                return [2 /*return*/, res.success('Get Ticket All', result)];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.get_supportTicket = get_supportTicket;
var viewTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, ticketId, _userId, _id, query, data, ticket, messageMap_1, details, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.user.id;
                ticketId = req.params.ticketId;
                _userId = parseInt(userId) || -1;
                _id = parseInt(ticketId) || -1;
                query = "\n    SELECT t.*, m.id as messageId, m.*, a.*\n    FROM support_ticket t\n    LEFT JOIN support_message m ON m.supportTicketId = t.id\n    LEFT JOIN support_attachment a ON a.supportMessageId = m.id\n    WHERE t.userId = ? AND t.id = ?\n    ";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, [_userId, _id])];
            case 2:
                data = _a.sent();
                if (!data.length)
                    return [2 /*return*/, res.error('Ticket not found')];
                ticket = {
                    status: data[0].status,
                    ticket: data[0].ticket,
                    subject: data[0].subject,
                };
                messageMap_1 = {};
                data.forEach(function (row) {
                    var messageId = row.messageId, supportMessageId = row.supportMessageId, attachment = row.attachment, created_at = row.created_at, updated_at = row.updated_at, deleted_at = row.deleted_at, id = row.id, userId = row.userId, email = row.email, supportTicketId = row.supportTicketId, ticket = row.ticket, subject = row.subject, status = row.status, adminId = row.adminId, priority = row.priority, rest = __rest(row, ["messageId", "supportMessageId", "attachment", "created_at", "updated_at", "deleted_at", "id", "userId", "email", "supportTicketId", "ticket", "subject", "status", "adminId", "priority"]);
                    if (!messageMap_1[supportMessageId]) {
                        messageMap_1[supportMessageId] = __assign(__assign({ messageId: messageId, supportTicketId: supportTicketId }, rest), { supportMessageId: supportMessageId, attachments: [] });
                    }
                    if (attachment) {
                        messageMap_1[supportMessageId].attachments.push(attachment);
                    }
                });
                details = Object.values(messageMap_1);
                return [2 /*return*/, res.success('Get Detail Ticket', { ticket: ticket, details: details })];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.viewTicket = viewTicket;
var replyToTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, message, _ticketId, supportMessage_2, attachments, ticket, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ticketId = req.params.ticketId;
                message = req.body.message;
                _ticketId = parseInt(ticketId) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                supportMessage_2 = new support_message_1.SupportMessage();
                supportMessage_2.supportTicketId = _ticketId;
                supportMessage_2.message = message;
                return [4 /*yield*/, (0, data_source_1.orm)(support_message_1.SupportMessage).save(supportMessage_2)];
            case 2:
                _a.sent();
                return [4 /*yield*/, supportMessage_2.createLog(req, 'create', 'support_message', {
                        id: supportMessage_2.id,
                        supportTicketId: supportMessage_2.supportTicketId,
                        message: supportMessage_2.message,
                    })];
            case 3:
                _a.sent();
                if (!req.files) return [3 /*break*/, 5];
                attachments = req.files.map(function (file) {
                    var filename = (0, Utils_1.writeFile)("ticket-".concat((0, uuid_1.v4)()), file, 'internal server/src/uploads/ticket');
                    var attachment = new support_attachment_1.SupportAttachment();
                    attachment.supportMessageId = supportMessage_2.id;
                    attachment.attachment = filename;
                    return attachment;
                });
                return [4 /*yield*/, (0, data_source_1.orm)(support_attachment_1.SupportAttachment).save(attachments)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5: return [4 /*yield*/, (0, data_source_1.orm)(support_ticket_1.SupportTicket).findOne({ where: { id: _ticketId } })];
            case 6:
                ticket = _a.sent();
                ticket.status = enum_1.ticket_status.Replied;
                ticket.lastReply = new Date();
                return [4 /*yield*/, (0, data_source_1.orm)(support_ticket_1.SupportTicket).save(ticket)];
            case 7:
                _a.sent();
                return [4 /*yield*/, ticket.createLog(req, 'update', 'support_ticket', {
                        id: ticket.id,
                        status: ticket.status,
                        lastReply: ticket.lastReply,
                    })];
            case 8:
                _a.sent();
                return [2 /*return*/, res.success('Reply sent successfully', supportMessage_2)];
            case 9:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.replyToTicket = replyToTicket;
var closeTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticketId, _id, ticket, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ticketId = req.params.ticketId;
                _id = parseInt(ticketId) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(support_ticket_1.SupportTicket).findOne({ where: { id: _id } })];
            case 2:
                ticket = _a.sent();
                if (!ticket)
                    return [2 /*return*/, res.error('Ticket not found')];
                ticket.status = enum_1.ticket_status.Closed;
                return [4 /*yield*/, (0, data_source_1.orm)(support_ticket_1.SupportTicket).save(ticket)];
            case 3:
                _a.sent();
                return [4 /*yield*/, ticket.createLog(req, 'update', 'support_ticket', {
                        id: ticket.id,
                        status: ticket.status,
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('Ticket closed successfully', ticket)];
            case 5:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.closeTicket = closeTicket;
