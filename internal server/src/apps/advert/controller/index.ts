import { AppDataSource, orm } from "../../../data-source";
import { writeFile } from "../../../Utils";
import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
import { LoanAdvert } from "../entities";
import {
  generateReference,
  toTHB,
  validateMimetype,
  toDate,
} from "../../../Utils/index";
import { Like } from "typeorm";
import axios from "axios";
import { uuid } from "uuidv4";
function convertHTMLToFlexMessage(html) {
  // นำ HTML มาแยกบรรทัดด้วย <p> และ <br>
  const paragraphs = html.split(/<\/?p>/).filter((p) => p.trim() !== "");
  const contents = [];

  paragraphs.forEach((paragraph) => {
    // แยกบรรทัดด้วย <br>
    const lines = paragraph.split(/<br\s*\/?>/i).filter((l) => l.trim() !== "");
    lines.forEach((line) => {
      // แปลง <strong> และ <em>
      let text = line;
      const styles = [];

      if (/<strong>(.*?)<\/strong>/i.test(text)) {
        text = text.replace(/<strong>(.*?)<\/strong>/i, "$1");
        styles.push({ type: "bold" });
      }

      if (/<em>(.*?)<\/em>/i.test(text)) {
        text = text.replace(/<em>(.*?)<\/em>/i, "$1");
        styles.push({ type: "italic" });
      }

      // สร้างส่วนประกอบข้อความ
      contents.push({
        type: "text",
        text: text,
        ...(styles.some((s) => s.type === "bold") && { weight: "bold" }),
        ...(styles.some((s) => s.type === "italic") && { style: "italic" }),
        wrap: true,
      });
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

export const addAdvert = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  try {
    if (!obj.title) return res.error("กรุณาระบุหัวข้อ");

    const existingAdvert = await orm(LoanAdvert).findOne({
      where: {
        title: obj.title,
      },
    });

    if (existingAdvert) return res.error("มีหัวข้อนี้อยู่แล้ว");

    const advert = new LoanAdvert();
    advert.title = obj.title;
    advert.description = obj.description;

    if (req.file) {
      const timestamp = Date.now();
      const filename = writeFile(
        `advert-${timestamp}`,
        req.file,
        "uploads/advert"
      );
      const uploadPath = path.join(
        __dirname,
        "../../../uploads/advert",
        filename
      );

      await sharp(req.file.buffer).resize(1080, 1080).toFile(uploadPath);

      advert.images = `advert/${filename}`;
    }

    const savedAdvert = await orm(LoanAdvert).save(advert);
    await savedAdvert.createLog(req, "create", "advert", obj);
    let message = [];
    let image = `${process.env.USER_DOMAIN}/file/${advert.images}`;
    if (advert.images)
      message.push({
        type: "image",
        originalContentUrl: String(image),
        previewImageUrl: String(image),
      });

    // if (advert.description) {
    //   const flexMessage = convertHTMLToFlexMessage(advert.description);
    //   if (flexMessage) message.push(flexMessage);
    //   else
    //     message.push({
    //       type: "text",
    //       text: advert.description,
    //     });
    // }

    try {
      await axios.post(
        "https://api.line.me/v2/bot/message/broadcast",
        {
          messages: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.LINE_MESSAGE_TOKEN}`,
            "X-Line-Retry-Key": uuid(),
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    return res.success("สร้างรายการสำเร็จ", savedAdvert);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const getAdvert = async (req, res) => {
  const { search, page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  try {
    let whereClause: any = {};
    if (search) {
      whereClause.title = Like(`%${search}%`);
    }

    const _total = await orm(LoanAdvert).count({ where: whereClause });
    const advert = await orm(LoanAdvert).find({
      where: whereClause,
      take: perPage,
      skip: offset,
    });
    if (!advert) return res.error("ไม่พบรายการ");

    return res.success("รายการทั้งหมด", advert, _total);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const getAdvertId = async (req, res) => {
  const { id } = req.params;
  const _id = parseInt(id) || -1;

  try {
    const advert = await orm(LoanAdvert).findOne({ where: { id: _id } });
    if (!advert) return res.error("ไม่พบรายการ");

    return res.success("get image success", advert);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const editAdvertId = async (req, res) => {
  const { id } = req.params;
  const _id = parseInt(id) || -1;
  const { created_at, updated_at, deleted_at, deleteImage, ...obj } = req.body;
  try {
    const advert = await orm(LoanAdvert).findOne({ where: { id: _id } });
    if (!advert) return res.error("ไม่พบรายการที่เลือก");

    advert.title = obj.title;
    advert.description = obj.description ? obj.description : null;

    if (deleteImage === "true") {
      if (advert.images) {
        const oldImagePath = path.join(
          __dirname,
          "../../../uploads",
          advert.images
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      advert.images = null;
    } else if (req.file) {
      if (advert.images) {
        const oldImagePath = path.join(
          __dirname,
          "../../../uploads",
          advert.images
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      const timestamp = Date.now();
      const filename = writeFile(
        `advert-${timestamp}`,
        req.file,
        "uploads/advert"
      );
      const uploadPath = path.join(
        __dirname,
        "../../../uploads/advert",
        filename
      );

      await sharp(req.file.buffer).resize(1080, 1080).toFile(uploadPath);

      advert.images = `advert/${filename}`;
    }
    const save = await orm(LoanAdvert).save(advert);
    await save.createLog(req, "update", "advert", { obj, image: advert.image });

    return res.success("อัพเดทสำเร็จ", advert);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const deleteAdvertId = async (req, res) => {
  const { id } = req.params;

  try {
    const advert = await orm(LoanAdvert).findOne({ where: { id: id } });
    if (!advert) return res.error("Advert not found");

    if (advert.images) {
      const imagePath = path.join(__dirname, "../../../uploads", advert.images);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const save = await orm(LoanAdvert).remove(advert);
    await save.createLog(req, "remove", "advert", advert);

    return res.success("ลบรายการสำเร็จ");
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};
