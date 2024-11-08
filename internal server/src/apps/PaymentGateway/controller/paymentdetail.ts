import { AppDataSource, orm } from "../../../data-source";
import { QRPayment } from "../entities/qrpayment";
import { Like, Between } from "typeorm";

export const get_paymentDetail = async (req, res) => {
    const { search, page, limit, start, end } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    try {
        let whereClause: any = {};

        if (search) {
            whereClause.total = Like(`%${search}%`);
        }

        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);

            whereClause.created_at = Between(startDate, endDate);
        }

        const _total = await orm(QRPayment).count({ where: whereClause });
        const payment = await orm(QRPayment).find({
            where: whereClause,
            take: perPage,
            skip: offset,
            order: { created_at: 'DESC' },
        });
        if (!payment) return res.error('ไม่พบรายการชำระ');

        return res.success('รายการสแกนชำระ', payment, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}