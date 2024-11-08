import {
    MoreThanOrEqual,
    LessThanOrEqual,
    Between,
    Not,
    LessThan,
    IsNull,
    In,
    Like,
    Raw
} from "typeorm";
import { LoanPlan } from "../entities/loan_plan";
import { AppDataSource, orm } from "../../../data-source";
import { Loan } from "../entities/loan";
import { loan_status } from "../../Utils/enum";
import { Users } from "../../Users/entities";
import {
    Line_SendNotificateDue,
    Line_Reject,
    Line_SendSlip,
    Line_Approve,
} from "../../Line_Message/module";
import {
    generateReference,
    toTHB,
    validateMimetype,
    toDate,
} from "../../../Utils/index";
import { paymentCalculator } from "./calurate";
import { LineCreateQR } from "../../PaymentGateway/controller"
import { QRPayment } from "../../PaymentGateway/entities/qrpayment";


// ก่อนถึงกำหนดชำระ
export const get_beforeDue = async (req, res) => {
    const { searchDay, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let whereClause: any = {
        status: 'Running',
        installment_due: MoreThanOrEqual(today)
    };

    if (searchDay) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + parseInt(searchDay));
        targetDate.setHours(0, 0, 0, 0);

        const endOfTargetDate = new Date(targetDate);
        endOfTargetDate.setHours(23, 59, 59, 999);

        whereClause = {
            ...whereClause,
            installment_due: Between(targetDate, endOfTargetDate)
        };
    }


    try {
        const _total = await orm(Loan).count({ where: whereClause });
        const loansDue = await orm(Loan).find({
            where: whereClause,
            take: perPage,
            skip: offset
        });

        const loans = await Promise.all(loansDue.map(async (loan) => {
            const { application_form, ...other } = loan;
            const user = await orm(Users).findOne({ where: { id: loan.user_id } });
            return {
                ...other,
                user_name: `${user.firstname} ${user.lastname}`
            };
        }));

        return res.success('รายการที่พบ', loans, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


// เกินกำหนดชำระ
export const get_overDue = async (req, res) => {
    const { searchMonth, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let whereClause: any = {
        status: 'Running',
        installment_due: LessThan(today)
    };

    try {
        const _total = await orm(Loan).count({ where: whereClause });
        const loansDue = await orm(Loan).find({
            where: whereClause,
            take: perPage,
            skip: offset
        });

        let loans = await Promise.all(loansDue.map(async (loan) => {
            const { application_form, ...other } = loan;

            const installmentDue = new Date(loan.installment_due);
            const today = new Date();  

            // คำนวณจำนวนเดือนที่เลยกำหนดชำระ
            const overdueMonths = (today.getFullYear() - installmentDue.getFullYear()) * 12 + (today.getMonth() - installmentDue.getMonth());

            // ตรวจสอบหากจำนวนเดือนติดลบ แสดงว่ายังไม่ถึงกำหนดชำระ หรือเป็นเดือนเดียวกัน
            const overdueDuration = overdueMonths > 0 ? overdueMonths : 0;

            if (searchMonth && overdueDuration < Number(searchMonth)) {
                return null;
            }

            const user = await orm(Users).findOne({ where: { id: loan.user_id } });
            return {
                ...other,
                user_name: `${user.firstname} ${user.lastname}`,
                overdue_months: overdueDuration
            };
        }));

        loans = loans.filter(loan => loan !== null);

        return res.success('รายการที่พบ', loans, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const notificate_Due = async (req, res) => {
    const { loanIds } = req.body;
    if (!loanIds || !Array.isArray(loanIds) || loanIds.length === 0) {
        return res.error("กรุณาเลือกเงินกู้ที่ต้องการส่งแจ้งเตือน");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const loansDue = await orm(Loan).find({
            where: {
                id: In(loanIds),
                status: 'Running',
            }
        });

        if (loansDue.length === 0) {
            return res.error('ไม่พบรายการที่ต้องแจ้งเตือน');
        }

        const filteredLoans = loansDue.filter(loan => {
            if (loan.last_alert_date) {
                const lastNotified = new Date(loan.last_alert_date);
                lastNotified.setHours(0, 0, 0, 0);
                return lastNotified.getTime() !== today.getTime();
            }
            return true;
        });

        if (filteredLoans.length === 0) {
            return res.error('ได้ทำการแจ้งเตือนแล้วในวันนี้');
        }

        const userIds = loansDue.map(loan => loan.user_id);
        const planIds = loansDue.map(loan => loan.plan_id);

        const users = await orm(Users).find({
            where: { id: In(userIds) }
        });
        const plans = await orm(LoanPlan).find({ where: { id: In(planIds) } });

        const notificationResults = await Promise.all(loansDue.map(async (loan) => {
            const user = users.find(u => u.id === loan.user_id);
            const plan = plans.find(p => p.id === loan.plan_id);

            const formattedPerInstallment = `${parseFloat(loan.per_installment).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;
            const formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(new Date(loan.installment_due));
            const formattedLoanAmount = `${parseFloat(loan.amount).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;
            const formattedLoanRemaining = `${parseFloat(loan.remaining).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;


            if (!user.line_id) {
                return null;
            }

            await Line_SendNotificateDue(
                user.line_id,
                plan.name,
                loan.loan_number,
                formattedPerInstallment,
                formattedInstallmentDate,
                loan.given_installment + 1,
                loan.total_installment,
                formattedLoanAmount,
                formattedLoanRemaining
            );

            loan.last_alert_date = new Date();
            await orm(Loan).save(loan);

            return {
                loan_id: loan.id,
                line_id: user.line_id,
                plan_name: plan.name,
                loan_number: loan.loan_number,
                per_installment: formattedPerInstallment,
                installment_date: formattedInstallmentDate,
                given_installment: loan.given_installment + 1,
                total_installment: loan.total_installment,
                loan_amount: formattedLoanAmount,
                loan_remaining: formattedLoanRemaining
            };
        }));

        const validResults = notificationResults.filter(result => result !== null);

        return res.success('ส่งแจ้งเตือนสำเร็จ', validResults);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};



// export const notificate_afterDue = async (req, res) => {
//     const { loanIds } = req.body;
//     if (!loanIds || !Array.isArray(loanIds) || loanIds.length === 0) {
//         return res.error("กรุณาเลือกเงินกู้ที่ต้องการส่งแจ้งเตือน");
//     }

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     try {
//         const loansDue = await orm(Loan).find({
//             where: {
//                 id: In(loanIds),
//                 status: 'Running',
//             }
//         });

//         if (loansDue.length === 0) {
//             return res.error('ไม่พบรายการที่ต้องแจ้งเตือน');
//         }

//         const filteredLoans = loansDue.filter(loan => {
//             if (loan.last_alert_date) {
//                 const lastNotified = new Date(loan.last_alert_date);
//                 lastNotified.setHours(0, 0, 0, 0);
//                 return lastNotified.getTime() !== today.getTime();
//             }
//             return true;
//         });

//         if (filteredLoans.length === 0) {
//             return res.error('ได้ทำการแจ้งเตือนแล้วในวันนี้');
//         }

//         const userIds = loansDue.map(loan => loan.user_id);
//         const planIds = loansDue.map(loan => loan.plan_id);

//         const users = await orm(Users).find({
//             where: { id: In(userIds) }
//         });
//         const plans = await orm(LoanPlan).find({ where: { id: In(planIds) } });

//         const notificationResults = await Promise.all(loansDue.map(async (loan) => {
//             const user = users.find(u => u.id === loan.user_id);
//             const plan = plans.find(p => p.id === loan.plan_id);

//             const formattedPerInstallment = `${parseFloat(loan.per_installment).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;
//             const formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
//                 day: 'numeric',
//                 month: 'long',
//                 year: 'numeric'
//             }).format(new Date(loan.installment_due));

//             if (!user.line_id) {
//                 return null;
//             }

//             await Line_SendNotificate(
//                 user.line_id,
//                 plan.name,
//                 loan.loan_number,
//                 formattedPerInstallment,
//                 formattedInstallmentDate,
//                 loan.given_installment + 1,
//                 loan.total_installment,
//             );

//             loan.last_alert_date = new Date();
//             await orm(Loan).save(loan);

//             return {
//                 loan_id: loan.id,
//                 line_id: user.line_id,
//                 plan_name: plan.name,
//                 loan_number: loan.loan_number,
//                 per_installment: formattedPerInstallment,
//                 installment_date: formattedInstallmentDate,
//                 given_installment: loan.given_installment + 1,
//                 total_installment: loan.total_installment
//             };
//         }));

//         const validResults = notificationResults.filter(result => result !== null);

//         return res.success('ส่งแจ้งเตือนสำเร็จ', validResults);
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// };