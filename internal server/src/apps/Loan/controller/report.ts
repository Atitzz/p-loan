import { LoanPlan } from '../entities/loan_plan';
import { AppDataSource, orm } from "../../../data-source";
import { Loan } from '../entities/loan';
import { Installment } from '../entities/loan_installment';
import { loan_status } from "../../Utils/enum"
import { Users } from '../../Users/entities';
import { sendNotificationEmail } from "../../Notification/controller"
import { MoreThanOrEqual, LessThanOrEqual, Between, Not, LessThan, IsNull, In } from "typeorm"
import { LoanContract } from '../entities/loan_contract';
import { Line_SendNotificate } from "../../Line_Message/module"
import { File_Manager } from "../../FileManager/entities/File_Manager";
import { v4 as uuidv4 } from 'uuid';
import { Application_Form } from "../entities/loan_applicationform";
import { Tax } from '../entities/tax';


export const report_newLoan = async (req, res) => {
    try {
        const { search, page, limit, start, end } = req.query;
        const perPage = parseInt(limit) || 20;
        const offset = (parseInt(page) - 1) * perPage || 0;
        const parameters = [];

        let whereClause = 'l.status = "Running" AND l.total_paid = 0';

        if (start && end) {
            whereClause += ' AND l.approved_at BETWEEN ? AND ?';
            parameters.push(new Date(`${start}T00:00:00`));
            parameters.push(new Date(`${end}T23:59:59`));
        }

        if (search) {
            whereClause += ` AND (
                LOWER(u.citizen_id) LIKE LOWER(?) 
                OR LOWER(l.loan_number) LIKE LOWER(?) 
                OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)
            )`;
            parameters.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
        }

        parameters.push(perPage, offset);

        const countQuery = `
          SELECT COUNT(*) AS total
          FROM loan l
          LEFT JOIN system_users u ON l.user_id = u.id
            LEFT JOIN loan_plan lp ON lp.id = l.plan_id
            LEFT JOIN loan_installment li ON li.loan_id = l.id
          WHERE ${whereClause}
      `;

        const loansQuery = `
                SELECT 
                    l.id, l.approved_at, l.loan_number, l.amount,
                    l.total_installment, l.startDate, l.endDate,
                    l.per_installment,
                    l.remaining, l.installment_due,
                    l.loan_interest,
                    u.citizen_id, u.firstname, u.lastname,
                    lp.fixed_charge, 
                    lp.fixed_charge AS fixed_charge2,
                    lp.fixed_charge2 AS fixed_charge3, 
                    lp.application_percent_charge,
                    MAX(li.given_at) as last_payment_date 
                FROM 
                    loan l
                LEFT JOIN system_users u ON u.id = l.user_id
                LEFT JOIN loan_plan lp ON lp.id = l.plan_id
                LEFT JOIN loan_installment li ON li.loan_id = l.id
                WHERE ${whereClause}
            GROUP BY 
                l.id, u.citizen_id, u.firstname, u.lastname, li.given_at
            ORDER BY l.id DESC
            LIMIT ? OFFSET ?
            `;

        const totalResult = await AppDataSource.query(countQuery, parameters);
        const _total = parseInt(totalResult[0].total);

        const loans = await AppDataSource.query(loansQuery, parameters);
        loans.forEach((loan) => {
            loan.interest_rate = Number(loan.loan_interest) + Number(loan.application_percent_charge);
        });
        if (loans.length === 0) return res.error("ไม่พบรายการสินเชื่อ");

        const total_loan = loans.length;
        const total_amount = loans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0);

        const total = { total_loan, total_amount }
        return res.success("Report new loan", { data: loans, total }, _total);

    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};

// รายงาน ภาระหนี้/การจัดเก็บ
export const report_installment = async (req, res) => {
    try {
        const { search, page, limit, start, end } = req.query;
        const perPage = parseInt(limit) || 20;
        const offset = (parseInt(page) - 1) * perPage || 0;
        const parameters = [];

        let whereClause = '';
        if (start && end) {
            whereClause += 'i.given_at BETWEEN ? AND ?';
            parameters.push(new Date(`${start}T00:00:00`));
            parameters.push(new Date(`${end}T23:59:59`));
        } else {
            whereClause = '1=1'; // หรือ 'i.isPaid = true' ถ้าต้องการแสดงเฉพาะงวดที่จ่ายแล้วโดยไม่ต้องระบุวันที่
        }

        if (search) {
            whereClause += whereClause ? ' AND ' : '';
            whereClause += '(LOWER(l.loan_number) LIKE LOWER(?) OR LOWER(u.firstname) LIKE LOWER(?))';
            parameters.push(`%${search}%`, `%${search}%`);
        }


        parameters.push(perPage, offset);


        const query = `
        SELECT 
            i.id,
            i.given_at,
            l.loan_number, 
            u.username, u.firstname, u.lastname, u.citizen_id,
            ROW_NUMBER() OVER (PARTITION BY i.loan_id ORDER BY i.installment_date) AS installment_number,
            i.per_installment,
            i.principle_installment,
            i.interest_installment,
            i.paid,
            i.principle_paid,
            i.interest_paid,
            i.overdue_balance
        FROM 
            loan_installment i
        LEFT JOIN loan l ON i.loan_id = l.id
        LEFT JOIN system_users u ON u.id = l.user_id
        WHERE ${whereClause} AND i.isPaid = true
        ORDER BY 
            i.installment_date ASC
        LIMIT 
            ? OFFSET ?
        `;

        const result = await AppDataSource.query(query, parameters);

        return res.success("Installment Payments Report", result);

    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const report_due = async (req, res) => {
    try {
        const { search, page, limit, start, end } = req.query;
        const perPage = parseInt(limit) || 20;
        const offset = (parseInt(page) - 1) * perPage || 0;
        const parameters = [];

        let whereClause = 'l.status = "Due" AND isPaid = false';  // เพิ่มเงื่อนไข status = 'Due'

        if (start && end) {
            whereClause += ' AND l.installment_due BETWEEN ? AND ?';
            parameters.push(new Date(`${start}T00:00:00`));
            parameters.push(new Date(`${end}T23:59:59`));
        }

        if (search) {
            whereClause += ' AND (LOWER(l.loan_number) LIKE LOWER(?) OR LOWER(u.firstname) LIKE LOWER(?))';
            parameters.push(`%${search}%`, `%${search}%`);
        }

        parameters.push(perPage, offset);

        const query = `
            WITH RankedInstallments AS (
                SELECT 
                    i.id,
                    i.given_at,
                    l.loan_number, 
                    u.username, u.firstname, u.lastname, u.citizen_id,
                    ROW_NUMBER() OVER (PARTITION BY i.loan_id ORDER BY i.installment_date DESC) AS rn,
                    i.installment_date,
                    i.per_installment,
                    i.principle_installment,
                    i.interest_installment,
                    i.paid,
                    i.principle_paid,
                    i.interest_paid,
                    i.overdue_balance,
                    l.principle
                FROM 
                    loan_installment i
                LEFT JOIN loan l ON i.loan_id = l.id
                LEFT JOIN system_users u ON u.id = l.user_id
                WHERE ${whereClause} AND i.overdue_balance > 0
            )
            SELECT * FROM RankedInstallments WHERE rn = 1
            ORDER BY installment_date ASC
            LIMIT ? OFFSET ?
            `;

        const result = await AppDataSource.query(query, parameters);

        return res.success("Installment Payments Report", result);

    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};



// ----------------------------------- รายงาน ----------------------------------- //


// รายงานหน้า 1
export const report_1 = async (req, res) => {
    try {
        const { start, end } = req.query;

        let whereClause = '';
        const parameters = [];

        const loanRanges = [
            'ไม่เกิน 10,000',
            '10,000.01 - 20,000.00',
            '20,000.01 - 30,000.00',
            '30,000.01 - 40,000.00',
            '40,000.01 - 50,000.00',
        ];

        const generateReport = async (isGuarantee) => {
            let guaranteeCondition = '';
            if (isGuarantee) {
                guaranteeCondition = `
                    (
                        l.guarantee IS NOT NULL 
                        AND l.guarantee != '' 
                    )
                `;
            } else {
                guaranteeCondition = `
                    (
                        l.guarantee IS NULL 
                        OR l.guarantee = ''
                    )
                `;
            }

            const query = `
                WITH AllLoan AS (
                    SELECT
                        l.id AS loan_id,
                        l.amount,
                        l.principle AS remaining,
                        l.status,
                        l.total_installment,
                        l.installment_due,
                        l.total_paid,
                        l.loan_interest,
                        l.startDate,
                        CASE 
                            WHEN l.status = 'Bad' AND l.closed_at BETWEEN ? AND ? THEN 'Bad'
                            WHEN l.status = 'Running' AND l.total_paid = 0
                                AND l.startDate BETWEEN ? AND ? THEN 'Pending'
                            WHEN l.status = 'Running' 
                                AND l.installment_start BETWEEN ? AND ? THEN 'Running'
                            ELSE l.status
                        END AS calculated_status
                    FROM loan l
                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name
                    LEFT JOIN loan_installment i ON l.id = i.loan_id
                    WHERE ${guaranteeCondition} AND l.status != 'Paid'
                    AND (
                        l.closed_at BETWEEN ? AND ? 
                        OR l.startDate BETWEEN ? AND ? 
                        OR l.installment_start BETWEEN ? AND ?
                    )
                    GROUP BY l.id, l.amount, l.principle, l.status, l.startDate, l.installment_due, l.total_paid, l.loan_interest
                ),
                OverdueLoans AS (
                    SELECT
                        l.id AS loan_id,
                        l.amount,
                        l.principle AS remaining,
                        l.status,
                        l.total_installment,
                        l.installment_due,
                        l.total_paid,
                        l.loan_interest,
                        l.startDate,
                        CASE 
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 31 AND 90 THEN 'overdue_1_3_months'
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 91 AND 180 THEN 'overdue_3_6_months'
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 181 AND 365 THEN 'overdue_6_12_months'
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) > 365 THEN 'overdue_12_months_plus'
                            ELSE 'Other'
                        END AS calculated_status
                    FROM loan l
                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name
                    LEFT JOIN loan_installment i ON l.id = i.loan_id
                    WHERE ${guaranteeCondition} AND l.status != 'Paid'
                    AND l.installment_due <= ?
                    GROUP BY l.id, l.amount, l.principle, l.status, l.startDate, l.installment_due, l.total_paid, l.loan_interest
                )
                SELECT 
                    CASE 
                        WHEN amount <= 10000 THEN 'ไม่เกิน 10,000'
                        WHEN amount BETWEEN 10000.01 AND 20000 THEN '10,000.01 - 20,000.00'
                        WHEN amount BETWEEN 20000.01 AND 30000 THEN '20,000.01 - 30,000.00'
                        WHEN amount BETWEEN 30000.01 AND 40000 THEN '30,000.01 - 40,000.00'
                        WHEN amount BETWEEN 40000.01 AND 50000 THEN '40,000.01 - 50,000.00'
                       
                    END AS loan_range,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status IN ('Running', 'Pending', 'Bad', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus') THEN loan_id 
                    END) AS loan_running,
                    SUM(CASE 
                        WHEN calculated_status IN ('Running', 'Pending', 'Bad', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus') THEN remaining
                        ELSE 0 
                    END) AS running_total_principle,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'Pending' THEN loan_id 
                    END) AS loan_pending,
                    SUM(CASE 
                        WHEN calculated_status = 'Pending' THEN remaining
                        ELSE 0 
                    END) AS pending_total_amount,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_1_3_months' THEN loan_id 
                    END) AS overdue_1_3_months,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_1_3_months' THEN remaining
                        ELSE 0 
                    END) AS overdue_1_3_months_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_3_6_months' THEN loan_id 
                    END) AS overdue_3_6_months,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_3_6_months' THEN remaining 
                        ELSE 0 
                    END) AS overdue_3_6_months_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_6_12_months' THEN loan_id 
                    END) AS overdue_6_12_months,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_6_12_months' THEN remaining
                        ELSE 0 
                    END) AS overdue_6_12_months_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_12_months_plus' THEN loan_id 
                    END) AS overdue_12_months_plus,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_12_months_plus' THEN remaining
                        ELSE 0 
                    END) AS overdue_12_months_plus_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'Bad' THEN loan_id 
                    END) AS bad_count,
                    SUM(CASE 
                        WHEN calculated_status = 'Bad' THEN remaining
                        ELSE 0 
                    END) AS bad_total,
                    GROUP_CONCAT(DISTINCT loan_interest) AS loan_interests
                FROM (
                    SELECT * FROM AllLoan
                    UNION ALL
                    SELECT * FROM OverdueLoans
                ) l
                GROUP BY loan_range
                HAVING loan_range IS NOT NULL;
            `;

            const startDate = new Date(`${start}T00:00:00`);
            const endDate = new Date(`${end}T23:59:59`);

            const result = await AppDataSource.query(query, [
                startDate, endDate,     // สำหรับ Bad
                startDate, endDate,     // สำหรับ Pending
                startDate, endDate,     // สำหรับ running
                startDate, endDate,     // สำหรับ closed
                startDate, endDate,     // สำหรับ startDate
                startDate, endDate,     // สำหรับ installment_start
                startDate,               // overdue 1-3 months
                startDate,               // overdue 3-6 months
                startDate,               // overdue 6-12 months
                startDate,               // overdue 12+ months
                startDate                // สำหรับ installment_start ของ overdue
            ]);

            const initialData = loanRanges.map(range => ({
                loan_range: range,
                loan_running: 0,
                running_total_principle: 0,
                loan_pending: 0,
                pending_total_amount: 0,
                overdue_1_3_months: 0,
                overdue_1_3_months_total: 0,
                overdue_3_6_months: 0,
                overdue_3_6_months_total: 0,
                overdue_6_12_months: 0,
                overdue_6_12_months_total: 0,
                overdue_12_months_plus: 0,
                overdue_12_months_plus_total: 0,
                bad_count: 0,
                bad_total: 0,
            }));

            const interestRates = new Set<number>();

            const processedResults = initialData.map(defaultItem => {
                const matchedItem = result.find(item => item.loan_range === defaultItem.loan_range) || {};
                const mergedItem = { ...defaultItem, ...matchedItem };

                const interestrateShow = Number(mergedItem.loan_running || 0) > 0 ||
                    Number(mergedItem.loan_pending || 0) > 0 ||
                    Number(mergedItem.overdue_1_3_months || 0) > 0 ||
                    Number(mergedItem.overdue_3_6_months || 0) > 0 ||
                    Number(mergedItem.overdue_6_12_months || 0) > 0 ||
                    Number(mergedItem.overdue_12_months_plus || 0) > 0 ||
                    Number(mergedItem.bad_count || 0) > 0;

                if (interestrateShow && mergedItem.loan_interests) {
                    const interests = mergedItem.loan_interests.split(',').map(Number);
                    interests.forEach(interest => {
                        if (!isNaN(interest)) {
                            interestRates.add(interest);
                        }
                    });
                }

                delete mergedItem.loan_interests;

                return {
                    ...mergedItem,
                    loan_running: Number(mergedItem.loan_running || 0),
                    running_total_principle: Number(mergedItem.running_total_principle || 0),
                    loan_pending: Number(mergedItem.loan_pending || 0),
                    pending_total_amount: Number(mergedItem.pending_total_amount || 0),
                    overdue_1_3_months: Number(mergedItem.overdue_1_3_months || 0),
                    overdue_1_3_months_total: Number(mergedItem.overdue_1_3_months_total || 0),
                    overdue_3_6_months: Number(mergedItem.overdue_3_6_months || 0),
                    overdue_3_6_months_total: Number(mergedItem.overdue_3_6_months_total || 0),
                    overdue_6_12_months: Number(mergedItem.overdue_6_12_months || 0),
                    overdue_6_12_months_total: Number(mergedItem.overdue_6_12_months_total || 0),
                    overdue_12_months_plus: Number(mergedItem.overdue_12_months_plus || 0),
                    overdue_12_months_plus_total: Number(mergedItem.overdue_12_months_plus_total || 0),
                    bad_count: Number(mergedItem.bad_count || 0),
                    bad_total: Number(mergedItem.bad_total || 0),
                };
            });

            const interestRateArray = Array.from(interestRates).sort((a, b) => a - b).join(', ');
            return {
                processedResults,
                interestRates: {
                    total_interest: interestRates.size,
                    interest_rate: interestRateArray
                }
            };
        };

        const { processedResults: notGuaranteeReport, interestRates: totalInterestNotGuarantee } = await generateReport(false);
        const { processedResults: guaranteeReport, interestRates: totalInterestGuarantee } = await generateReport(true);

        const guaranteeSummary = {
            total_interest: totalInterestGuarantee.total_interest,
            interest_rate: totalInterestGuarantee.interest_rate
        };

        const notGuaranteeSummary = {
            total_interest: totalInterestNotGuarantee.total_interest,
            interest_rate: totalInterestNotGuarantee.interest_rate
        };

        const guaranteeTotal = {
            loan_range: 'รวม',
            loan_running: 0,
            running_total_principle: 0,
            loan_pending: 0,
            pending_total_amount: 0,
            overdue_1_3_months: 0,
            overdue_1_3_months_total: 0,
            overdue_3_6_months: 0,
            overdue_3_6_months_total: 0,
            overdue_6_12_months: 0,
            overdue_6_12_months_total: 0,
            overdue_12_months_plus: 0,
            overdue_12_months_plus_total: 0,
            bad_count: 0,
            bad_total: 0,
        };

        for (const item of guaranteeReport) {
            guaranteeTotal.loan_running += Number(item.loan_running);
            guaranteeTotal.running_total_principle += Number(item.running_total_principle);
            guaranteeTotal.loan_pending += Number(item.loan_pending);
            guaranteeTotal.pending_total_amount += Number(item.pending_total_amount);
            guaranteeTotal.overdue_1_3_months += Number(item.overdue_1_3_months);
            guaranteeTotal.overdue_1_3_months_total += Number(item.overdue_1_3_months_total);
            guaranteeTotal.overdue_3_6_months += Number(item.overdue_3_6_months);
            guaranteeTotal.overdue_3_6_months_total += Number(item.overdue_3_6_months_total);
            guaranteeTotal.overdue_6_12_months +=guaranteeTotal.overdue_6_12_months += Number(item.overdue_6_12_months);
            guaranteeTotal.overdue_6_12_months_total += Number(item.overdue_6_12_months_total);
            guaranteeTotal.overdue_12_months_plus += Number(item.overdue_12_months_plus);
            guaranteeTotal.overdue_12_months_plus_total += Number(item.overdue_12_months_plus_total);
            guaranteeTotal.bad_count += Number(item.bad_count);
            guaranteeTotal.bad_total += Number(item.bad_total);
        }

        const notGuaranteeTotal = {
            loan_range: 'รวม',
            loan_running: 0,
            running_total_principle: 0,
            loan_pending: 0,
            pending_total_amount: 0,
            overdue_1_3_months: 0,
            overdue_1_3_months_total: 0,
            overdue_3_6_months: 0,
            overdue_3_6_months_total: 0,
            overdue_6_12_months: 0,
            overdue_6_12_months_total: 0,
            overdue_12_months_plus: 0,
            overdue_12_months_plus_total: 0,
            bad_count: 0,
            bad_total: 0,
        };

        for (const item of notGuaranteeReport) {
            notGuaranteeTotal.loan_running += Number(item.loan_running);
            notGuaranteeTotal.running_total_principle += Number(item.running_total_principle);
            notGuaranteeTotal.loan_pending += Number(item.loan_pending);
            notGuaranteeTotal.pending_total_amount += Number(item.pending_total_amount);
            notGuaranteeTotal.overdue_1_3_months += Number(item.overdue_1_3_months);
            notGuaranteeTotal.overdue_1_3_months_total += Number(item.overdue_1_3_months_total);
            notGuaranteeTotal.overdue_3_6_months += Number(item.overdue_3_6_months);
            notGuaranteeTotal.overdue_3_6_months_total += Number(item.overdue_3_6_months_total);
            notGuaranteeTotal.overdue_6_12_months += Number(item.overdue_6_12_months);
            notGuaranteeTotal.overdue_6_12_months_total += Number(item.overdue_6_12_months_total);
            notGuaranteeTotal.overdue_12_months_plus += Number(item.overdue_12_months_plus);
            notGuaranteeTotal.overdue_12_months_plus_total += Number(item.overdue_12_months_plus_total);
            notGuaranteeTotal.bad_count += Number(item.bad_count);
            notGuaranteeTotal.bad_total += Number(item.bad_total);
        }

        guaranteeReport.push(guaranteeTotal);
        notGuaranteeReport.push(notGuaranteeTotal);

        const totalAll = {
            loan_range: 'รวมทั้งหมด',
            loan_running: notGuaranteeTotal.loan_running + guaranteeTotal.loan_running,
            running_total_principle: notGuaranteeTotal.running_total_principle + guaranteeTotal.running_total_principle,
            loan_pending: notGuaranteeTotal.loan_pending + guaranteeTotal.loan_pending,
            pending_total_amount: notGuaranteeTotal.pending_total_amount + guaranteeTotal.pending_total_amount,
            overdue_1_3_months: notGuaranteeTotal.overdue_1_3_months + guaranteeTotal.overdue_1_3_months,
            overdue_1_3_months_total: notGuaranteeTotal.overdue_1_3_months_total + guaranteeTotal.overdue_1_3_months_total,
            overdue_3_6_months: notGuaranteeTotal.overdue_3_6_months + guaranteeTotal.overdue_3_6_months,
            overdue_3_6_months_total: notGuaranteeTotal.overdue_3_6_months_total + guaranteeTotal.overdue_3_6_months_total,
            overdue_6_12_months: notGuaranteeTotal.overdue_6_12_months + guaranteeTotal.overdue_6_12_months,
            overdue_6_12_months_total: notGuaranteeTotal.overdue_6_12_months_total + guaranteeTotal.overdue_6_12_months_total,
            overdue_12_months_plus: notGuaranteeTotal.overdue_12_months_plus + guaranteeTotal.overdue_12_months_plus,
            overdue_12_months_plus_total: notGuaranteeTotal.overdue_12_months_plus_total + guaranteeTotal.overdue_12_months_plus_total,
            bad_count: notGuaranteeTotal.bad_count + guaranteeTotal.bad_count,
            bad_total: notGuaranteeTotal.bad_total + guaranteeTotal.bad_total,
        };

        return res.success('Loan report generated successfully', {
            guaranteeSummary,
            guaranteeReport,
            notGuaranteeSummary,
            notGuaranteeReport,
            // totalAll,
        });
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};



export const report_2 = async (req, res) => {
    try {
        const { start, end } = req.query;

        const propertyTypesQuery = `
            SELECT name 
            FROM loan_property
            ORDER BY \`index\` ASC;
        `;
        const propertyTypes = await AppDataSource.query(propertyTypesQuery);

        const guaranteeTypesQuery = `
            SELECT name, type 
            FROM loan_guarantee
            ORDER BY \`index\` ASC;
        `;
        const guaranteeTypes = await AppDataSource.query(guaranteeTypesQuery);

        const generateReportForType = async (typeName, guaranteeName) => {
            const query = `
                WITH LoanData AS (
                    SELECT
                        l.id AS loan_id,
                        l.amount,
                        l.principle AS remaining,
                        l.status,
                        l.total_installment,
                        l.installment_due,
                        l.total_paid,
                        l.plan_id,
                        startDate,
                        CASE 
                            WHEN l.status = 'Bad' AND l.closed_at BETWEEN ? AND ? THEN 'Bad'
                            WHEN l.status = 'Running' AND l.total_paid = 0 AND l.startDate BETWEEN ? AND ? THEN 'Pending'
                            WHEN l.status = 'Running' AND l.installment_start BETWEEN ? AND ? THEN 'Running'
                            ELSE l.status
                        END AS calculated_status
                    FROM loan l
                    LEFT JOIN loan_installment i ON l.id = i.loan_id
                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name
                    WHERE l.status != 'Paid' AND l.status != 'Pending'
                    AND lg.type = ?
                    AND lg.name = ?
                    AND (
                        l.closed_at BETWEEN ? AND ? 
                        OR l.startDate BETWEEN ? AND ? 
                        OR l.installment_start BETWEEN ? AND ?
                    )
                    GROUP BY l.id, l.amount, l.principle, l.status, l.installment_due, l.total_paid, l.plan_id, startDate
                ),
                OverdueLoans AS (
                    SELECT
                        l.id AS loan_id,
                        l.amount,
                        l.principle AS remaining,
                        l.status,
                        l.total_installment,
                        l.installment_due,
                        l.total_paid,
                        l.plan_id,
                        startDate,
                        CASE 
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 31 AND 90 THEN 'overdue_1_3_months'
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 91 AND 180 THEN 'overdue_3_6_months'
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) BETWEEN 181 AND 365 THEN 'overdue_6_12_months'
                            WHEN l.status = 'Running' AND TIMESTAMPDIFF(DAY, l.installment_due, DATE(?)) > 365 THEN 'overdue_12_months_plus'
                            ELSE 'Other'
                        END AS calculated_status
                    FROM loan l
                    LEFT JOIN loan_installment i ON l.id = i.loan_id
                    LEFT JOIN loan_guarantee lg ON l.guarantee = lg.name
                    WHERE l.status != 'Paid'  AND l.status != 'Pending'
                    AND lg.type = ?
                    AND lg.name = ?
                    AND l.installment_due <= ?
                    GROUP BY l.id, l.amount, l.principle, l.status, l.installment_due, l.total_paid, l.plan_id, startDate
                ),
                CombinedLoans AS (
                    SELECT * FROM LoanData
                    UNION ALL
                    SELECT * FROM OverdueLoans
                )
                SELECT 
                    '${guaranteeName}' AS name,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status IN ('Running', 'Pending', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus', 'Bad') THEN loan_id 
                    END) AS loan_running,
                    SUM(CASE 
                        WHEN calculated_status IN ('Running', 'Pending', 'overdue_1_3_months', 'overdue_3_6_months', 'overdue_6_12_months', 'overdue_12_months_plus', 'Bad') THEN remaining 
                        ELSE 0 
                    END) AS running_total_principle,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'Pending' THEN loan_id 
                    END) AS loan_pending,
                    SUM(CASE 
                        WHEN calculated_status = 'Pending' THEN remaining 
                        ELSE 0 
                    END) AS pending_total_amount,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_1_3_months' THEN loan_id 
                    END) AS overdue_1_3_months,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_1_3_months' THEN remaining 
                        ELSE 0 
                    END) AS overdue_1_3_months_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_3_6_months' THEN loan_id 
                    END) AS overdue_3_6_months,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_3_6_months' THEN remaining 
                        ELSE 0 
                    END) AS overdue_3_6_months_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_6_12_months' THEN loan_id 
                    END) AS overdue_6_12_months,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_6_12_months' THEN remaining 
                        ELSE 0 
                    END) AS overdue_6_12_months_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'overdue_12_months_plus' THEN loan_id 
                    END) AS overdue_12_months_plus,
                    SUM(CASE 
                        WHEN calculated_status = 'overdue_12_months_plus' THEN remaining 
                        ELSE 0 
                    END) AS overdue_12_months_plus_total,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'Bad' THEN loan_id 
                    END) AS bad_count,
                    SUM(CASE 
                        WHEN calculated_status = 'Bad' THEN remaining 
                        ELSE 0 
                    END) AS bad_total
                FROM CombinedLoans
                GROUP BY name;
            `;

            const startDate = new Date(`${start}T00:00:00`);
            const endDate = new Date(`${end}T23:59:59`);

            const result = await AppDataSource.query(query, [
                startDate, endDate, startDate, endDate, startDate, endDate, typeName, guaranteeName, startDate, endDate, startDate, endDate, startDate, endDate,
                startDate, startDate, startDate, startDate, typeName, guaranteeName, startDate
            ]);

            // หากไม่มีข้อมูล ให้แสดงผลเป็น 0
            if (result.length === 0) {
                return [{
                    name: guaranteeName,
                    loan_running: 0,
                    running_total_principle: 0,
                    loan_pending: 0,
                    pending_total_amount: 0,
                    overdue_1_3_months: 0,
                    overdue_1_3_months_total: 0,
                    overdue_3_6_months: 0,
                    overdue_3_6_months_total: 0,
                    overdue_6_12_months: 0,
                    overdue_6_12_months_total: 0,
                    overdue_12_months_plus: 0,
                    overdue_12_months_plus_total: 0,
                    bad_count: 0,
                    bad_total: 0
                }];
            }

            return result;
        };

        const resultsByProperty = {};

        for (const property of propertyTypes) {
            const guarantees = guaranteeTypes.filter(g => g.type === property.name);
            const resultForProperty = [];
            let count = 1;
            for (const guarantee of guarantees) {
                const result = await generateReportForType(guarantee.type, guarantee.name);
                resultForProperty.push(...result.map((r) => ({
                    ...r,
                    set: `${propertyTypes.indexOf(property) + 1}.${count++} ${r.name}` // ลำดับของหลักประกันในประเภทนั้น ๆ
                })));
            }

            resultsByProperty[property.name] = resultForProperty;
        }

        return res.success('Loan report generated successfully', resultsByProperty);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const report_3 = async (req, res) => {
    try {
        const { start, end } = req.query;
        const parameters = [];

        let whereClause = '';

        // if (start && end) {
        //     whereClause = 'l.installment_start BETWEEN ? AND ?';
        //     parameters.push(new Date(`${start}T00:00:00`));
        //     parameters.push(new Date(`${end}T23:59:59`));
        // } else if (start) {
        //     whereClause = 'l.installment_start >= ?';
        //     parameters.push(new Date(`${start}T00:00:00`));
        // } else if (end) {
        //     whereClause = 'l.installment_start <= ?';
        //     parameters.push(new Date(`${end}T23:59:59`));
        // }

        // let guaranteeCondition = `
        //     (
        //         (JSON_UNQUOTE(JSON_EXTRACT(l.application_form, '$.guarantee')) IS NOT NULL
        //         AND JSON_UNQUOTE(JSON_EXTRACT(l.application_form, '$.guarantee')) != '')
        //         OR
        //         (JSON_UNQUOTE(JSON_EXTRACT(l.application_form, '$.property_insurance')) IS NOT NULL
        //         AND JSON_UNQUOTE(JSON_EXTRACT(l.application_form, '$.property_insurance')) != '')
        //     )
        // `;


        const query = `
            WITH LoanData AS (
                SELECT
                    l.user_id,
                    l.reference,
                    GROUP_CONCAT(l.id) AS loan_ids,
                    SUM(l.amount) AS amount,
                    SUM(l.principle) AS remaining,
                    l.status,
                    l.total_installment AS total_installment,
                    l.installment_due AS installment_due,
                    SUM(l.total_paid) AS total_paid,
                    l.plan_id AS plan_id,
                    l.closed_at,
                    l.installment_start,
                    l.approved_at,
                    l.startDate,
                    CASE 
                        WHEN l.status = 'Running' AND SUM(l.total_paid) > 0 AND l.installment_start BETWEEN ? AND ? THEN 'Running'
                        WHEN l.status = 'Running' AND SUM(l.total_paid) = 0 AND l.startDate BETWEEN ? AND ? THEN 'Newloan'
                        WHEN l.status = 'Running' AND l.approved_at BETWEEN ? AND ? THEN 'Approve'
                        ELSE l.status
                    END AS calculated_status
                FROM loan l
                WHERE ${whereClause ? `(${whereClause}) AND` : ''} l.status != 'Paid' AND l.status != 'Pending'
                AND (
                    l.approved_at BETWEEN ? AND ? 
                    OR l.startDate BETWEEN ? AND ? 
                    OR l.installment_start BETWEEN ? AND ?
                )
                GROUP BY l.user_id, l.reference, l.status, l.startDate, l.total_installment, l.installment_due, l.plan_id, l.closed_at, l.installment_start, l.approved_at
            ),
            LoanReport AS (
                SELECT 
                    CASE 
                        WHEN amount <= 10000 THEN 'ไม่เกิน 10,000'
                        WHEN amount BETWEEN 10000.01 AND 20000 THEN '10,000.01 - 20,000.00'
                        WHEN amount BETWEEN 20000.01 AND 30000 THEN '20,000.01 - 30,000.00'
                        WHEN amount BETWEEN 30000.01 AND 40000 THEN '30,000.01 - 40,000.00'
                        WHEN amount BETWEEN 40000.01 AND 50000 THEN '40,000.01 - 50,000.00'
                        WHEN amount BETWEEN 50000.01 AND 60000 THEN '50,000.01 - 60,000.00'
                        WHEN amount BETWEEN 60000.01 AND 70000 THEN '60,000.01 - 70,000.00'
                        WHEN amount BETWEEN 70000.01 AND 80000 THEN '70,000.01 - 80,000.00'
                        WHEN amount BETWEEN 80000.01 AND 90000 THEN '80,000.01 - 90,000.00'
                        WHEN amount BETWEEN 90000.01 AND 100000 THEN '90,000.01 - 100,000.00'
                        WHEN amount > 100000 THEN 'มากกว่า 100,000'
                    END AS loan_range,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status IN ('Approve', 'Newloan', 'Running') THEN user_id
                    END) AS loan_approve,
                    SUM(CASE 
                        WHEN calculated_status IN ('Approve', 'Newloan', 'Running') THEN amount 
                        ELSE 0 
                    END) AS approve_total_amount,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'Running' THEN user_id
                    END) AS loan_running,
                    SUM(CASE 
                        WHEN calculated_status = 'Running' THEN remaining 
                        ELSE 0 
                    END) AS running_total_amount,
                    COUNT(DISTINCT CASE 
                        WHEN calculated_status = 'Newloan' THEN user_id
                    END) AS loan_new,
                    SUM(CASE 
                        WHEN calculated_status = 'Newloan' THEN remaining 
                        ELSE 0 
                    END) AS new_total_amount,
                    GROUP_CONCAT(DISTINCT reference) AS references_list,
                    GROUP_CONCAT(DISTINCT loan_ids) AS all_loan_ids
                FROM LoanData l
                GROUP BY loan_range
            )
            SELECT * FROM LoanReport;
        `;


        const startDate = new Date(`${start}T00:00:00`)
        const endDate = new Date(`${end}T23:59:59`)

        const report = await AppDataSource.query(query, [
            startDate, endDate, startDate, endDate, startDate, endDate,
            startDate, endDate, startDate, endDate, startDate, endDate
        ]).then(result => {
            // console.log("Raw Result from Query:", result);
            return result.map(item => ({
                loan_range: item.loan_range,
                loan_approve: Number(item.loan_approve),
                approve_total_amount: Number(item.approve_total_amount),
                loan_running: Number(item.loan_running),
                running_total_amount: Number(item.running_total_amount),
                loan_new: Number(item.loan_new),
                new_total_amount: Number(item.new_total_amount),
            }));
        });
        // กำหนดช่วงยอดที่ต้องการแสดง
        const loanRanges = [
            'ไม่เกิน 10,000',
            '10,000.01 - 20,000.00',
            '20,000.01 - 30,000.00',
            '30,000.01 - 40,000.00',
            '40,000.01 - 50,000.00',
            '50,000.00 - 60,000.00',
            '60,000.01 - 70,000.00',
            '70,000.01 - 80,000.00',
            '80,000.01 - 90,000.00',
            '90,000.01 - 100,000.00',
            'มากกว่า 100,000',
        ];

        // ตรวจสอบว่าแต่ละช่วงยอดมีข้อมูลหรือไม่ ถ้าไม่มีให้ใส่ค่า 0
        const fullReport = loanRanges.map(range => {
            const found = report.find(r => r.loan_range === range);
            return found || {
                loan_range: range,
                loan_approve: 0,
                approve_total_amount: 0,
                loan_running: 0,
                running_total_amount: 0,
                loan_new: 0,
                new_total_amount: 0
            };
        })

        // คำนวณยอดรวม
        let totalReport = {
            loan_range: 'รวม',
            loan_approve: 0,
            approve_total_amount: 0,
            loan_running: 0,
            running_total_amount: 0,
            loan_new: 0,
            new_total_amount: 0
        };

        fullReport.forEach(item => {
            totalReport.loan_approve += Number(item.loan_approve);
            totalReport.approve_total_amount += Number(item.approve_total_amount);
            totalReport.loan_running += Number(item.loan_running);
            totalReport.running_total_amount += Number(item.running_total_amount);
            totalReport.loan_new += Number(item.loan_new);
            totalReport.new_total_amount += Number(item.new_total_amount);
        });

        fullReport.push(totalReport);

        return res.success('Loan report generated successfully', fullReport);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const report_stamp = async (req, res) => {
    try {
        const { search, page, limit, start, end } = req.query;
        const perPage = parseInt(limit) || 20;
        const offset = (parseInt(page) - 1) * perPage || 0;
        const parameters = [];

        let whereClause = 'l.status != "Pending" AND l.status != "Rejected"';

        if (start && end) {
            whereClause += ' AND l.created_at BETWEEN ? AND ?';
            parameters.push(new Date(`${start}T00:00:00`));
            parameters.push(new Date(`${end}T23:59:59`));
        }

        if (search) {
            whereClause += ` AND (LOWER(l.loan_number) LIKE LOWER(?) 
            OR LOWER(u.citizen_id) LIKE LOWER(?) 
            OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)
            `;
            parameters.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
        }

        parameters.push(perPage, offset);

        const countQuery = `
          SELECT COUNT(*) AS total
          FROM loan l
            LEFT JOIN system_users u ON u.id = l.user_id
            LEFT JOIN loan_contract lc ON lc.loan_id = l.id
          WHERE ${whereClause}
      `;


      const query = `
            SELECT 
                l.id AS loan_id,
                l.created_at,
                l.loan_number, 
                l.amount,
                u.username, u.firstname, u.lastname, u.citizen_id,
                l.reference,
                MAX(lc.id) AS contract_id,
                MAX(lc.stamp) AS stamp,
                MAX(lc.document) AS document
            FROM 
                loan l
            LEFT JOIN loan_contract lc ON lc.loan_id = l.id
            LEFT JOIN system_users u ON u.id = l.user_id
            WHERE ${whereClause}
            GROUP BY 
                l.id, u.username, u.firstname, u.lastname, u.citizen_id, l.reference
            ORDER BY 
                l.created_at DESC
            LIMIT 
                ? OFFSET ?
        `;
  

        const totalResult = await AppDataSource.query(countQuery, parameters);
        const _total = parseInt(totalResult[0].total);

        const result = await AppDataSource.query(query, parameters);
        if (result.length === 0) return res.error("ไม่พบรายการสินเชื่อ");

        const total_loan = result.length;
        const total_amount = {
            amount: Number(result.reduce((sum, item) => sum + Number(item.amount), 0)),
            stamp: Number(result.reduce((sum, item) => sum + Number(item.stamp), 0)),
            document: Number(result.reduce((sum, item) => sum + Number(item.document), 0))
        };

        const total = {
            total_loan,
            ...total_amount
        }


        return res.success("Installment Payments Report", { data: result, total }, _total);

    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const tax = async (req, res) => {
    try {
        const { search, page, limit, start, end } = req.query;
        const perPage = parseInt(limit) || 20;
        const offset = (parseInt(page) - 1) * perPage || 0;
        const parameters = [];

        let whereClause = '';
        if (start && end) {
            whereClause = 'i.given_at BETWEEN ? AND ?';
            parameters.push(new Date(`${start}T00:00:00`));
            parameters.push(new Date(`${end}T23:59:59`));
        } else {
            whereClause = '1=1';
        }

        if (search) {
            whereClause += whereClause ? " AND " : " WHERE ";
            whereClause +=
                `(LOWER(l.loan_number) LIKE LOWER(?) 
              OR LOWER(u.citizen_id) LIKE LOWER(?) 
              OR REPLACE(LOWER(CONCAT(u.firstname, u.lastname)), ' ', '') LIKE LOWER(?)
              )`;
            parameters.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
        }

        const countQuery = `
          SELECT COUNT(*) AS total
          FROM loan_tax t
            LEFT JOIN system_users u ON u.id = t.user_id
            LEFT JOIN loan_installment i ON i.id = t.installment_id
            LEFT JOIN loan l ON l.id = t.loan_id
          WHERE ${whereClause}
      `;


        const query = `
        SELECT 
            t.id,
            i.given_at,
            i.created_at,
            t.installment_id,
            l.loan_number, 
            u.username, u.firstname, u.lastname, u.citizen_id,
            t.interest_rate,
            t.tax_business,
            t.tax_local,
            t.total_tax,
            i.delay_days AS days, 
            i.paid, 
            i.principle_paid AS principle, 
            i.interest_paid AS interest,
            i.delay_charge,
            i.delay_charge AS delay_charge2,
            i.delay_charge_paid AS delay_charge_paid,
            i.delay_charge_paid AS delay_charge_paid2,
            i.overdue_balance,
            i.application_charge,
            i.receipt_number
        FROM 
            loan_tax t
        LEFT JOIN loan l ON l.id = t.loan_id
        LEFT JOIN loan_installment i ON i.id = t.installment_id
        LEFT JOIN system_users u ON u.id = t.user_id
        WHERE ${whereClause}
        ORDER BY 
            t.created_at DESC
        LIMIT 
            ? OFFSET ?
        `;


        parameters.push(perPage, offset);
        const totalResult = await AppDataSource.query(countQuery, parameters);
        const _total = parseInt(totalResult[0].total);

        const result = await AppDataSource.query(query, parameters);
        if (result.length === 0) return res.error("ไม่พบรายการสินเชื่อ");

        const transactionTotal = {
            paid: Number(result.reduce((sum, item) => sum + Number(item.paid), 0)),
            principle: Number(result.reduce((sum, item) => sum + Number(item.principle), 0)),
            interest: Number(result.reduce((sum, item) => sum + Number(item.interest), 0)),
            delay_charge: Number(result.reduce((sum, item) => sum + Number(item.delay_charge), 0)),
            delay_charge2: Number(result.reduce((sum, item) => sum + Number(item.delay_charge2), 0)),
            delay_charge_paid: Number(result.reduce((sum, item) => sum + Number(item.delay_charge_paid), 0)),
            delay_charge_paid2: Number(result.reduce((sum, item) => sum + Number(item.delay_charge_paid2), 0)),
            application_charge: Number(result.reduce((sum, item) => sum + Number(item.application_charge), 0)),
        };

        const taxTotalObject = {
            "ภาษีธุรกิจเฉพาะ 3.00 %": Number(result.reduce((sum, item) => sum + Number(item.tax_business), 0)),
            "ภาษีท้องถิ่น 10.00 %": Number(result.reduce((sum, item) => sum + Number(item.tax_local), 0)),
            "รวมภาษีธุรกิจเฉพาะ+ภาษีท้องถิ่น": Number(result.reduce((sum, item) => sum + Number(item.total_tax), 0)),
        };

        const taxTotal = Object.entries(taxTotalObject).map(([key, value]) => `${key}: ${value.toFixed(2)}`);

        const data = [
            ...result,
        ];

        const total = {
            transactionTotal,
            taxTotal
        };

        return res.success("Tax Report", { data, total }, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}
