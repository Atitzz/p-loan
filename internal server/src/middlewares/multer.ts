import * as multer from 'multer';
const allowedMimeTypes = ['image/jpeg', 'image/png'];
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({error:'รูปแบบข้อมูลไม่ถูกต้อง!'}, false);
  }
};
export const upload = multer({ storage: multer.memoryStorage(),fileFilter });
