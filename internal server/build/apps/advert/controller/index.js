"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdvertId = exports.editAdvertId = exports.getAdvertId = exports.getAdvert = exports.addAdvert = void 0;
var data_source_1 = require("../../../data-source");
var Utils_1 = require("../../../Utils");
var fs = require("fs");
var path = require("path");
var sharp = require("sharp");
var entities_1 = require("../entities");
var typeorm_1 = require("typeorm");
var axios_1 = require("axios");
var uuidv4_1 = require("uuidv4");
function convertHTMLToFlexMessage(html) {
    // นำ HTML มาแยกบรรทัดด้วย <p> และ <br>
    var paragraphs = html.split(/<\/?p>/).filter(function (p) { return p.trim() !== ""; });
    var contents = [];
    paragraphs.forEach(function (paragraph) {
        // แยกบรรทัดด้วย <br>
        var lines = paragraph.split(/<br\s*\/?>/i).filter(function (l) { return l.trim() !== ""; });
        lines.forEach(function (line) {
            // แปลง <strong> และ <em>
            var text = line;
            var styles = [];
            if (/<strong>(.*?)<\/strong>/i.test(text)) {
                text = text.replace(/<strong>(.*?)<\/strong>/i, "$1");
                styles.push({ type: "bold" });
            }
            if (/<em>(.*?)<\/em>/i.test(text)) {
                text = text.replace(/<em>(.*?)<\/em>/i, "$1");
                styles.push({ type: "italic" });
            }
            // สร้างส่วนประกอบข้อความ
            contents.push(__assign(__assign(__assign({ type: "text", text: text }, (styles.some(function (s) { return s.type === "bold"; }) && { weight: "bold" })), (styles.some(function (s) { return s.type === "italic"; }) && { style: "italic" })), { wrap: true }));
        });
    });
    return {
        type: "flex",
        altText: "ข้อความโปรโมชั่น",
        contents: {
            type: "bubble",
            body: {
                type: "box",
                layout: "vertical",
                contents: contents,
            },
        },
    };
}
var addAdvert = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, created_at, updated_at, deleted_at, obj, existingAdvert, advert, timestamp, filename, uploadPath, savedAdvert, message, image, err_1, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at"]);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                if (!obj.title)
                    return [2 /*return*/, res.error("กรุณาระบุหัวข้อ")];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).findOne({
                        where: {
                            title: obj.title,
                        },
                    })];
            case 2:
                existingAdvert = _b.sent();
                if (existingAdvert)
                    return [2 /*return*/, res.error("มีหัวข้อนี้อยู่แล้ว")];
                advert = new entities_1.LoanAdvert();
                advert.title = obj.title;
                advert.description = obj.description;
                if (!req.file) return [3 /*break*/, 4];
                timestamp = Date.now();
                filename = (0, Utils_1.writeFile)("advert-".concat(timestamp), req.file, "uploads/advert");
                uploadPath = path.join(__dirname, "../../../uploads/advert", filename);
                return [4 /*yield*/, sharp(req.file.buffer).resize(1080, 1080).toFile(uploadPath)];
            case 3:
                _b.sent();
                advert.images = "advert/".concat(filename);
                _b.label = 4;
            case 4: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).save(advert)];
            case 5:
                savedAdvert = _b.sent();
                return [4 /*yield*/, savedAdvert.createLog(req, "create", "advert", obj)];
            case 6:
                _b.sent();
                message = [];
                image = "".concat(process.env.USER_DOMAIN, "/file/").concat(advert.images);
                if (advert.images)
                    message.push({
                        type: "image",
                        originalContentUrl: String(image),
                        previewImageUrl: String(image),
                    });
                _b.label = 7;
            case 7:
                _b.trys.push([7, 9, , 10]);
                return [4 /*yield*/, axios_1.default.post("https://api.line.me/v2/bot/message/broadcast", {
                        messages: message,
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer ".concat(process.env.LINE_MESSAGE_TOKEN),
                            "X-Line-Retry-Key": (0, uuidv4_1.uuid)(),
                        },
                    })];
            case 8:
                _b.sent();
                return [3 /*break*/, 10];
            case 9:
                err_1 = _b.sent();
                console.log(err_1);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/, res.success("สร้างรายการสำเร็จ", savedAdvert)];
            case 11:
                err_2 = _b.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.addAdvert = addAdvert;
var getAdvert = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, perPage, offset, whereClause, _total, advert, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                whereClause = {};
                if (search) {
                    whereClause.title = (0, typeorm_1.Like)("%".concat(search, "%"));
                }
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).count({ where: whereClause })];
            case 2:
                _total = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).find({
                        where: whereClause,
                        take: perPage,
                        skip: offset,
                    })];
            case 3:
                advert = _b.sent();
                if (!advert)
                    return [2 /*return*/, res.error("ไม่พบรายการ")];
                return [2 /*return*/, res.success("รายการทั้งหมด", advert, _total)];
            case 4:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAdvert = getAdvert;
var getAdvertId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, advert, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).findOne({ where: { id: _id } })];
            case 2:
                advert = _a.sent();
                if (!advert)
                    return [2 /*return*/, res.error("ไม่พบรายการ")];
                return [2 /*return*/, res.success("get image success", advert)];
            case 3:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAdvertId = getAdvertId;
var editAdvertId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, _a, created_at, updated_at, deleted_at, deleteImage, obj, advert, oldImagePath, oldImagePath, timestamp, filename, uploadPath, save, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a = req.body, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, deleteImage = _a.deleteImage, obj = __rest(_a, ["created_at", "updated_at", "deleted_at", "deleteImage"]);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).findOne({ where: { id: _id } })];
            case 2:
                advert = _b.sent();
                if (!advert)
                    return [2 /*return*/, res.error("ไม่พบรายการที่เลือก")];
                advert.title = obj.title;
                advert.description = obj.description ? obj.description : null;
                if (!(deleteImage === "true")) return [3 /*break*/, 3];
                if (advert.images) {
                    oldImagePath = path.join(__dirname, "../../../uploads", advert.images);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                advert.images = null;
                return [3 /*break*/, 5];
            case 3:
                if (!req.file) return [3 /*break*/, 5];
                if (advert.images) {
                    oldImagePath = path.join(__dirname, "../../../uploads", advert.images);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                timestamp = Date.now();
                filename = (0, Utils_1.writeFile)("advert-".concat(timestamp), req.file, "uploads/advert");
                uploadPath = path.join(__dirname, "../../../uploads/advert", filename);
                return [4 /*yield*/, sharp(req.file.buffer).resize(1080, 1080).toFile(uploadPath)];
            case 4:
                _b.sent();
                advert.images = "advert/".concat(filename);
                _b.label = 5;
            case 5: return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).save(advert)];
            case 6:
                save = _b.sent();
                return [4 /*yield*/, save.createLog(req, "update", "advert", { obj: obj, image: advert.image })];
            case 7:
                _b.sent();
                return [2 /*return*/, res.success("อัพเดทสำเร็จ", advert)];
            case 8:
                err_5 = _b.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.editAdvertId = editAdvertId;
var deleteAdvertId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, advert, imagePath, save, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).findOne({ where: { id: id } })];
            case 2:
                advert = _a.sent();
                if (!advert)
                    return [2 /*return*/, res.error("Advert not found")];
                if (advert.images) {
                    imagePath = path.join(__dirname, "../../../uploads", advert.images);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.LoanAdvert).remove(advert)];
            case 3:
                save = _a.sent();
                return [4 /*yield*/, save.createLog(req, "remove", "advert", advert)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success("ลบรายการสำเร็จ")];
            case 5:
                err_6 = _a.sent();
                console.log(err_6);
                return [2 /*return*/, res.error(err_6.detail || err_6.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteAdvertId = deleteAdvertId;
