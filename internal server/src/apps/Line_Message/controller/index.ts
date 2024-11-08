import axios from "axios";
import { LineCreateQR } from "../../PaymentGateway/controller";
import {
  Call_Balance,
  Line_Approve,
  Line_Reject,
  Line_SendNotificate,
  Line_SendNotificateCharge,
  Line_SendSlip,
} from "../module";
import * as path from "path";
import { toTHB } from "../../../Utils";
const example = {
  destination: "xxxxxxxxxx",
  events: [
    {
      type: "message",
      message: {
        type: "text",
        id: "468789577898262530", // ID of the sent message
        quotedMessageId: "468789532432007169", // ID of the quoted message
        quoteToken: "q3Plxr4AgKd...",
        text: "Chicken, please.", // Text of the sent message
      },
      webhookEventId: "01H810YECXQQZ37VAXPF6H9E6T",
      deliveryContext: {
        isRedelivery: false,
      },
      timestamp: 1692251666727,
      source: {
        type: "group",
        groupId: "Ca56f94637c...",
        userId: "U4af4980629...",
      },
      replyToken: "38ef843bde154d9b91c21320ffd17a0f",
      mode: "active",
    },
  ],
};

export const callPayment = async (req, res) => {
  const { from, loan_number, amount } = req.query;
  const result = await LineCreateQR({
    loan_number: loan_number,
    amount: amount,
  });
  // let message;
  // if (result)
  //   message = [
  //     {
  //       type: "image",
  //       originalContentUrl: String(result),
  //       previewImageUrl: String(result),
  //     },
  //   ];
  // else
  //   message = [
  //     {
  //       type: "text",
  //       text: "ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก",
  //     },
  //   ];
  // try {
  //   await axios.post(
  //     "https://api.line.me/v2/bot/message/push",
  //     {
  //       to: from,
  //       messages: message,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
  //       },
  //     }
  //   );
  // } catch (err) {
  //   console.log(err);
  //   return res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก");
  // }

  if (result) {
    const filePath = path.join(
      __dirname,
      "../../../uploads",
      result.replace(`${process.env.USER_DOMAIN}/file/`, "")
    );
    return res.download(
      filePath,
      result.replace(`${process.env.USER_DOMAIN}/file/qrcode/`, ""),
      (err) => {
        if (err) {
          console.log(err);
          return res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก");
        }
      }
    );
  } else return res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก");
};
export const store = async (req, res) => {
  const { destination, events } = req.body;
  const __event = events[0];
  const __userId = __event.source.userId;
  if (__event.type === "message") {
    if (__event.message.text == "เช็คยอด") {
      await Call_Balance(__userId);
    }
  } else if (__event.type === "postback") {
    const data = __event.postback.data;
    const params = new URLSearchParams(data);
    const loan_number = params.get("loan_number");
    const amount = params.get("amount");
    const result = await LineCreateQR({
      loan_number: loan_number,
      amount: amount,
    });
    let message;
    if (result)
      message = [
        {
          type: "image",
          originalContentUrl: String(result),
          previewImageUrl: String(result),
        },
        {
          type: "text",
          text: `เลขที่สัญญา ${loan_number}`,
        },
        {
          type: "text",
          text: `จำนวนเงิน ${toTHB(amount)}`,
        },
        {
          type: "text",
          text: `QR CODE นี้มีอายุการใช้งาน 10 นาที`,
        },
      ];
    else
      message = [
        {
          type: "text",
          text: "ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก",
        },
      ];
    try {
      await axios.post(
        "https://api.line.me/v2/bot/message/push",
        {
          to: __userId,
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
      return res.send("ระบบปิดปรับปรุง, ขออภัยในความไม่สะดวก");
    }
  }
  return res.success("success", events);
};

export const manualApprove = async (req, res) => {
  const { to, planName, amount, name } = req.body;
  try {
    Line_Approve(to, planName, amount, name);

    return res.success();
  } catch (err) {
    return res.error(err);
  }
};

export const manualReject = async (req, res) => {
  const { to, planName, amount, name } = req.body;
  try {
    Line_Reject(to, planName, amount, name);

    return res.success();
  } catch (err) {
    return res.error(err);
  }
};

export const manualCharge = async (req, res) => {
  const { to, planName, loan_number, amount, date } = req.body;
  try {
    Line_SendNotificateCharge(to, planName, loan_number, amount, date);

    return res.success();
  } catch (err) {
    return res.error(err);
  }
};

export const manualNotificate = (req, res) => {
  const { to, planName, loan_number, amount, date } = req.body;
  try {
    Line_SendNotificate(to, planName, loan_number, amount, date);
    return res.success();
  } catch (err) {
    return res.error(err);
  }
};

export const manualSlip = (req, res) => {
  const { to, planName, loan_number, amount, date } = req.body;
  try {
    Line_SendSlip();
    return res.success();
  } catch (err) {
    return res.error(err);
  }
};
