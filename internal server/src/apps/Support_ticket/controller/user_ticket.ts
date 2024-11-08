import { SupportTicket } from '../entities/support_ticket';
import { SupportMessage } from '../entities/support_message';
import { SupportAttachment } from '../entities/support_attachment';
import { AppDataSource, orm } from "../../../data-source";
import { writeFile } from "../../../Utils";
import { ticket_status, priority_ticket } from "../../Utils/enum"
import { v4 as uuidv4 } from 'uuid';
import { Users } from '../../Users/entities';


// user
export const createTicket = async (req, res) => {
    const userId = req.user.id;
    const { subject, message, priority } = req.body;

    try {
        const user = await orm(Users).findOne({ where: { id: userId } });
        const ticket = new SupportTicket();
        ticket.userId = userId;
        ticket.name = user.username;
        ticket.email = user.email;
        ticket.subject = subject;
        ticket.priority = priority;
        ticket.lastReply = new Date();
        ticket.ticket = `Ticket#${uuidv4().replace(/\D/g, '').slice(0, 6)}`
        await orm(SupportTicket).save(ticket);
        await ticket.createLog(req, 'create', 'support_ticket', {
            userId: ticket.userId,
            name: ticket.name,
            email: ticket.email,
            subject: ticket.subject,
            priority: ticket.priority,
            lasyReply: ticket.lastReply,
            status: ticket_status.Open,
        })

        const supportMessage = new SupportMessage();
        supportMessage.supportTicketId = ticket.id;
        supportMessage.message = message;
        await orm(SupportMessage).save(supportMessage);
        await supportMessage.createLog(req, 'create', 'support_message', {
            id: supportMessage.id,
            supportTicketId: supportMessage.supportTicketId,
            message: supportMessage.message,
        });

        // Check if files are attached
        if (req.files) {
            const attachments = req.files.map(file => {
                const filename = writeFile(`Ticket-${uuidv4()}`, file, 'internal server/src/uploads/ticket');
                const attachment = new SupportAttachment();
                attachment.supportMessageId = supportMessage.id;
                attachment.attachment = filename;
                return attachment;
            });
            await orm(SupportAttachment).save(attachments);
        }

        return res.success('Ticket created successfully', { ticket, supportMessage });
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const get_supportTicket = async (req, res) => {
    const userId = req.user.id;

    try {
        const ticket = await orm(SupportTicket).find({ where: { userId: userId } });
        if (!ticket) return res.error('Ticket not found')

        const result = ticket.map((data) => {
            const { created_at, updated_at, deleted_at, userId, name, email, ...choose } = data
            return choose
        })

        return res.success('Get Ticket All', result)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const viewTicket = async (req, res) => {
    const userId = req.user.id;
    const { ticketId } = req.params;
    const _userId = parseInt(userId) || -1;
    const _id = parseInt(ticketId) || -1;

    const query =
        `
    SELECT t.*, m.id as messageId, m.*, a.*
    FROM support_ticket t
    LEFT JOIN support_message m ON m.supportTicketId = t.id
    LEFT JOIN support_attachment a ON a.supportMessageId = m.id
    WHERE t.userId = ? AND t.id = ?
    `
    try {
        const data = await AppDataSource.query(query, [_userId, _id])
        if (!data.length) return res.error('Ticket not found');

        const ticket = {
            status: data[0].status,
            ticket: data[0].ticket,
            subject: data[0].subject,
        }

        const messageMap = {};

        data.forEach(row => {
            const {
                messageId,
                supportMessageId,
                attachment,
                created_at, updated_at, deleted_at, id, userId, email, supportTicketId,
                ticket, subject, status, adminId, priority,
                ...rest
            } = row;
            
            if (!messageMap[supportMessageId]) {
                messageMap[supportMessageId] = { 
                    messageId,
                    supportTicketId,
                    ...rest, 
                    supportMessageId,
                    attachments: [] 
                };
            }
            if (attachment) {
                messageMap[supportMessageId].attachments.push(attachment);
            }
        });

        const details = Object.values(messageMap);

        return res.success('Get Detail Ticket', { ticket, details });
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const replyToTicket = async (req, res) => {
    const { ticketId } = req.params;
    const { message } = req.body;
    const _ticketId = parseInt(ticketId) || -1;

    try {
        const supportMessage = new SupportMessage();
        supportMessage.supportTicketId = _ticketId;
        supportMessage.message = message;
        await orm(SupportMessage).save(supportMessage);
        await supportMessage.createLog(req, 'create','support_message', {
            id: supportMessage.id,
            supportTicketId: supportMessage.supportTicketId,
            message: supportMessage.message,
        });

        if (req.files) {
            const attachments = req.files.map(file => {
                const filename = writeFile(`ticket-${uuidv4()}`, file, 'internal server/src/uploads/ticket');
                const attachment = new SupportAttachment();
                attachment.supportMessageId = supportMessage.id;
                attachment.attachment = filename;
                return attachment;
            });
            await orm(SupportAttachment).save(attachments);
        }

        const ticket = await orm(SupportTicket).findOne({ where: { id: _ticketId } });
        ticket.status = ticket_status.Replied;
        ticket.lastReply = new Date();
        await orm(SupportTicket).save(ticket);
        await ticket.createLog(req, 'update','support_ticket', {
            id: ticket.id,
            status: ticket.status,
            lastReply: ticket.lastReply,
        });

        return res.success('Reply sent successfully', supportMessage);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const closeTicket = async (req, res) => {
    const { ticketId } = req.params;
    const _id = parseInt(ticketId) || -1;

    try {
        const ticket = await orm(SupportTicket).findOne({ where: { id: _id } });

        if (!ticket) return res.error('Ticket not found');


        ticket.status = ticket_status.Closed;
        await orm(SupportTicket).save(ticket);
        await ticket.createLog(req, 'update','support_ticket', {
            id: ticket.id,
            status: ticket.status,
        });

        return res.success('Ticket closed successfully', ticket);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};
