"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReceiptNumber = exports.generateLoanNumber = exports.reSizeBase64 = exports.isValidDecimalNumber = exports.validateMimetype = exports.htmlEmailVerify = exports.send_mail = exports.obfuscateTel = exports.obfuscateEmail = exports.randomNumber = exports.Random_String = exports.convertFieldsToNumbers = exports.generateReference = exports.writeFile = exports.formatDate = exports.toTHB = exports.toDate = exports.logs = exports.processQRCodeFromImage = void 0;
var path = require("path");
var nodemailer = require("nodemailer");
var jimp_1 = require("jimp");
var QrCode = require("qrcode-reader");
var bwipjs = require("bwip-js");
var fs = require("fs");
var sharp = require("sharp");
var loan_1 = require("../apps/Loan/entities/loan");
var data_source_1 = require("../data-source");
var loan_installment_1 = require("../apps/Loan/entities/loan_installment");
function extractPromptPayInfo(qr) {
    var payNumberRegex = /A000000677\d{2}(\d+)/;
    var amountRegex = /54(\d{2})(\d+)/;
    var payNumberMatch = qr.match(payNumberRegex);
    var amountMatch = qr.match(amountRegex);
    var payNumber = payNumberMatch ? payNumberMatch[1] : null;
    var baht = amountMatch[1];
    var satang = amountMatch[2];
    var amount = ((parseInt(baht) * 100) + parseInt(satang)).toString();
    console.log(payNumber);
    console.log(amount);
    return { payNumber: payNumber, amount: amount };
}
function processQRCodeFromImage(imagePath, name) {
    return __awaiter(this, void 0, void 0, function () {
        var image, dir, filename, filePath, qr, qrData, _a, payNumber, amount, barcodeData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, jimp_1.Jimp.read(imagePath)];
                case 1:
                    image = _b.sent();
                    dir = path.join(__dirname, "../uploads/barcode");
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    filename = "".concat(name);
                    filePath = path.join(dir, filename);
                    qr = new QrCode();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            qr.callback = function (err, value) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(value.result);
                                }
                            };
                            qr.decode(image.bitmap);
                        })];
                case 2:
                    qrData = _b.sent();
                    if (typeof qrData !== "string") {
                        throw new Error("ข้อมูลที่ได้จาก QR Code ไม่ใช่ string");
                    }
                    console.log("ข้อมูลจาก QR Code:", qrData);
                    _a = extractPromptPayInfo(qrData), payNumber = _a.payNumber, amount = _a.amount;
                    barcodeData = "".concat(payNumber, "*").concat(amount);
                    // สร้าง Barcode จากข้อมูลที่ได้
                    bwipjs.toBuffer({
                        bcid: "code128",
                        text: barcodeData,
                        scale: 3,
                        height: 12,
                        includetext: true,
                        textxalign: "center", // จัดตำแหน่งข้อความ
                    }, function (err, png) {
                        if (err) {
                            console.error("เกิดข้อผิดพลาด:", err);
                        }
                        else {
                            // บันทึก Barcode เป็นไฟล์ภาพ
                            fs.writeFileSync(filePath, png);
                            console.log("สร้างไฟล์ Barcode เรียบร้อย: barcode.png");
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.processQRCodeFromImage = processQRCodeFromImage;
function logs(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var clientIp, message;
        return __generator(this, function (_b) {
            clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
            message = "[".concat(formatDate(Date.now()), "] [ACTION] : *").concat(req.path, " [METHOD] ").concat(req.method, " [IPS] ").concat(clientIp);
            message += " [USER] : ".concat(((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.username) || "unknown");
            console.log(message);
            next();
            return [2 /*return*/];
        });
    });
}
exports.logs = logs;
function toDate(isoDateString, option) {
    if (option === void 0) { option = 0; }
    if (!isoDateString)
        return "N/A";
    var dateObject = new Date(isoDateString);
    if (isNaN(dateObject.getTime()))
        return "N/A";
    var options = {
        day: option === 3 ? undefined : "2-digit",
        month: option === 3 ? "long" : "short",
        year: "numeric",
        hour: option === 0 ? "2-digit" : undefined,
        minute: option === 0 ? "2-digit" : undefined,
    };
    var formatter = new Intl.DateTimeFormat("th-TH", options);
    var formattedDate = formatter.format(dateObject);
    var buddhistYear = dateObject.getFullYear() + 543; // คำนวณเป็นปี พ.ศ.
    return formattedDate.replace(/\d{4}/, "\u0E1E.\u0E28. ".concat(buddhistYear));
}
exports.toDate = toDate;
function toTHB(amount) {
    if (isNaN(amount))
        return "0.00";
    return "".concat(Number(amount).toLocaleString("th-TH", {
        minimumFractionDigits: 2,
    }), " \u0E1A\u0E32\u0E17");
}
exports.toTHB = toTHB;
function formatDate(timestamp) {
    var date = new Date(timestamp);
    var day = String(date.getDate()).padStart(2, "0");
    var month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0 indexed
    var year = String(date.getFullYear()).slice(2); // Just last 2 digits of year
    var hour = String(date.getHours()).padStart(2, "0");
    var minute = String(date.getMinutes()).padStart(2, "0");
    return "".concat(month, "/").concat(day, "/").concat(year, " ").concat(hour, ":").concat(minute);
}
exports.formatDate = formatDate;
var writeFile = function (name, file, folder) {
    var dir = path.join(__dirname, "../".concat(folder));
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    var filename = "".concat(name).concat(path.extname(file.originalname));
    var filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, file.buffer);
    return filename;
};
exports.writeFile = writeFile;
function generateReference(date, id) {
    if (date === void 0) { date = new Date(); }
    if (!id) {
        throw new Error("ID is required to generate a reference number.");
    }
    var year = date.getFullYear().toString().slice(2); // ตัดเลขปีให้เหลือ 2 หลัก
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // เติม 0 ข้างหน้าเดือนถ้าเป็นเลขหลักเดียว
    var day = ("0" + date.getDate()).slice(-2); // เติม 0 ข้างหน้าวันถ้าเป็นเลขหลักเดียว
    var milliseconds = ("00" + date.getMilliseconds()).slice(-3);
    return "".concat(year).concat(month).concat(day).concat(milliseconds).concat(id);
}
exports.generateReference = generateReference;
var convertFieldsToNumbers = function () {
    var entities = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        entities[_i] = arguments[_i];
    }
    var fieldsToConvert = [
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
    entities.forEach(function (entity) {
        if (entity) {
            fieldsToConvert.forEach(function (field) {
                if (Object.prototype.hasOwnProperty.call(entity, field) &&
                    entity[field] !== null &&
                    entity[field] !== undefined) {
                    var value = parseFloat(entity[field]);
                    if (!isNaN(value)) {
                        entity[field] = value;
                    }
                }
            });
        }
    });
    return entities;
};
exports.convertFieldsToNumbers = convertFieldsToNumbers;
var Random_String = function (length) {
    if (length === void 0) { length = 8; }
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var result = "";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.Random_String = Random_String;
function randomNumber(length) {
    var result = "";
    var characters = "0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.randomNumber = randomNumber;
var obfuscateEmail = function (email) {
    var _a = email.split("@"), user = _a[0], domain = _a[1];
    var obfuscatedUser = user.slice(0, 2) + "*".repeat(user.length - 2);
    var _b = domain.split("."), domainName = _b[0], domainExt = _b[1];
    var obfuscatedDomain = domainName[0] + "*".repeat(domainName.length - 1) + "." + domainExt;
    return obfuscatedUser + "@" + obfuscatedDomain;
};
exports.obfuscateEmail = obfuscateEmail;
function obfuscateTel(tel) {
    if (!tel) {
        return "XXX-XXX-XXXX";
    }
    var cleanTel = tel.replace(/[^0-9]/g, ""); // ลบตัวอักษรที่ไม่ใช่ตัวเลขออก
    if (cleanTel.length < 4) {
        var paddedTel = cleanTel.padStart(4, "0"); // เติมตัวเลข 0 ให้เต็ม 4 ตัวอักษร
        return "XXX-XXX-".concat(paddedTel);
    }
    // แสดงเพียง 4 ตัวอักษรท้าย
    var lastFourDigits = cleanTel.slice(-4);
    return "XXX-XXX-".concat(lastFourDigits);
}
exports.obfuscateTel = obfuscateTel;
var send_mail = function (to, subject, template) { return __awaiter(void 0, void 0, void 0, function () {
    var transporter, mailOptions, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                transporter = nodemailer.createTransport({
                    // host: process.env.MAIL_DOMAIN, // เซิร์ฟเวอร์ SMTP
                    // port: Number(process.env.MAIL_PORT), // พอร์ตที่ใช้สำหรับ SMTP กับ SSL
                    // secure: true, // ใช้ SSL
                    service: 'gmail',
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                    debug: true,
                    logger: true, // แสดงล็อกเพิ่มเติม
                });
                mailOptions = {
                    from: process.env.MAIL_USER,
                    to: to,
                    subject: subject,
                    html: template,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _a.sent();
                return [2 /*return*/, true];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.send_mail = send_mail;
var htmlEmailVerify = function (link, name) { return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            background-color: #f4f4f4;\n            margin: 0;\n            padding: 0;\n        }\n        .email-container {\n            background-color: #ffffff;\n            margin: 20px auto;\n            padding: 20px;\n            max-width: 600px;\n            border-radius: 8px;\n            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n        }\n        .email-header {\n            text-align: center;\n            margin-bottom: 20px;\n        }\n        .email-header img {\n            max-width: 100px;\n        }\n        .email-body {\n            margin-bottom: 20px;\n        }\n        .email-body p {\n            margin: 0;\n            padding: 10px 0;\n        }\n        .email-footer {\n            text-align: center;\n        }\n        .btn {\n            display: inline-block;\n            background-color: #007bff;\n            color: #ffffff;\n            padding: 10px 20px;\n            text-decoration: none;\n            border-radius: 5px;\n            margin-top: 20px;\n        }\n    </style>\n</head>\n<body>\n    <div class=\"email-container\">\n        <div class=\"email-header\">\n            <img src=\"".concat(process.env.USER_DOMAIN, "/public/banner_logo.png\" alt=\"Company Logo\">\n            <h1>\u0E22\u0E34\u0E19\u0E14\u0E35\u0E15\u0E49\u0E2D\u0E19\u0E23\u0E31\u0E1A\u0E2A\u0E39\u0E48 Money For You</h1>\n        </div>\n        <div class=\"email-body\">\n            <p>\u0E2A\u0E27\u0E31\u0E2A\u0E14\u0E35 ").concat(name, ",</p>\n            <p>\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13\u0E17\u0E35\u0E48\u0E25\u0E07\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E01\u0E31\u0E1A\u0E40\u0E23\u0E32! \u0E01\u0E23\u0E38\u0E13\u0E32\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13\u0E42\u0E14\u0E22\u0E04\u0E25\u0E34\u0E01\u0E17\u0E35\u0E48\u0E1B\u0E38\u0E48\u0E21\u0E14\u0E49\u0E32\u0E19\u0E25\u0E48\u0E32\u0E07:</p>\n            <div class=\"email-footer\">\n                <a href=\"").concat(link, "\" class=\"btn\">\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E2D\u0E35\u0E40\u0E21\u0E25</a>\n            </div>\n            <p>\u0E2B\u0E32\u0E01\u0E04\u0E38\u0E13\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E25\u0E07\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E01\u0E31\u0E1A\u0E40\u0E23\u0E32 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E30\u0E40\u0E27\u0E49\u0E19\u0E2D\u0E35\u0E40\u0E21\u0E25\u0E19\u0E35\u0E49</p>\n            <p>\u0E02\u0E2D\u0E1A\u0E04\u0E38\u0E13,<br>\u0E17\u0E35\u0E21\u0E07\u0E32\u0E19 Money For You</p>\n        </div>\n    </div>\n</body>\n</html>"); };
exports.htmlEmailVerify = htmlEmailVerify;
var validateMimetype = function (base64String, allowedExtensions) {
    var mimeTypeMatch = base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!mimeTypeMatch)
        return false;
    var mimeType = mimeTypeMatch[1];
    var mimeExtension = "." + mimeType.split("/")[1];
    return allowedExtensions.includes(mimeExtension.toLowerCase());
};
exports.validateMimetype = validateMimetype;
function isValidDecimalNumber(param) {
    // ตรวจสอบว่าตัวเลขเป็นตัวเลขจริง
    if (!isNaN(param) && Number(param) === parseFloat(param)) {
        // แปลงเป็นจำนวนทศนิยมและตรวจสอบว่ามีทศนิยม 2 หลัก
        return true;
        var decimalPart = param.toString().split(".")[1];
        return decimalPart && decimalPart.length === 2;
    }
    return false;
}
exports.isValidDecimalNumber = isValidDecimalNumber;
var reSizeBase64 = function (base64Image) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, mimeType, base64Data, buffer, processedImageBuffer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = base64Image.split(','), mimeType = _a[0], base64Data = _a[1];
                buffer = Buffer.from(base64Data, 'base64');
                return [4 /*yield*/, sharp(buffer)
                        // .resize(1024, 768, { fit: 'inside', withoutEnlargement: true })
                        .resize(1024, 768, { fit: 'fill' })
                        .toBuffer()];
            case 1:
                processedImageBuffer = _b.sent();
                return [2 /*return*/, "".concat(mimeType, ",").concat(processedImageBuffer.toString('base64'))];
        }
    });
}); };
exports.reSizeBase64 = reSizeBase64;
var generateLoanNumber = function (planId) { return __awaiter(void 0, void 0, void 0, function () {
    var paddedPlanId, currentYearMonth, lastLoan, newLoanSequence, lastLoanSequence;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paddedPlanId = planId.toString().padStart(3, '0');
                currentYearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({
                        where: { plan_id: planId },
                        order: { loan_number: 'DESC' }
                    })];
            case 1:
                lastLoan = _a.sent();
                newLoanSequence = '0001';
                if (lastLoan && lastLoan.loan_number) {
                    try {
                        lastLoanSequence = parseInt(lastLoan.loan_number.slice(-4), 10);
                        if (!isNaN(lastLoanSequence)) {
                            // เพิ่มลำดับต่อจากลำดับเดิมโดยไม่สนใจเดือน
                            newLoanSequence = (lastLoanSequence + 1).toString().padStart(4, '0');
                        }
                    }
                    catch (error) {
                        console.error("Error parsing loan number:", error);
                    }
                }
                return [2 /*return*/, "MFU-".concat(paddedPlanId, "-").concat(currentYearMonth).concat(newLoanSequence)];
        }
    });
}); };
exports.generateLoanNumber = generateLoanNumber;
var generateReceiptNumber = function (planId) { return __awaiter(void 0, void 0, void 0, function () {
    var paddedPlanId, currentYearMonth, lastInstallment, newReceipt, lastInstallmentSequence;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paddedPlanId = planId.toString().padStart(3, '0');
                currentYearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
                return [4 /*yield*/, (0, data_source_1.orm)(loan_installment_1.Installment).findOne({
                        where: { plan_id: planId },
                        order: { receipt_number: 'DESC' },
                    })];
            case 1:
                lastInstallment = _a.sent();
                newReceipt = '0001';
                if (lastInstallment && lastInstallment.receipt_number) {
                    try {
                        lastInstallmentSequence = parseInt(lastInstallment.receipt_number.slice(-4), 10);
                        if (!isNaN(lastInstallmentSequence)) {
                            newReceipt = (lastInstallmentSequence + 1).toString().padStart(4, '0');
                        }
                    }
                    catch (error) {
                        console.error("Error parsing receipt number:", error);
                    }
                }
                return [2 /*return*/, "MFU-".concat(paddedPlanId, "-").concat(currentYearMonth).concat(newReceipt)];
        }
    });
}); };
exports.generateReceiptNumber = generateReceiptNumber;
