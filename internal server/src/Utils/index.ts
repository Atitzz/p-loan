import * as path from "path";
import * as nodemailer from "nodemailer";
import { Jimp } from "jimp";
import * as QrCode from "qrcode-reader";
import * as bwipjs from "bwip-js";
import * as fs from "fs";
import * as sharp from 'sharp';
import { Loan } from "../apps/Loan/entities/loan";
import { AppDataSource, orm } from "../data-source";
import { Installment } from "../apps/Loan/entities/loan_installment";
import { LoanPlan } from "../apps/Loan/entities/loan_plan";



function extractPromptPayInfo(qr) {
  const payNumberRegex = /A000000677\d{2}(\d+)/;
  const amountRegex = /54(\d{2})(\d+)/;

  const payNumberMatch = qr.match(payNumberRegex);
  const amountMatch = qr.match(amountRegex);

  const payNumber = payNumberMatch ? payNumberMatch[1] : null;
  const baht = amountMatch[1];
  const satang = amountMatch[2];
  const amount = ((parseInt(baht) * 100) + parseInt(satang)).toString();
  console.log(payNumber)
  console.log(amount)
  return { payNumber, amount };
}

export async function processQRCodeFromImage(imagePath,name) {
  // โหลดภาพ QR Code ด้วย Jimp
  const image = await Jimp.read(imagePath);
  const dir = path.join(__dirname, `../uploads/barcode`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filename = `${name}`;
  const filePath = path.join(dir, filename);
  // อ่านข้อมูลจาก QR Code
  const qr = new QrCode();
  const qrData = await new Promise((resolve, reject) => {
    qr.callback = (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value.result);
      }
    };
    qr.decode(image.bitmap);
  });
  if (typeof qrData !== "string") {
    throw new Error("ข้อมูลที่ได้จาก QR Code ไม่ใช่ string");
  }
  console.log("ข้อมูลจาก QR Code:", qrData);
  const {payNumber,amount} =extractPromptPayInfo(qrData)
  const barcodeData = `${payNumber}*${amount}`;
  // สร้าง Barcode จากข้อมูลที่ได้
  bwipjs.toBuffer(
    {
      bcid: "code128", // ชนิด Barcode
      text: barcodeData, // ข้อมูลที่จะใช้ใน Barcode
      scale: 3, // ขนาดของ Barcode
      height: 12, // ความสูงของ Barcode
      includetext: true, // แสดงข้อความใน Barcode
      textxalign: "center", // จัดตำแหน่งข้อความ
    },
    (err, png) => {
      if (err) {
        console.error("เกิดข้อผิดพลาด:", err);
      } else {
        // บันทึก Barcode เป็นไฟล์ภาพ
        fs.writeFileSync(filePath, png);
        console.log("สร้างไฟล์ Barcode เรียบร้อย: barcode.png");
      }
    }
  );
}

export async function logs(req, res, next) {
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  let message = `[${formatDate(Date.now())}] [ACTION] : *${req.path} [METHOD] ${
    req.method
  } [IPS] ${clientIp}`;

  message += ` [USER] : ${req?.user?.username || "unknown"}`;
  console.log(message);
  next();
}
export function toDate(isoDateString: any, option: number = 0) {
  if (!isoDateString) return "N/A";

  const dateObject = new Date(isoDateString);
  if (isNaN(dateObject.getTime())) return "N/A";

  const options: any = {
    day: option === 3 ? undefined : "2-digit",
    month: option === 3 ? "long" : "short",
    year: "numeric",
    hour: option === 0 ? "2-digit" : undefined,
    minute: option === 0 ? "2-digit" : undefined,
  };

  const formatter = new Intl.DateTimeFormat("th-TH", options);
  const formattedDate = formatter.format(dateObject);

  const buddhistYear = dateObject.getFullYear() + 543; // คำนวณเป็นปี พ.ศ.
  return formattedDate.replace(/\d{4}/, `พ.ศ. ${buddhistYear}`);
}

export function toTHB(amount: any) {
  if (isNaN(amount)) return "0.00";
  return `${Number(amount).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
  })} บาท`;
}
export function formatDate(timestamp: number) {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0 indexed
  const year = String(date.getFullYear()).slice(2); // Just last 2 digits of year

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${month}/${day}/${year} ${hour}:${minute}`;
}

export const writeFile = (name, file, folder) => {
  const dir = path.join(__dirname, `../${folder}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filename = `${name}${path.extname(file.originalname)}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, file.buffer);
  return filename;
};

export function generateReference(date = new Date(), id) {
  if (!id) {
    throw new Error("ID is required to generate a reference number.");
  }

  const year = date.getFullYear().toString().slice(2); // ตัดเลขปีให้เหลือ 2 หลัก
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // เติม 0 ข้างหน้าเดือนถ้าเป็นเลขหลักเดียว
  const day = ("0" + date.getDate()).slice(-2); // เติม 0 ข้างหน้าวันถ้าเป็นเลขหลักเดียว
  const milliseconds = ("00" + date.getMilliseconds()).slice(-3);

  return `${year}${month}${day}${milliseconds}${id}`;
}

export const convertFieldsToNumbers = (...entities) => {
  const fieldsToConvert = [
    "minimum_amount",
    "maximum_amount",
    "per_installment",
    "application_fixed_charge",
    "application_percent_charge",
    "fixed_charge",
    "percent_charge",
    "amount",
    "charge_per_installment",
    "delay_charge",
    "receivable",
    "total_paid",
    "remaining",
    "paid",
    "charge",
    "rate",
    "final_amount",
    "min_amount",
    "max_amount",
    "post_balance",
  ];

  entities.forEach((entity) => {
    if (entity) {
      fieldsToConvert.forEach((field) => {
        if (
          Object.prototype.hasOwnProperty.call(entity, field) &&
          entity[field] !== null &&
          entity[field] !== undefined
        ) {
          const value = parseFloat(entity[field]);
          if (!isNaN(value)) {
            entity[field] = value;
          }
        }
      });
    }
  });

  return entities;
};

export const Random_String = (length: number = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export function randomNumber(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const obfuscateEmail = (email) => {
  const [user, domain] = email.split("@");
  const obfuscatedUser = user.slice(0, 2) + "*".repeat(user.length - 2);
  const [domainName, domainExt] = domain.split(".");
  const obfuscatedDomain =
    domainName[0] + "*".repeat(domainName.length - 1) + "." + domainExt;
  return obfuscatedUser + "@" + obfuscatedDomain;
};

export function obfuscateTel(tel) {
  if (!tel) {
    return "XXX-XXX-XXXX";
  }

  let cleanTel = tel.replace(/[^0-9]/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก

  if (cleanTel.length < 4) {
    let paddedTel = cleanTel.padStart(4, "0"); // เติมตัวเลข 0 ให้เต็ม 4 ตัวอักษร
    return `XXX-XXX-${paddedTel}`;
  }

  // แสดงเพียง 4 ตัวอักษรท้าย
  let lastFourDigits = cleanTel.slice(-4);
  return `XXX-XXX-${lastFourDigits}`;
}

export const send_mail = async (to, subject, template) => {
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

  let mailOptions = {
    from: process.env.MAIL_USER,
    to: to,
    subject: subject,
    html: template,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const htmlEmailVerify = (link, name) => `<!DOCTYPE html>
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
        .email-container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
        }
        .email-header img {
            max-width: 100px;
        }
        .email-body {
            margin-bottom: 20px;
        }
        .email-body p {
            margin: 0;
            padding: 10px 0;
        }
        .email-footer {
            text-align: center;
        }
        .btn {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="${process.env.USER_DOMAIN}/public/banner_logo.png" alt="Company Logo">
            <h1>ยินดีต้อนรับสู่ Money For You</h1>
        </div>
        <div class="email-body">
            <p>สวัสดี ${name},</p>
            <p>ขอบคุณที่ลงทะเบียนกับเรา! กรุณายืนยันอีเมลของคุณโดยคลิกที่ปุ่มด้านล่าง:</p>
            <div class="email-footer">
                <a href="${link}" class="btn">ยืนยันอีเมล</a>
            </div>
            <p>หากคุณไม่ได้ลงทะเบียนกับเรา กรุณาละเว้นอีเมลนี้</p>
            <p>ขอบคุณ,<br>ทีมงาน Money For You</p>
        </div>
    </div>
</body>
</html>`;

export const validateMimetype = (base64String, allowedExtensions) => {
  const mimeTypeMatch = base64String.match(
    /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/
  );
  if (!mimeTypeMatch) return false;

  const mimeType = mimeTypeMatch[1];

  const mimeExtension = "." + mimeType.split("/")[1];
  return allowedExtensions.includes(mimeExtension.toLowerCase());
};

export function isValidDecimalNumber(param) {
  // ตรวจสอบว่าตัวเลขเป็นตัวเลขจริง
  if (!isNaN(param) && Number(param) === parseFloat(param)) {
    // แปลงเป็นจำนวนทศนิยมและตรวจสอบว่ามีทศนิยม 2 หลัก
    return true
    const decimalPart = param.toString().split(".")[1];
    return decimalPart && decimalPart.length === 2;
  }
  return false;
}


export const reSizeBase64 = async (base64Image) => {
  const [mimeType, base64Data] = base64Image.split(',');
  
  const buffer = Buffer.from(base64Data, 'base64');
  
  const processedImageBuffer = await sharp(buffer)
    // .resize(1024, 768, { fit: 'inside', withoutEnlargement: true })
    .resize(1024, 768, { fit: 'fill' })
    .toBuffer();
  
  return `${mimeType},${processedImageBuffer.toString('base64')}`;
};


export const generateLoanNumber = async (planId) => {
  const paddedPlanId = planId.toString().padStart(3, '0');
  const currentYearMonth = new Date().toISOString().slice(0, 7).replace('-', '');

  const lastLoan = await orm(Loan).findOne({
    where: { plan_id: planId },
    order: { loan_number: 'DESC' }
  });

  let newLoanSequence = '0001'; // ค่าเริ่มต้น ถ้ายังไม่มีสินเชื่อที่สมัครในแผนนี้

  if (lastLoan && lastLoan.loan_number) {
    try {
      const lastLoanSequence = parseInt(lastLoan.loan_number.slice(-4), 10); // หมายเลขลำดับสินเชื่อล่าสุด

      if (!isNaN(lastLoanSequence)) {
        // เพิ่มลำดับต่อจากลำดับเดิมโดยไม่สนใจเดือน
        newLoanSequence = (lastLoanSequence + 1).toString().padStart(4, '0');
      }
    } catch (error) {
      console.error("Error parsing loan number:", error);
    }
  }

  return `MFU-${paddedPlanId}-${currentYearMonth}${newLoanSequence}`;
};


export const generateReceiptNumber = async (planId) => {
  const paddedPlanId = planId.toString().padStart(3, '0');
  const currentYearMonth = new Date().toISOString().slice(0, 7).replace('-', '');

  const lastInstallment = await orm(Installment).findOne({
    where: { plan_id: planId },
    order: { receipt_number: 'DESC' },
  });

  let newReceipt = '0001'; // ค่าเริ่มต้นถ้ายังไม่มีการชำระใด ๆ มาก่อน

  if (lastInstallment && lastInstallment.receipt_number) {
    try {
      const lastInstallmentSequence = parseInt(lastInstallment.receipt_number.slice(-4), 10);

      if (!isNaN(lastInstallmentSequence)) {
        newReceipt = (lastInstallmentSequence + 1).toString().padStart(4, '0');
      }
    } catch (error) {
      console.error("Error parsing receipt number:", error);
    }
  }

  return `MFU-${paddedPlanId}-${currentYearMonth}${newReceipt}`;
};




