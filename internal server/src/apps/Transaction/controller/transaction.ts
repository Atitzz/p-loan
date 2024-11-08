import { AppDataSource } from "../../../data-source";

export const transactions_admin = async (req, res) => {
    const { search, page, limit, start, end } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    let whereClause = '';
    const parameters = [];

    if (search) {
        whereClause += ` WHERE (
            LOWER(u.citizen_id) LIKE LOWER(?) 
            OR LOWER(l.loan_number) LIKE LOWER(?) 
            OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)
        )`;
        parameters.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (start && end) {
        if (whereClause === '') {
            whereClause += ` WHERE i.given_at BETWEEN ? AND ?`;
        } else {
            whereClause += ` AND i.given_at BETWEEN ? AND ?`;
        }
        parameters.push(new Date(`${start}T00:00:00`));
        parameters.push(new Date(`${end}T23:59:59`));
    }
    parameters.push(perPage, offset);

    const countQuery = `
        SELECT COUNT(*) as total
        FROM loan_installment i
        LEFT JOIN system_users u ON i.user_id = u.id
        LEFT JOIN loan l ON l.id = i.loan_id
        ${whereClause}`;


    const query = `
        SELECT 
            i.*,
            i.delay_charge_paid,
            i.delay_charge_paid AS delay_charge_paid2,
            i.delay_charge AS delay_charge,
            i.delay_charge AS delay_charge2,
            i.installment AS given_installment,
            i.delay_days AS days,
            l.total_installment,
            l.closed_at, 
            u.username, 
            u.firstname, 
            u.lastname,
            l.principle, 
            l.interest,
            lp.application_percent_charge,
            lp.rate
        FROM 
            loan_installment i
        LEFT JOIN 
            system_users u ON i.user_id = u.id
        LEFT JOIN 
            loan l ON l.id = i.loan_id
        LEFT JOIN 
            loan_plan lp ON lp.id = l.plan_id
        ${whereClause}
        ORDER BY 
            i.created_at DESC
        LIMIT 
            ? OFFSET ?;
        `;

    try {
        const totalResult = await AppDataSource.query(countQuery, parameters);
        const _total = parseInt(totalResult[0].total);
        const installment = await AppDataSource.query(query, parameters);

        if (installment.length === 0) {
            return res.error('ไม่พบรายการ');
        }

        installment.forEach(loan => {
            const rateArray = loan.rate;
            loan.interest_rate = Array.isArray(rateArray)
                ? (rateArray.find(r => r.installment == loan.total_installment)?.interest_rate)
                : 0;
            delete loan.rate;
        });

        const total = installment.reduce((acc, loan) => {
            acc.per_installment += Number(loan.per_installment || 0);
            acc.principle_installment += Number(loan.principle_installment || 0);
            acc.interest_installment += Number(loan.interest_installment || 0);
            acc.paid += Number(loan.paid || 0);
            acc.principle_paid += Number(loan.principle_paid || 0);
            acc.interest_paid += Number(loan.interest_paid || 0);
            acc.delay_charge += Number(loan.delay_charge || 0);
            acc.application_charge += Number(loan.application_charge || 0);
            acc.delay_charge2 += Number(loan.delay_charge2 || 0);
            acc.delay_charge_paid += Number(loan.delay_charge_paid || 0);
            acc.delay_charge_paid2 += Number(loan.delay_charge_paid2 || 0);
            acc.cash += Number(loan.cash || 0);
            acc.transfer_payment += Number(loan.transfer_payment || 0);
            acc.overdue_balance += Number(loan.overdue_balance || 0);
            return acc;
        }, {
            per_installment: 0,
            principle_installment: 0,
            interest_installment: 0,
            paid: 0,
            principle_paid: 0,
            interest_paid: 0,
            delay_charge: 0,
            application_charge: 0,
            delay_charge2: 0,
            delay_charge_paid: 0,
            delay_charge_paid2: 0,
            cash: 0,
            transfer_payment: 0,
            overdue_balance: 0
        });

        return res.success('Get installment Success', { data:installment, total }, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};

export const transactions_dept = async (req, res) => {
    const { search, page, limit, start, end } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    let whereClause = '';
    const parameters = [];

    if (search) {
        whereClause += ` WHERE (
            LOWER(u.citizen_id) LIKE LOWER(?) 
            OR LOWER(l.loan_number) LIKE LOWER(?) 
            OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)
        )`;
        parameters.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (start && end) {
        if (whereClause === '') {
            whereClause += ` WHERE i.start_date BETWEEN ? AND ?`;
        } else {
            whereClause += ` AND i.start_date BETWEEN ? AND ?`;
        }
        parameters.push(new Date(`${start}T00:00:00`));
        parameters.push(new Date(`${end}T23:59:59`));
    }
    parameters.push(perPage, offset);

    const countQuery = `
        SELECT COUNT(*) as total
        FROM loan_installment i
        LEFT JOIN system_users u ON i.user_id = u.id
        LEFT JOIN loan l ON l.id = i.loan_id
        ${whereClause}`;


    const query = `
        SELECT 
            i.*,
            i.delay_charge_paid,
            i.delay_charge_paid AS delay_charge_paid2,
            i.delay_charge AS delay_charge,
            i.delay_charge AS delay_charge2,
            i.installment AS given_installment,
            i.delay_days AS days,
            l.total_installment,
            l.closed_at, 
            u.username, 
            u.firstname, 
            u.lastname,
            l.principle, 
            l.interest,
            lp.application_percent_charge,
            lp.rate
        FROM 
            loan_installment i
        LEFT JOIN 
            system_users u ON i.user_id = u.id
        LEFT JOIN 
            loan l ON l.id = i.loan_id
        LEFT JOIN 
            loan_plan lp ON lp.id = l.plan_id
        ${whereClause}
        ORDER BY 
            i.created_at DESC
        LIMIT 
            ? OFFSET ?;
        `;

    try {
        const totalResult = await AppDataSource.query(countQuery, parameters);
        const _total = parseInt(totalResult[0].total);
        const installment = await AppDataSource.query(query, parameters);

        if (installment.length === 0) {
            return res.error('ไม่พบรายการ');
        }

        installment.forEach(loan => {
            const rateArray = loan.rate;
            loan.interest_rate = Array.isArray(rateArray)
                ? (rateArray.find(r => r.installment == loan.total_installment)?.interest_rate)
                : 0;
            delete loan.rate;
        });

        const total = installment.reduce((acc, loan) => {
            acc.per_installment += Number(loan.per_installment || 0);
            acc.principle_installment += Number(loan.principle_installment || 0);
            acc.interest_installment += Number(loan.interest_installment || 0);
            acc.paid += Number(loan.paid || 0);
            acc.principle_paid += Number(loan.principle_paid || 0);
            acc.interest_paid += Number(loan.interest_paid || 0);
            acc.delay_charge += Number(loan.delay_charge || 0);
            acc.application_charge += Number(loan.application_charge || 0);
            acc.delay_charge2 += Number(loan.delay_charge2 || 0);
            acc.delay_charge_paid += Number(loan.delay_charge_paid || 0);
            acc.delay_charge_paid2 += Number(loan.delay_charge_paid2 || 0);
            acc.cash += Number(loan.cash || 0);
            acc.transfer_payment += Number(loan.transfer_payment || 0);
            acc.overdue_balance += Number(loan.overdue_balance || 0);
            return acc;
        }, {
            per_installment: 0,
            principle_installment: 0,
            interest_installment: 0,
            paid: 0,
            principle_paid: 0,
            interest_paid: 0,
            delay_charge: 0,
            application_charge: 0,
            delay_charge2: 0,
            delay_charge_paid: 0,
            delay_charge_paid2: 0,
            cash: 0,
            transfer_payment: 0,
            overdue_balance: 0
        });

        return res.success('Get installment Success', { data:installment, total }, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const transactions_user = async (req, res) => {
    const userId = req.user.id;
    const { search, page, limit, type, remark } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    let whereClause = 'WHERE u.id = ? ';
    const parameters = [userId];

    if (search) {
        whereClause += ` AND (LOWER(t.trx) LIKE LOWER(?))`;
        parameters.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (type && type.toLowerCase() !== 'all') {
        whereClause += ` AND LOWER(t.trx_type) = LOWER(?)`;
        parameters.push(type.toLowerCase());
    }

    if (remark && remark.toLowerCase() !== 'all') {
        whereClause += ` AND LOWER(t.remark) LIKE LOWER(?)`;
        parameters.push(remark.toLowerCase());
    }

    parameters.push(perPage, offset);

    const countQuery = `
        SELECT COUNT(*) as total
        FROM loan_transaction t
        LEFT JOIN system_users u ON t.user_id = u.id
        ${whereClause}`;

    const query = `
        SELECT 
            t.*,
            u.username, u.firstname, u.lastname
        FROM loan_transaction t
        LEFT JOIN system_users u ON t.user_id = u.id
        ${whereClause}
        ORDER BY t.created_at DESC
        LIMIT ? OFFSET ?
        `;

    try {
        const totalResult = await AppDataSource.query(countQuery, parameters);
        const _total = parseInt(totalResult[0].total);
        const transactions = await AppDataSource.query(query, parameters);

        if (transactions.length === 0) {
            return res.error('No transactions found');
        }

        return res.success('Get Transactions Success', transactions, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};