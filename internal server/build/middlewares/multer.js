"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var multer = require("multer");
var allowedMimeTypes = ['image/jpeg', 'image/png'];
var fileFilter = function (req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb({ error: 'รูปแบบข้อมูลไม่ถูกต้อง!' }, false);
    }
};
exports.upload = multer({ storage: multer.memoryStorage(), fileFilter: fileFilter });
