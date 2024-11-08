import { SupportTicket } from '../entities/support_ticket';
import { SupportMessage } from '../entities/support_message';
import { SupportAttachment } from '../entities/support_attachment';
import { AppDataSource, orm } from "../../../data-source";
import { writeFile } from "../../../Utils";
import { ticket_status, priority_ticket } from "../../Utils/enum"
import { v4 as uuidv4 } from 'uuid';
import { Users } from '../../Users/entities';
import { Like } from "typeorm"

export const allTicket = async (req, res) => {
    const { status } = req.params;
    const { search, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    let whereClause = ''
    const parameters = [];

    if (status && status.toLowerCase() !== 'all') {
        whereClause += ` WHERE LOWER(s.status) = LOWER(?) `;
        parameters.push(status);
    }

    if (search) {
        whereClause += whereClause ? ' AND ' : ' WHERE ';
        whereClause += ` (LOWER(s.name) LIKE LOWER(?) OR LOWER(s.ticket) LIKE LOWER(?) OR LOWER(s.subject) LIKE LOWER(?)) `
        parameters.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }
    parameters.push(perPage, offset)


    const countQuery =
        `
        SELECT COUNT(*) AS total
        FROM support_ticket s
        ${whereClause}
    `;

    const query =
        `
        SELECT s.id, s.ticket, s.subject, s.name, s.status, s.priority, s.lastReply
        FROM support_ticket s
        ${whereClause}
        ORDER BY s.created_at DESC
        LIMIT ? OFFSET ?
    `;
    try {
        const totalResult = await AppDataSource.query(countQuery, parameters)
        const _total = parseInt(totalResult[0].total)

        const result = await AppDataSource.query(query, parameters)
        if (result.length === 0) return res.error('No Ticket')

        return res.success("Get Successfully", result, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const detailTicket = async (req, res) => {
    const { ticketId } = req.params;
    const _id = parseInt(ticketId) || -1;

    const query =
        `
    SELECT t.*, m.id as messageId, m.*, a.*
    FROM support_ticket t
    LEFT JOIN support_message m ON m.supportTicketId = t.id
    LEFT JOIN support_attachment a ON a.supportMessageId = m.id
    WHERE t.id = ?
    `
    try {
        const data = await AppDataSource.query(query, [_id])
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
        await supportMessage.createLog(req, 'create', 'support_message', {
            id: supportMessage.id,
            supportTicketId: supportMessage.supportTicketId,
            message: supportMessage.message,
        })

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
        ticket.status = ticket_status.Answered;
        ticket.lastReply = new Date();
        await orm(SupportTicket).save(ticket);
        await ticket.createLog(req, 'update', 'support_ticket', {
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


export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    const _messageId = parseInt(messageId) || -1;
    try {
        const message = await orm(SupportMessage).findOne({ where: { id: _messageId } });
        if (!message) return res.error('No message')

        // ค้นหาและลบไฟล์แนบที่เกี่ยวข้องกับข้อความนี้
        const attachments = await orm(SupportAttachment).find({ where: { supportMessageId: message.id } });
        if (attachments.length > 0) {
            await orm(SupportAttachment).remove(attachments);
        }

        await orm(SupportMessage).remove(message)
        await message.createLog(req, 'remove', 'support_message', {
            id: message.id,
            supportTicketId: message.supportTicketId,
            message: message.message,
        })

        return res.success('Message deleted successfully', message);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
} 