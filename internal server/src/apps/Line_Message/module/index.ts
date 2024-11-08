import axios from "axios";
import { AppDataSource, orm } from "../../../data-source";
import { Users } from "../../Users/entities";
import { randomNumber, toDate, toTHB } from "../../../Utils";
import { Loan } from "../../Loan/entities/loan";

export const Call_Balance = async (to) => {
  try {
    const __content = await callBalance(to);

    let message;
    if (__content.contents.length > 0) {
      message = [
        {
          type: "flex",
          altText: "เช็คยอดชำระ",
          contents: __content,
        },
      ];
    } else {
      message = [
        {
          type: "text",
          text: "ขณะนี้คุณไม่มีสินเชื่อ",
        },
      ];
    }
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

const callBalance = async (line_id) => {
  const __user = await orm(Users).findOne({
    where: { line_id: line_id },
  });
  if (!__user)
    return {
      type: "carousel",
      contents: [],
    };

  const parameters = [__user.id];

  const loanQuery = `
      SELECT l.*,lp.name plan_name FROM (
SELECT * FROM loan WHERE user_id = ?
) l 
LEFT JOIN loan_plan lp ON l.plan_id = lp.id
        `;
  let loanResult = await AppDataSource.query(loanQuery, parameters);

  const __content = loanResult
    .filter(
      (loan) =>
        String(loan.status).toLowerCase() == "running" ||
        String(loan.status).toLowerCase() == "due"
    )
    .map((loan) => {
      return contentCheckSlip(
        loan.plan_name,
        loan.loan_number,
        toTHB(loan.amount),
        toTHB(loan.remaining),
        toTHB(loan.per_installment),
        toDate(loan.installment_due, 1),
        `${Number(loan.given_installment) + 1}`,
        loan.total_installment,
        line_id
      );
    });
  return {
    type: "carousel",
    contents: __content,
  };
};

const contentCheckSlip = (
  planName = "Easy Loans",
  loan_number = "ABC12345",
  loan_amount = "50,000 บาท",
  loan_remaining = "50,000 บาท",
  amount = "1,250 บาท",
  date = "12 สิงหาคม 2567",
  installment = "1",
  total_installment = "12",
  line_id = ""
) => {
  return {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "แจ้งเตือน",
          weight: "bold",
          size: "xl",
          contents: [],
        },
        {
          type: "text",
          text: "คุณมีกำหนดชำระสินเชื่อ",
          color: "#666666",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "สินเชื่อ",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: planName,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "เลขที่สัญญา",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: loan_number,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "ยอดกู้",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: loan_amount,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "ยอดคงเหลือ",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: loan_remaining,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "จำนวน",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: amount,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "กำหนดชำระ",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: date,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "งวดที่",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: `${installment}/${total_installment}`,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "*กรุณาชำระภายในวันที่กำหนด",
              color: "#ff0000",
              size: "xs",
              margin: "md",
            },
          ],
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          height: "sm",
          color: "#DBAE5B",
          action: {
            type: "uri",
            label: "ชำระเงิน",
            uri: `${process.env.USER_DOMAIN}/payment/${encodeURIComponent(
              loan_number
            )}/${encodeURIComponent(
              amount.replace(/[^\d.]/g, "")
            )}`,
          },
        },
        // {
        //   type: "button",
        //   style: "primary",
        //   height: "sm",
        //   color: "#DBAE5B",
        //   action: {
        //     type: "postback",
        //     label: "ชำระเงิน",
        //     displayText:"ขอ QR Code ชำระเงินค่างวด",
        //     data: `?from=${encodeURIComponent(
        //       line_id
        //     )}&loan_number=${encodeURIComponent(
        //       loan_number
        //     )}&amount=${encodeURIComponent(
        //       amount.replace(/[^\d.]/g, "")
        //     )}`,
        //   },
        // },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          margin: "sm",
        },
      ],
      flex: 0,
    },
  };
};

export const Line_SendNotificateCharge = async (
  to = "Ud75689398caa0a79d6a26faa0ae71fe4",
  planName = "Easy Loans",
  loan_number = "ABC12345",
  amount = "1,250 บาท",
  date = "12 สิงหาคม 2567"
) => {
  const __content = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "แจ้งเตือน",
          weight: "bold",
          size: "xl",
          contents: [],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "สินเชื่อ",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: planName,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "เลขที่สัญญา",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: loan_number,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "จำนวน",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: amount,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "กำหนดชำระ",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: date,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "*การชำระหนี้ของคุณเกินเวลาที่กำหนด ทางบริษัทจะมีการคิดค่าทวงถาม ตามเงื่อนไขที่กำหนด ",
                  wrap: true,
                  color: "#FF0000",
                  size: "sm",
                  flex: 6,
                },
              ],
            },
          ],
          margin: "lg",
        },
      ],
      margin: "lg",
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          height: "sm",
          action: {
            type: "uri",
            label: "เรียนรู้เพิ่มเติม",
            uri: "https://www.moneyforyou.co.th/terms-conditions/",
          },
          color: "#DBAE5B",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          margin: "sm",
        },
      ],
      flex: 0,
    },
  };

  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: [
          {
            type: "flex",
            altText: "แจ้งเตือนเกินกำหนดชำระ",
            contents: __content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const Line_SendNotificate = async (
  to = "Ud75689398caa0a79d6a26faa0ae71fe4",
  planName = "Easy Loans",
  loan_number = "ABC12345",
  amount = "1,250 บาท",
  date = "12 สิงหาคม 2567",
  installment = "1",
  total_installment = "12"
) => {
  const __content = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "แจ้งเตือน",
          weight: "bold",
          size: "xl",
          contents: [],
        },
        {
          type: "text",
          text: "คุณมีกำหนดชำระสินเชื่อ",
          color: "#666666",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "สินเชื่อ",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: planName,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "เลขที่สัญญา",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: loan_number,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "จำนวน",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: amount,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "กำหนดชำระ",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: date,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "งวดที่",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: `${installment}/${total_installment}`,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 2,
                },
              ],
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "*กรุณาชำระภายในวันที่กำหนด",
              color: "#ff0000",
              size: "xs",
              margin: "md",
            },
          ],
        },
      ],
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "primary",
          height: "sm",
          action: {
            type: "uri",
            label: "ชำระสินเชื่อ",
            uri: process.env.REDIRECT_URI,
          },
          color: "#DBAE5B",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [],
          margin: "sm",
        },
      ],
      flex: 0,
    },
  };

  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: [
          {
            type: "flex",
            altText: "แจ้งเตือนครบกำหนดชำระ",
            contents: __content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const Line_Reject = async (
  to = "Ud75689398caa0a79d6a26faa0ae71fe4",
  loan_plan = "Easy Loans",
  amount = "50,000 บาท",
  name = "ทดสอบระบบ",
  reason = ""
) => {
  const __content = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "แจ้งเตือน",
          weight: "bold",
          size: "xl",
        },
        {
          type: "text",
          text: "การขอสินเชื่อถูกปฏิเสธ",
          color: "#ff0000",
        },
        ...(reason
          ? [
              {
                type: "text",
                text: `*สาเหตุ: ${reason}`,
                wrap: true,
                color: "#000000",
                margin: "sm",
              },
            ]
          : []),
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "สินเชื่อ: ",
                  color: "#000000",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: loan_plan,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ยอดกู้: ",
                      color: "#000000",
                      size: "sm",
                      flex: 2,
                    },
                    {
                      type: "text",
                      text: amount,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ผู้กู้: ",
                      color: "#000000",
                      size: "sm",
                      flex: 2,
                    },
                    {
                      type: "text",
                      text: name,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  };

  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: [
          {
            type: "flex",
            altText: "แจ้งเตือนการปฎิเสธสินเชื่อ",
            contents: __content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const Line_Approve = async (
  to = "Ud75689398caa0a79d6a26faa0ae71fe4",
  loan_plan = "Easy Loans",
  loan_number = "6ACCF03FC1F9",
  amount = "50,000 บาท",
  total_installment = "12",
  name = "ทดสอบระบบ",
  date = "12 สิงหาคม 2567",
) => {
  const __content = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "แจ้งเตือน",
          weight: "bold",
          size: "xl",
        },
        {
          type: "text",
          text: "การขอสินเชื่อได้รับการอนุมัติแล้ว",
          color: "#008000",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "สินเชื่อ: ",
                  color: "#000000",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: loan_plan,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "เลขที่สัญญา: ",
                  color: "#000000",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: loan_number,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ยอดกู้: ",
                      color: "#000000",
                      size: "sm",
                      flex: 2,
                    },
                    {
                      type: "text",
                      text: amount,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "จำนวนงวด: ",
                      color: "#000000",
                      size: "sm",
                      flex: 2,
                    },
                    {
                      type: "text",
                      text: total_installment,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ผู้กู้: ",
                      color: "#000000",
                      size: "sm",
                      flex: 2,
                    },
                    {
                      type: "text",
                      text: name,
                      wrap: true,
                      color: "#666666",
                      size: "sm",
                      flex: 5,
                    },
                  ],
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "วันที่อนุมัติ:",
                  color: "#000000",
                  size: "sm",
                  flex: 2,
                },
                {
                  type: "text",
                  text: date,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 5,
                },
              ],
            },
          ],
        },
      ],
    },
  };

  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: [
          {
            type: "flex",
            altText: "แจ้งเตือนการอนุมัติสินเชื่อ",
            contents: __content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const Line_KYC_Apply = async (
  to = "Ud75689398caa0a79d6a26faa0ae71fe4",
  fullname = "แอดมิน - ทดสอบ",
  approve_at = "9 กันยายน 2024" /*ครอบ toDate(new Date(),1)*/,
  status = "1" /* 0 = reject ,1 = approve  ใส่เป็น string*/,
  reason = ""
) => {
  const __content = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "ยืนยันตัวตน",
          weight: "bold",
          size: "xl",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "ชื่อ",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: fullname,
                  wrap: true,
                  size: "sm",
                  flex: 5,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "วันที่",
                  size: "sm",
                  flex: 1,
                },
                {
                  type: "text",
                  text: approve_at,
                  wrap: true,
                  size: "sm",
                  flex: 5,
                },
              ],
            },
          ],
        },
        {
          type: "box",
          layout: "baseline",
          margin: "md",
          contents: [
            {
              type: "text",
              text: status == "1" ? "อนุมัติแล้ว" : "ถูกปฏิเสธ",
              color: status == "1" ? "#198754" : "#eb0000",
              flex: 0,
              wrap: true,
              weight: "bold",
              size: "xl",
            },
          ],
        },
      ],
    },
  };

  if (status == "0" && reason)
    __content.body.contents.push({
      type: "box",
      layout: "baseline",
      margin: "md",
      contents: [
        {
          type: "text",
          text: `*สาเหตุ : ${reason}`,
          color: "#000000",
          flex: 0,
          wrap: true,
          weight: "bold",
          size: "sm",
        },
      ],
    });
  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: [
          {
            type: "flex",
            altText: "แจ้งเตือนการยืนยันตัวตน",
            contents: __content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const Line_SendSlip = async (
  to = "Ud75689398caa0a79d6a26faa0ae71fe4",
  loan_plan = "Easy Loans",
  biller_number = "b244123",
  loan_number = "ab123456",
  date = "12 สิงหาคม 2567",
  installment = "1/2",
  orders = [
    {
      name: "เงินต้น",
      amount: "1,250 บาท",
    },
    {
      name: "ดอกเบี้ย",
      amount: "125 บาท",
    },
    {
      name: "ค่าทวงถาม",
      amount: "0 บาท",
    },
  ],
  total = "1,400 บาท",
  paid = "วลีศิลป์"
) => {
  const __orders = orders.map((order) => {
    return {
      type: "box",
      layout: "baseline",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: order.name,
          color: "#666666",
          size: "sm",
          flex: 1,
        },
        {
          type: "text",
          text: order.amount,
          wrap: true,
          color: "#666666",
          size: "sm",
          flex: 1,
        },
      ],
    };
  });
  const __content = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "ใบเสร็จ",
          weight: "bold",
          size: "xl",
          contents: [],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "เลขที่",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: biller_number,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "เลขที่สัญญา",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: loan_number,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "สินเชื่อ",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: loan_plan,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },

            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "วันที่",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: date,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "งวดที่",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: installment,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
          ],
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "รายการ",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
                {
                  type: "text",
                  text: "จำนวนเงิน",
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  weight: "bold",
                },
              ],
            },
          ],
          margin: "lg",
        },
        {
          type: "box",
          layout: "vertical",
          margin: "sm",
          spacing: "sm",
          contents: __orders,
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                  text: "รวม",
                  weight: "bold",
                },
                {
                  type: "text",
                  text: total,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 1,
                },
              ],
            },
          ],
          margin: "md",
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: paid,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 6,
                },
              ],
            },
          ],
          margin: "lg",
        },
      ],
      margin: "lg",
    },
  };

  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: [
          {
            type: "flex",
            altText: "การชำระเงินสำเร็จขอบคุณที่ทำรายการ",
            contents: __content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};

//ปิงเพิ่ม
export const Line_SendNotificateDue = async (
  to = "Ud75689398caa0a79d6a26faa0ae71fe4",
  planName = "Easy Loans",
  loan_number = "ABC12345",
  amount = "1,250 บาท",
  date = "12 สิงหาคม 2567",
  installment = "1",
  total_installment = "12",
  loan_amount,
  loan_remaining
) => {
  const __content = contentCheckSlip(
    planName,
    loan_number,
    loan_amount,
    loan_remaining,
    amount,
    date,
    installment,
    total_installment,
    to
  );

  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: to,
        messages: [
          {
            type: "flex",
            altText: "แจ้งเตือนครบกำหนดชำระ",
            contents: __content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
    return err;
  }
};
