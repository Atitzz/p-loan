import { NotificationEmail } from "../entities";
import { AppDataSource, orm } from "../../../data-source";
import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
import { Users } from "../../Users/entities";
dotenv.config();

export const sendNotificationEmail = async (
  to: string,
  subject: string,
  htmlContent: string,
  userId: number
) => {
  const transporter = nodemailer.createTransport({
    // host: process.env.MAIL_DOMAIN, // เซิร์ฟเวอร์ SMTP
    // port: Number(process.env.MAIL_PORT), // พอร์ตที่ใช้สำหรับ SMTP กับ SSL
    // secure: true, // ใช้ SSL
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    debug: true, // เปิดโหมดดีบัก
    logger: true, // แสดงล็อกเพิ่มเติม
  });

  try {
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
    };

    const sentEmail = await transporter.sendMail(mailOptions);

    // บันทึกการแจ้งเตือน
    // await orm(NotificationEmail).save({
    //     user_id: userId,
    //     sent_from: process.env.GMAIL_USER,
    //     sent_to: to,
    //     subject: subject,
    //     message: htmlContent,
    //     notification_type: 'email',
    // });

    return sentEmail;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const notification_history = async (req, res) => {
  const { search, page, limit, startDate, endDate } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;

  let whereClause = "";
  const parameters = [];

  if (search) {
    whereClause += whereClause ? " AND " : " WHERE ";
    whereClause +=
      "(LOWER(u.firstname) LIKE LOWER(?) OR LOWER(u.username) LIKE LOWER(?)) ";
    parameters.push(`%${search}%`, `%${search}%`);
  }

  if (startDate) {
    whereClause += whereClause ? " AND " : " WHERE ";
    whereClause += "ne.created_at >= ? ";
    parameters.push(new Date(`${startDate}T00:00:00`));
  }

  if (endDate) {
    whereClause += whereClause ? " AND " : " WHERE ";
    whereClause += "ne.created_at <= ? ";
    parameters.push(new Date(`${endDate}T23:59:59`));
  }

  parameters.push(perPage, offset);

  const countQuery = `
        SELECT COUNT(*) as total
        FROM notification_email ne
        LEFT JOIN system_users u ON ne.user_id = u.id
        ${whereClause}`;

  const query = `
        SELECT
            u.firstname, u.lastname, u.username, u.email,
            ne.id, ne.created_at as sent, ne.notification_type as sender, ne.subject, ne.message
        FROM notification_email ne
        LEFT JOIN system_users u ON ne.user_id = u.id
        ${whereClause}
        ORDER BY ne.created_at DESC
        LIMIT ? OFFSET ?
        `;

  try {
    const totalResult = await AppDataSource.query(countQuery, parameters);
    const _total = parseInt(totalResult[0].total);

    const notification = await AppDataSource.query(query, parameters);

    if (notification.length === 0) {
      return res.error("No notification found");
    }

    return res.success("Get All notification Success", notification, _total);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// ----------------------------------- Templates -------------------------------- //
// applykyc
export const kyc_notificate = (user) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                }
                .content {
                    margin: 20px 0;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .content .highlight {
                    color: #007bff;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #888;
                }
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div style="text-align: center;">
                    <img src="${process.env.USER_DOMAIN}/public/banner_logo.png" alt="Company Logo">
                </div>
                <div class="content">
                    <h2>เรียนคุณ ${user.firstname} ${user.lastname}</h2>
                    <p>การยืนยันตัวตนของคุณเสร็จสมบูรณ์แล้ว</p>
                    <p>บัญชีของคุณพร้อมใช้งาน หากคุณมีข้อสงสัยเพิ่มเติม สามารถติดต่อฝ่ายบริการลูกค้าของเราได้</p>
                    <h1 style="text-align: center;">ขอบคุณที่ใช้บริการ</h1>
                </div>
                <div class="footer">
                    <p>© 2024 <a href="https://www.moneyforyou.co.th">moneyforyou Company</a>. All Rights Reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// approve & reject kyc
export const ApproveRejectKYC_notificate = (
  user,
  subject,
  date,
  reject_reason = null
) => {
  const isApproved = subject === "การยืนยันตัวตนของคุณได้รับการอนุมัติ";
  const rejectReasonContent = reject_reason
    ? `<div><p>*สาเหตุ: <span class="highlight" style="color: red;"><u>${reject_reason}</u></span></p></div>`
    : "";
  const Date = `<p>วันที่: ${date} <span class="highlight"></span></p>`;

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                }
                .content {
                    margin: 20px 0;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .content .highlight {
                    color: #007bff;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #888;
                }
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div style="text-align: center;">
                    <img src="${
                      process.env.USER_DOMAIN
                    }/public/banner_logo.png" alt="Company Logo">
                </div>
                <div class="content">
                    <h2>เรียนคุณ ${user.firstname} ${user.lastname}</h2>
                    <p>การยืนยันตัวตนของคุณ <span class="highlight">${
                      isApproved ? "ได้รับการอนุมัติ" : "ถูกปฏิเสธ"
                    }</span>.</p>
                    ${Date}
                    ${rejectReasonContent}
                    <h1 style="text-align: center;">ขอบคุณที่ใช้บริการ</h1>
                </div>
                <div class="footer">
                    <p>© 2024 <a href="https://www.moneyforyou.co.th">moneyforyou Company</a>. All Rights Reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// takeloan
export const takeloan_notificate = (
  user,
  loanDetails,
  loanPlan,
  interestRate
) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                }
                .content {
                    margin: 20px 0;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .content .highlight {
                    color: #007bff;
                    font-weight: bold;
                }
                .details {
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .details p {
                    margin: 0;
                    font-size: 14px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #888;
                }
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div style="text-align: center;">
                    <img src="${
                      process.env.USER_DOMAIN
                    }/public/banner_logo.png" alt="Company Logo">
                </div>
                <div class="content">
                    <h2>เรียนคุณ ${user.firstname} ${user.lastname}</h2>
                    <p>คุณได้ทำการสมัครแผนสินเชื่อ <span class="highlight">${
                      loanPlan.name
                    }</span> เรียบร้อยแล้ว</p>
                    <h3>รายละเอียดการสมัครสินเชื่อ</h3>
                    <div class="details">
                        <p>ยอดที่ต้องการกู้: <span class="highlight">${Number(
                          loanDetails.amount
                        ).toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} บาท</span></p>
                        <p>อัตราดอกเบี้ย: <span class="highlight">${Number(
                          interestRate
                        ).toFixed(2)}%</span></p>
                        <p>จำนวนงวด: <span class="highlight">${
                          loanDetails.installment
                        }</span></p>
                    </div>
                    <p>การสมัครของคุณอยู่ในขั้นตอนการพิจารณา โปรดรอการแจ้งเตือนเพิ่มเติม.</p>
                    <h1 style="text-align: center;">ขอบคุณที่ใช้บริการ</h1>
                </div>
                <div class="footer">
                    <p>© 2024 <a href="https://www.moneyforyou.co.th">moneyforyou Company</a>. All Rights Reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// approve & reject loan
export const ApproveRejectLoan_notificate = (
  user,
  loan,
  loanPlan,
  interestRate = null,
  subject,
  firstpay = null,
  reject_reason = null
) => {
  const isApproved = subject == "การขอสินเชื่อได้รับการอนุมัติแล้ว";
  const firstPay = firstpay
    ? `<p>ชำระงวดแรกไม่เกินวันที่: <span class="highlight">${firstpay}</span></p>`
    : "";
  const reject_reasonContent = reject_reason
    ? `<div><p>*สาเหตุ: <span class="highlight" style="color: red;"><u>${reject_reason}</u></span></p></div>`
    : "";

  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                }
                .content {
                    margin: 20px 0;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .content .highlight {
                    color: #007bff;
                    font-weight: bold;
                }
                .details {
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .details p {
                    margin: 0;
                    font-size: 14px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #888;
                }
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div style="text-align: center;">
                    <img src="${
                      process.env.USER_DOMAIN
                    }/public/banner_logo.png" alt="Company Logo">
                </div>
                <div class="content">
                    <h2>เรียนคุณ ${user.firstname} ${user.lastname}</h2>
                    <p>สินเชื่อที่คุณร้องขอ <span class="highlight">${
                      loanPlan.name
                    }</span> ${
    isApproved ? "ได้รับการอนุมัติ" : "ถูกปฏิเสธ"
  }</p>
                    ${reject_reasonContent}
                        <h3>รายละเอียดสินเชื่อ</h3>
                        <div class="details">
                            <p>ยอดกู้: <span class="highlight">${Number(
                              loan.amount
                            ).toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} บาท</span></p>
                            <p>อัตราดอกเบี้ย: <span class="highlight">${Number(
                              interestRate
                            )}%</span></p>
                    ${
                      isApproved
                        ? `
                            <p>จำนวนงวดที่ต้องชำระ: <span class="highlight">${Number(
                              loan.total_installment
                            )}</span></p>
                            <p>ยอดชำระต่องวด: <span class="highlight">${Number(
                              loan.per_installment
                            ).toLocaleString("th-TH", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })} บาท</span></p>
                            ${firstPay}
                    `
                        : ""
                    }
                        </div>
                    <h1 style="text-align: center;">ขอบคุณที่ใช้บริการ</h1>
                </div>
                <div class="footer">
                    <p>© 2024 <a href="https://www.moneyforyou.co.th">moneyforyou Company</a>. All Rights Reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// payment
export const payment_notificate = (
  user,
  loan,
  planname,
  orders,
  sendTotal,
  formattedInstallmentDate,
  billNumber
) => {
  return `
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                }
                .content {
                    margin: 20px 0;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .content .highlight {
                    color: #007bff;
                    font-weight: bold;
                }
                .details {
                    background: #f9f9f9;
                    padding: 10px;
                    border-radius: 10px;
                    margin-top: 20px;
                }
                .details p {
                    margin: 0;
                    font-size: 14px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #888;
                }
                .footer a {
                    color: #007bff;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div style="text-align: center;">
                    <img src="${
                      process.env.USER_DOMAIN
                    }/public/banner_logo.png" alt="Company Logo">
                </div>
                <div class="content">
                    <h2>เรียนคุณ ${user.firstname} ${user.lastname}</h2>
                    <p>ใบเสร็จการชำระเงินของคุณ</p>
                    <div class="details">
                        <h3>รายละเอียดใบเสร็จ</h3>
                        <p>ใบเสร็จ: <span class="highlight">${billNumber}</span></p>
                        <p>เลขที่สัญญา: <span class="highlight">${
                          loan.loan_number
                        }</span></p>
                        <p>สินเชื่อ: <span class="highlight">${planname}</span></p>
                        <p>วันที่ชำระ: <span class="highlight">${formattedInstallmentDate}</span></p>
                        <p>งวดที่: <span class="highlight">${
                          loan.given_installment
                        }/${loan.total_installment}</span></p>
                        <h3 style="margin-top: 10px; color: black">รายการชำระ</h3>
                        ${orders
                          .map(
                            (order) => `
                            <p>${order.name}: <span class="highlight">${order.amount}</span></p>
                        `
                          )
                          .join("")}
                        <p>รวม: <span class="highlight">${sendTotal}</span></p>
                    </div>
                    <h1 style="text-align: center;">ขอบคุณที่ใช้บริการ</h1>
                </div>
                <div class="footer">
                    <p>© 2024 <a href="https://moneyforyou.co.th">moneyforyou Company</a>. All Rights Reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

// deposit
// export const emailContent_deposit = (user, deposit, gateway, userBalance, subject, feedback = null) => {
//     const isApproved = subject === 'Approved';
//     const feedbackContent = feedback ? `<div><h1>Admin Feedback: <span class="highlight" style="color: red;"><u>${feedback}</u></span></h1></div>` : '';

//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     width: 80%;
//                     margin: auto;
//                     background: #ffffff;
//                     padding: 20px;
//                     border-radius: 10px;
//                 }
//                 .header {
//                     background: #007bff;
//                     color: #ffffff;
//                     padding: 10px 0;
//                     text-align: center;
//                 }
//                 .content {
//                     margin: 20px 0;
//                 }
//                 .content p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                 }
//                 .content .highlight {
//                     color: #007bff;
//                     font-weight: bold;
//                 }
//                 .details {
//                     background: #f9f9f9;
//                     padding: 10px;
//                     border-radius: 10px;
//                     margin-top: 20px;
//                 }
//                 .details p {
//                     margin: 0;
//                     font-size: 14px;
//                 }
//                 .footer {
//                     text-align: center;
//                     margin-top: 20px;
//                     color: #888;
//                 }
//                 .footer a {
//                     color: #007bff;
//                     text-decoration: none;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <h1>This is a System Generated Email</h1>
//             </div>
//             <div class="container">
//                 <div style="text-align: center;">
//                     <img src="https://via.placeholder.com/150" alt="Logo" style="width: 150px; height: auto;">
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${user.firstname}</h2>
//                     <p>Your deposit request of <span class="highlight">${Number(deposit.amount).toFixed(2)} ${deposit.method_currency}</span> via <span class="highlight">${gateway.name}</span> has been ${isApproved ? 'approved' : 'rejected'}.</p>
//                     <h3>Details of your Deposit:</h3>
//                     <div class="details">
//                         <p>Amount: <span class="highlight">${Number(deposit.amount).toFixed(2)} ${deposit.method_currency}</span></p>
//                         <p>Charge: <span class="highlight" style="color: red;">${Number(deposit.charge).toFixed(2)} ${deposit.method_currency}</span></p>
//                         <p>Total: <span class="highlight" style="color: red;">${Number(deposit.final_amount).toFixed(2)} ${deposit.method_currency}</span></p>
//                         <p>Pay via: <span class="highlight">${gateway.name}</span></p>
//                         <p>Transaction Number: <span class="highlight">${deposit.trx}</span></p>
//                         <p>Your Current Balance is: <span class="highlight">${Number(userBalance.balance).toFixed(2)} ${deposit.method_currency}</span></p>
//                     </div>
//                     ${feedbackContent}
//                 </div>
//                 <div class="footer">
//                     <p>© 2024 <a href="https://moneyforyou.com">moneyforyou Company</a>. All Rights Reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;
// };

// withdraw
// export const emailContent_withdraw = (user, transaction, method, balance, subject, feedback = null) => {
//     const isApproved = subject === 'Approved';
//     const feedbackContent = feedback ? `<div><h1>Admin Feedback: <span class="highlight" style="color: red;"><u>${feedback}</u></span></h1></div>` : '';

//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     width: 80%;
//                     margin: auto;
//                     background: #ffffff;
//                     padding: 20px;
//                     border-radius: 10px;
//                 }
//                 .header {
//                     background: #007bff;
//                     color: #ffffff;
//                     padding: 10px 0;
//                     text-align: center;
//                 }
//                 .content {
//                     margin: 20px 0;
//                 }
//                 .content p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                 }
//                 .content .highlight {
//                     color: #007bff;
//                     font-weight: bold;
//                 }
//                 .details {
//                     background: #f9f9f9;
//                     padding: 10px;
//                     border-radius: 10px;
//                     margin-top: 20px;
//                 }
//                 .details p {
//                     margin: 0;
//                     font-size: 14px;
//                 }
//                 .footer {
//                     text-align: center;
//                     margin-top: 20px;
//                     color: #888;
//                 }
//                 .footer a {
//                     color: #007bff;
//                     text-decoration: none;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <h1>This is a System Generated Email</h1>
//             </div>
//             <div class="container">
//                 <div style="text-align: center;">
//                     <img src="https://via.placeholder.com/150" alt="Logo" style="width: 150px; height: auto;">
//                 </div>
//                 <div class="content">
//                     <h2>Hello ${user.firstname}</h2>
//                     <p>Your withdraw request of <span class="highlight">${Number(transaction.amount).toFixed(2)} ${transaction.currency}</span> via <span class="highlight">${method.name}</span> has been ${isApproved ? 'approved' : 'rejected'}.</p>
//                     <h3>Details of your Withdraw:</h3>
//                     <div class="details">
//                         <p>Amount: <span class="highlight">${Number(transaction.amount).toFixed(2)} ${transaction.currency}</span></p>
//                         <p>Charge: <span class="highlight" style="color: red;">${Number(transaction.charge).toFixed(2)} ${transaction.currency}</span></p>
//                         <p>Total: <span class="highlight" style="color: red;">${Number(transaction.after_charge).toFixed(2)} ${transaction.currency}</span></p>
//                         <p>Pay via: <span class="highlight">${method.name}</span></p>
//                         <p>Transaction Number: <span class="highlight">${transaction.trx}</span></p>
//                         <p>Your Current Balance is: <span class="highlight">${Number(balance.balance).toFixed(2)} ${transaction.currency}</span></p>
//                     </div>
//                     ${feedbackContent}
//                 </div>
//                 <div class="footer">
//                     <p>© 2024 <a href="https://moneyforyou.com">moneyforyou Company</a>. All Rights Reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;
// };

// autopay
// export const emailContent_pay = (user, installment, plan, transaction, userBalance) => {
//     const isBalancePayment = userBalance !== null;

//     return `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f4f4f4;
//                     margin: 0;
//                     padding: 0;
//                 }
//                 .container {
//                     width: 80%;
//                     margin: auto;
//                     background: #ffffff;
//                     padding: 20px;
//                     border-radius: 10px;
//                 }
//                 .header {
//                     background: #007bff;
//                     color: #ffffff;
//                     padding: 10px 0;
//                     text-align: center;
//                 }
//                 .content {
//                     margin: 20px 0;
//                 }
//                 .content p {
//                     font-size: 16px;
//                     line-height: 1.5;
//                 }
//                 .content .highlight {
//                     color: #007bff;
//                     font-weight: bold;
//                 }
//                 .details {
//                     background: #f9f9f9;
//                     padding: 10px;
//                     border-radius: 10px;
//                     margin-top: 20px;
//                 }
//                 .details p {
//                     margin: 0;
//                     font-size: 14px;
//                 }
//                 .footer {
//                     text-align: center;
//                     margin-top: 20px;
//                     color: #888;
//                 }
//                 .footer a {
//                     color: #007bff;
//                     text-decoration: none;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="header">
//                 <h1>This is a System Generated Email</h1>
//             </div>
//             <div class="container">
//                 <div style="text-align: center;">
//                     <img src="${process.env.USER_DOMAIN}/public/banner_logo.png" alt="Company Logo">
//                 </div>
//                 <div class="content">
//                     <h2>สวัสดี ${user.firstname}</h2>
//                     <p>คุณมีการชำระสินเชื่อ <span class="highlight">${plan.name}</span> เรียบร้อยแล้ว</p>
//                     <h3>รายละเอียดการชำระ:</h3>
//                     <div class="details">
//                         <p>ยอดชำระต่องวด: <span class="highlight">${Number(installment.paid).toFixed(2)} บาท</span></p>
//                         <p>ล่าช้า: <span class="highlight">${installment.delay_days} วัน</span></p>
//                         <p>ค่าปรับ: <span class="highlight" style="color: red;">${Number(installment.delay_charge).toFixed(2)} บาท</span></p>
//                         <p>ยอดรวมที่ต้องชำระ: <span class="highlight">${Number(transaction.amount).toFixed(2)} บาท</span></p>
//                         <p>เลขที่สัญญา: <span class="highlight">${transaction.trx}</span></p>
//                         <p>วันที่ชำระ: <span class="highlight">${installment.given_at.toLocaleDateString()}</span></p>
//                         ${isBalancePayment ? `
//                         <p>ยอดคงเหลือในระบบ: <span class="highlight">${Number(userBalance.balance).toFixed(2)} บาท</span></p>
//                         ` : `
//                         <p>ชำระผ่าน: <span class="highlight">QR Code</span></p>
//                         `}
//                     </div>
//                     <h1 style="text-align: center;">ขอบคุณที่ใช้บริการ</h1>
//                 </div>
//                 <div class="footer">
//                     <p>© 2024 <a href="https://moneyforyou.com">moneyforyou Company</a>. All Rights Reserved.</p>
//                 </div>
//             </div>
//         </body>
//         </html>
//     `;
// };

// เลือกส่งเป็นบุคคล
// export const sendNotification = async (req, res) => {
//     const { to, subject, message } = req.body;

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.GMAIL_USER,
//             pass: process.env.GMAIL_PASS
//         }
//     });

//     try {
//         let recipients = [];
//         if (Array.isArray(to)) {
//             // ดึงข้อมูลของผู้รับหลายคน
//             const users = await orm(system_users).find({
//                 where: to.map(email => ({ email }))
//             });
//             recipients = users.map(user => ({ id: user.id, email: user.email }));
//         } else if (to === 'All Users') {
//             // ดึง user_id และอีเมลของผู้ใช้ทั้งหมดจากฐานข้อมูล
//             const users = await orm(system_users).find();
//             recipients = users.map(user => ({ id: user.id, email: user.email }));
//         } else {
//             // กรณีส่งไปยังผู้ใช้คนเดียว
//             const user = await orm(system_users).findOne({ where: { email: to } });
//             if (!user) {
//                 return res.status(404).json({ error: 'User not found' });
//             }
//             recipients = [{ id: user.id, email: user.email }];
//         }

//         const results = [];
//         for (const recipient of recipients) {
//             const mailOptions = {
//                 from: process.env.GMAIL_USER,
//                 to: recipient.email,
//                 subject: subject,
//                 html: message
//             };

//             const sentEmail = await transporter.sendMail(mailOptions);

//             let save = {}

//             save = await orm(NotificationEmail).save({
//                 user_id: recipient.id,
//                 sent_from: process.env.GMAIL_USER,
//                 sent_to: recipient.email,
//                 subject: subject,
//                 message: message,
//                 notification_type: 'email',
//             });
//             results.push({ sentEmail });
//         }

//         return res.success('Emails sent successfully.', results );
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// };
