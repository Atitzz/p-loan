import { AppDataSource, orm } from "../../../data-source";
import { CronJob } from '../entities/cronjob';
import { CronJobLog } from '../entities/cronjob_log';
import { CronSchedule } from '../entities/cronschedule';
import { Installment } from "../../Loan/entities/loan_installment";
import { Loan } from "../../Loan/entities/loan";
import { Transaction } from "../../Transaction/entities/transaction";
import { cron_status, loan_status } from "../../Utils/enum"
import { Users } from "../../Users/entities";
import { sendNotificationEmail } from "../../Notification/controller"
import axios from 'axios';
import * as cron from 'node-cron';
import { LoanPlan } from "../../Loan/entities/loan_plan";
import { Line_SendNotificate } from "../../Line_Message/module"
import * as dotenv from 'dotenv';
dotenv.config();

const CRONJOB_RUNNING = process.env.CRONJOB_RUNING;
const CRONJOB_TIMES = process.env.CRONJOB_TIMES;

const cron_interval = (defaultInterval) => {
    switch (CRONJOB_TIMES) {
        case 'M':
            return 60;
        case 'H':
            return 3600;
        case 'D':
            return 86400;
        default:
            return defaultInterval;
    }
};

const shouldRunCronJob = () => {
    return CRONJOB_RUNNING === 'ON';
};

// ---------------------------- Cron Schedule ---------------------------- //
export const createCronSchedule = async (req, res) => {
    const { ...obj } = req.body;
    try {
        const cronSchedule = new CronSchedule();
        cronSchedule.name = obj.name;
        cronSchedule.interval = obj.interval;
        await orm(CronSchedule).save(cronSchedule);
        await cronSchedule.createLog(req, 'create', 'cronjob_schedule', obj)
        return res.success('Created CronSchedule Success', cronSchedule);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const getCronSchedule = async (req, res) => {
    try {
        const cronSchedule = await orm(CronSchedule).find({})
        if (!cronSchedule) return res.error('Cron schedule not found')
        return res.success('Get cron schedule', cronSchedule)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const getCronSchedule_id = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const cronSchedule = await orm(CronSchedule).findOne({ where: { id: _id } })
        if (!cronSchedule) return res.error('Cron schedule not found')
        return res.success('Get cron schedule', cronSchedule)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const updateCronSchedule = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    const { ...obj } = req.body;
    try {
        const cronSchedule = await orm(CronSchedule).findOne({ where: { id: _id } })
        if (!cronSchedule) return res.error('Invalid schedule')

        cronSchedule.name = obj.name;
        cronSchedule.interval = obj.interval;
        await orm(CronSchedule).save(cronSchedule)
        await cronSchedule.createLog(req, 'update', 'cron_schedules', obj)

        return res.success('Schedule updated successfully', cronSchedule)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const deleteCronSchedule = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const cronSchedule = await orm(CronSchedule).findOne({ where: { id: _id } })
        if (!cronSchedule) return res.error('Invalid schedule')

        await orm(CronSchedule).delete(_id)
        await cronSchedule.createLog(req, 'remove', 'cron_schedules', cronSchedule)

        return res.success('Schedule deleted successfully', cronSchedule)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}


// เก็บ cron jobs ไว้ในตัวแปรสำหรับจัดการการหยุดและเริ่มใหม่
const scheduledCronJobs = new Map<string, any>();

// ---------------------------- Cron Job ---------------------------- //
export const createCronJob = async (req, res) => {
    const { ...obj } = req.body;
    try {
        const cronJob = new CronJob();
        cronJob.name = obj.name;
        cronJob.alias = obj.name.toLowerCase().replace(/ /g, '_');;
        cronJob.cron_schedule_id = obj.cron_schedule_id;
        cronJob.url = obj.url;

        const schedule = await orm(CronSchedule).findOne({ where: { id: obj.cron_schedule_id } });
        const interval = cron_interval(schedule.interval);
        const nextRun = new Date(Date.now() + interval * 1000);
        cronJob.next_run = nextRun;

        await orm(CronJob).save(cronJob);
        await cronJob.createLog(req, 'create', 'cronjob', obj)
        return res.success('Created Cronjob', cronJob);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};

export const getCronjob = async (req, res) => {
    try {
        const cronjob = await orm(CronJob).find({})
        if (!cronjob) return res.error('cronjob not found')

        return res.success('Get Cron', cronjob)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const getCronjob_id = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const cronjob = await orm(CronJob).findOne({ where: { id: _id } })
        if (!cronjob) return res.error('CronJob not found')

        return res.success('Get Cron', cronjob)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const updateCronJob = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    const { ...obj } = req.body;
    try {
        const cronjob = await orm(CronJob).findOne({ where: { id: _id } })
        if (!cronjob) return res.error('Invalid cronjob')

        cronjob.name = obj.name;
        cronjob.alias = obj.name.toLowerCase().replace(/ /g, '_');;
        cronjob.next_run = obj.next_run;
        cronjob.cron_schedule_id = obj.cron_schedule_id;
        await orm(CronJob).save(cronjob)
        await cronjob.createLog(req, 'update', 'cronjob', obj)

        return res.success('Updated Crobjob Success', cronjob)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const runCronJobNow = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const cronJob = await orm(CronJob).findOne({ where: { id: _id } });
        if (!cronJob) return res.error('Cron job not found');

        if (scheduledCronJobs.has(cronJob.id.toString())) {
            scheduledCronJobs.get(cronJob.id.toString()).stop();
            scheduledCronJobs.delete(cronJob.id.toString());
        }

        cronJob.is_running = cron_status.Running;

        const schedule = await orm(CronSchedule).findOne({ where: { id: cronJob.cron_schedule_id } });
        const interval = cron_interval(schedule.interval);
        const minutes = interval / 60;
        const cronExpression = `*/${minutes} * * * *`;
        const job = cron.schedule(cronExpression, () => {
            runCronJob(cronJob);
        });

        scheduledCronJobs.set(cronJob.id.toString(), job);

        // รันทันทีหลัง start server (ถ้าไม่รันทันที กรณีที่ set cronjob ให้รันทุกวัน ครั้งแรกที่รันจะเป็นวันถัดไป)
        // ถ้าใช้งานจริง เอาออกได้ เพราะนัดงวดแรกจะเริ่มเป็นเดือนถัดไป ไม่จำเป็นต้องเช็คทันทีหลัง start server
        // await runCronJob(cronJob);

        return res.success('Cron job run successfully', cronJob);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};

export const stopCronJob = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1

    try {
        const cronJob = await orm(CronJob).findOne({ where: { id: _id } });
        if (!cronJob) return res.error('Cron job not found');


        cronJob.is_running = cron_status.Pause;
        await orm(CronJob).save(cronJob);

        // หยุด cron job ที่กำลังรันอยู่
        if (scheduledCronJobs.has(cronJob.id.toString())) {
            scheduledCronJobs.get(cronJob.id.toString()).stop();
            scheduledCronJobs.delete(cronJob.id.toString());
        }

        console.log(`Stop scheduled jobs: ${cronJob.name}`)

        return res.success('Cron job stopped successfully', cronJob);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};

export const getCronJobLogs = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1

    try {
        const logs = await orm(CronJobLog).find({ where: { cron_job_id: _id } });
        return res.success('Get Cronjob log', logs);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


// ---------------------------- เรียกใช้ cron ทั้งหมดที่ Run อยู่ ---------------------------- //
export const startCronJobs = async () => {
    const cronJobs = await orm(CronJob).find({ where: { is_running: cron_status.Running } });

    for (const cronJob of cronJobs) {
        const schedule = await orm(CronSchedule).findOne({ where: { id: cronJob.cron_schedule_id } });
        const interval = cron_interval(schedule.interval);

        // รันครั้งถัดไป ตามระยะเวลาที่กำหนด
        const minutes = interval / 60;
        const cronExpression = `*/${minutes} * * * *`;

        const job = cron.schedule(cronExpression, () => {
            runCronJob(cronJob);
        });

        scheduledCronJobs.set(cronJob.id.toString(), job);

        console.log(`Cron job: ${cronJob.name}`);

        // รันทันทีหลัง start server (ถ้าไม่รันทันที กรณีที่ set cronjob ให้รันทุกวัน ครั้งแรกที่รันจะเป็นวันถัดไป)
        // ถ้าใช้งานจริง เอาออกได้ เพราะนัดงวดแรกจะเริ่มเป็นเดือนถัดไป ไม่จำเป็นต้องเช็คทันทีหลัง start server
        await runCronJob(cronJob);
    }
};


// ---------------------------- function ---------------------------- //


const runCronJob = async (cronJob) => {
    try {
        // ตรวจสอบสถานะของ CRONJOB_RUNNING
        if (!shouldRunCronJob()) {
            console.log(`Cron job ${cronJob.name} ถูกปิดอยู่`);
            return;
        }

        const startAt = new Date();
        console.log(`Running cron job: ${cronJob.name} at ${startAt}`);

        // Logic ของการทำงาน cronjob ตามปกติ
        // if (cronJob.url) {
        //     await axios.post(cronJob.url);
        // } else if (cronJob.action) {
        //     const action = JSON.parse(cronJob.action);
        //     if (action && action.length === 2) {
        //         const [controllerPath, methodName] = action;
        //         const controller = require(controllerPath);
        //         if (controller && controller[methodName]) {
        //             await controller[methodName]();
        //         }
        //     }
        // } else {
        //     await updateLoanStatusIfDue();
        // }
        await updateLoanStatusIfDue();

        const endAt = new Date();
        cronJob.last_run = endAt;

        const schedule = await orm(CronSchedule).findOne({ where: { id: cronJob.cron_schedule_id } });
        const interval = schedule.interval
        cronJob.next_run = new Date(endAt.getTime() + interval * 1000);
        await orm(CronJob).save(cronJob);

        const log = new CronJobLog();
        log.cron_job_id = cronJob.id;
        log.start_at = startAt;
        log.end_at = endAt;
        log.duration = Math.round((endAt.getTime() - startAt.getTime()) / 1000);
        await orm(CronJobLog).save(log);

        console.log(`Finished running cron job: ${cronJob.name} at ${endAt}`);
    } catch (error) {
        console.error('Error running cron job:', error);
    }
};

export const updateLoanStatusIfDue = async () => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const query = `
            SELECT 
            l.id, l.loan_number, l.user_id, l.installment_due, 
            l.last_alert_date, l.total_installment, l.given_installment + 1 AS given_installment,
            l.delay_value
            FROM loan l
            WHERE l.installment_due <= ? 
            AND LOWER(l.status) NOT IN ('paid', 'bad', 'pending')
        `;

        const dueLoans = await AppDataSource.query(query, [today]);
        // console.log('dueloans', dueLoans)

        for (const loan of dueLoans) {
            const user = await orm(Users).findOne({ where: { id: loan.user_id } });
            const loanEntity = await orm(Loan).findOne({ where: { id: loan.id } });
            const plan = await orm(LoanPlan).findOne({ where: { id: loanEntity.plan_id } });

            if (loanEntity) {
                // คำนวณวันที่ถัดไปที่ควรแจ้งเตือน
                const nextAlertDate = loan.last_alert_date
                    ? new Date(new Date(loan.last_alert_date).setDate(new Date(loan.last_alert_date).getDate() + loan.delay_value))
                    : today;

                if (nextAlertDate <= today) {
                    await orm(Loan).save({ ...loanEntity, last_alert_date: today });


                    const formattedPerInstallment = `${parseFloat(loanEntity.per_installment).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;
                    const formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }).format(new Date(loan.installment_due));

                    if (user.line_id) {
                        await Line_SendNotificate(user.line_id, plan.name, loanEntity.loan_number, formattedPerInstallment, formattedInstallmentDate, loan.given_installment, loanEntity.total_installment);
                    }

                    // console.log(`${user.display_name}`);
                    // console.log(`${user.line_id}`);
                    // console.log(`${plan.name}`);
                    // console.log(`${loanEntity.loan_number}`);
                    // console.log(`${formattedPerInstallment}`);
                    // console.log(`${formattedInstallmentDate}`);
                    // console.log(`${loan.given_installment}`);
                    // console.log(`${loanEntity.total_installment}`);
                }
            }
        }
    } catch (err) {
        console.error('Error updating loan status:', err);
    }
};

// export const updateLoanStatusIfDue = async () => {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const query = `
//             SELECT
//             l.id, l.loan_number, l.user_id, l.installment_due,
//             l.installment_date
//             FROM loan l
//             LEFT JOIN loan_installment i ON l.id = i.loan_id
//             WHERE l.installment_due = ? AND LOWER(l.status) NOT IN ('Paid', 'Bad')
//         `;

//         const dueLoans = await AppDataSource.query(query, [today]);

//         const updatedLoans = new Set();  // ใช้ Set เพื่อเก็บ loan ที่ถูกส่งแล้ว

//         for (const loan of dueLoans) {
//             if (updatedLoans.has(loan.loan_number)) {
//                 continue;  // ถ้า loan นี้ส่งแล้วให้ข้ามไป
//             }
//             const user = await orm(Users).findOne({ where: { id: loan.user_id } })
//             const loanEntity = await orm(Loan).findOne({ where: { id: loan.id } });
//             const plan = await orm(LoanPlan).findOne({ where: { id: loanEntity.plan_id } })
//             if (loanEntity) {
//                 // loanEntity.status = loan_status.Due;
//                 await orm(Loan).save(loanEntity);
//                 console.log(`Loan Number ${loanEntity.loan_number} status updated to Due`);

//                 updatedLoans.add(loan.loan_number);  // เพิ่ม loan ลงใน Set

//                 // ใส่ ,
//                 const formattNumber = parseFloat(loanEntity.per_installment)
//                 const formattedPerInstallment = `${formattNumber.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;

//                 // วันที่เป็นภาษาไทย
//                 const formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                 }).format(new Date(loan.installment_due));

//                 // ส่งข้อความแจ้งเตือนไปยังไลน์
//                 if (user.line_id) {
//                     // ส่งข้อความแจ้งเตือนไปยังไลน์
//                     await Line_SendNotificate(user.line_id, plan.name, loanEntity.loan_number, formattedPerInstallment, formattedInstallmentDate);
//                 }
//                 console.log(user.display_name)
//                 console.log(user.line_id)
//                 console.log(plan.name)
//                 console.log(loanEntity.loan_number)
//                 console.log(formattedPerInstallment)
//                 console.log(formattedInstallmentDate)
//             }
//         }
//     } catch (err) {
//         console.error('Error updating loan status:', err);
//     }
// };


// const autopayAllUsers = async () => {
//     try {
//         const today = new Date();

//         const query = `
//             SELECT i.*,
//                 l.user_id, l.per_installment, l.delay_value, l.delay_charge, l.loan_number
//                 FROM loan_installment i
//                 JOIN loan l ON i.loan_id = l.id
//                 WHERE i.installment_date <= ? AND i.isPaid = false
//             `;

//         const installments = await AppDataSource.query(query, [today]);

//         const userInstallmentsMap = new Map();

//         installments.forEach(installment => {
//             const userId = installment.user_id;
//             if (!userInstallmentsMap.has(userId)) {
//                 userInstallmentsMap.set(userId, []);
//             }
//             userInstallmentsMap.get(userId).push(installment);
//         });

//         userInstallmentsMap.forEach(async (userInstallments, userId) => {
//             const userBalance = await orm(User_Balance).findOne({ where: { user_id: userId } });

//             if (!userBalance) {
//                 console.log(`User ${userId} has no balance`);
//                 return;
//             }

//             for (const installment of userInstallments) {
//                 const loan = await orm(Loan).findOne({ where: { loan_number: installment.loan_number } });
//                 if (!loan) {
//                     console.log(`Loan not found for loan_number ${installment.loan_number}`);
//                     continue;
//                 }
//                 const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id}})

//                 const installmentDate = new Date(installment.installment_date);
//                 const delayDays = Math.max(0, Math.ceil((today.getTime() - installmentDate.getTime()) / (1000 * 60 * 60 * 24)));

//                 const delayValue = parseInt(installment.delay_value);
//                 let delayCharge = 0;

//                 if (delayDays > delayValue) {
//                     const chargeableDelayDays = delayDays - delayValue;
//                     delayCharge = chargeableDelayDays * parseFloat(installment.delay_charge);
//                 }

//                 const totalDeductedAmount = parseFloat(installment.per_installment) + delayCharge;

//                 if (userBalance.balance < totalDeductedAmount) {
//                     console.log(`User ${userId} has insufficient funds for installment payment`);
//                     continue;
//                 }

//                 // ตัดยอดจาก balance ของผู้ใช้
//                 userBalance.balance -= totalDeductedAmount;

//                 await orm(User_Balance).save(userBalance);


//                 // บันทึก transaction
//                 const transaction = new Transaction();
//                 transaction.user_id = userId;
//                 transaction.amount = totalDeductedAmount;
//                 // transaction.trx_type = 'minus';
//                 // transaction.trx = `${installment.loan_number}`;
//                 // transaction.details = 'Loan installment paid';
//                 // transaction.remark = 'loan_installment';
//                 // transaction.post_balance = userBalance.balance;

//                 await orm(Transaction).save(transaction);


//                 // อัพ installment
//                 installment.isPaid = true;
//                 installment.given_at = today;
//                 installment.delay_days = delayDays;
//                 installment.delay_charge = delayCharge;
//                 installment.paid = installment.per_installment;
//                 await orm(Installment).save(installment);

//                 // อัพเดท loan
//                 loan.given_installment = loan.given_installment + 1;
//                 loan.total_paid = parseFloat(loan.total_paid) + parseFloat(installment.per_installment);
//                 loan.remaining = parseFloat(loan.remaining) - parseFloat(installment.per_installment);
//                 await orm(Loan).save(loan);

//                 const user = await orm(Users).findOne({ where: { id: userId } });
//                 if (user) {
//                     const emailContent = emailContent_pay(user, installment, plan, transaction, userBalance);
//                     await sendNotificationEmail(user.email, 'Paid Installment Successfully', emailContent, userId);
//                 }
//             }
//         });
//     } catch (err) {
//         console.error('Error processing installments:', err);
//     }
// };
