import { Between, Like } from "typeorm";
import { orm } from "../../../data-source";
import { io } from "../../..";
import { Policy } from "../entities/Policy";

export const store = async (req, res) => {
  const {
    id,
    username,
    password,
    permission,
    roles,
    created_at,
    updated_at,
    deleted_at,
    ...obj
  } = req.body;
  const existed = await orm(Policy).findOne({ where: { version: obj.version } });
  if(existed) return res.error("เวอร์ชั่นนโยบายซ้ำในระบบ")
  const Keys = Object.keys(obj);
  const data = new Policy();
  Keys.forEach((key) => {
    data[key] = obj[key];
  });

  try {
    const result = await orm(Policy).save(data);
    await data.createLog(req, "create", "Policy", { result });
    return res.success("Create Successfully!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const update = async (req, res) => {
    const { pid } = req.params;
  const {
    id,
    username,
    password,
    permission,
    roles,
    created_at,
    updated_at,
    deleted_at,
    ...obj
  } = req.body;
  const data = await orm(Policy).findOne({ where: { id: pid } });
  if (!data) return res.error("ไม่พบรายการนี้!");
  data.version = obj.version;
  data.message = obj.message;
  try {
    const result = await orm(Policy).save(data);
    await data.createLog(req, "update", "Policy", { result });
    return res.success("Update Successfully!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const list = async (req, res) => {
  const { search, page, limit, start, end } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};
  if (search) {
    whereClause.name = Like(`%${search}%`);
  }

  if (start && end) {
    // แปลงวันที่จาก query string ให้เป็น Date object
    const startDate = new Date(start);
    const endDate = new Date(end);

    // ตรวจสอบว่าทั้ง startDate และ endDate เป็น valid dates
    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      // เพิ่มเวลาให้ endDate ครบถ้วนจนถึงสิ้นวัน
      endDate.setHours(23, 59, 59, 999);

      // กำหนดเงื่อนไขการค้นหาผ่าน created_at
      whereClause.created_at = Between(startDate, endDate);
    }
  }
  const _total = await orm(Policy).count({ where: whereClause });
  const existed = await orm(Policy).find({
    where: whereClause,
    take: perPage,
    skip: offset,
    order: {
      updated_at: "DESC",
    },
  });
  return res.success("Get Successfully", existed, _total);
};

export const show = async (req, res) => {
    const { id } = req.params;
    if (!id) return res.error("404 not found");
  const data = await orm(Policy).findOne({
    where: {id:id},
  });
  if (!data) return res.error("404 not found");
  return res.success("Successfully!", data);
};

export const fetch = async (req, res) => {
    const data = await orm(Policy).findOne({
      where: {},
      order: { updated_at: "DESC" },
    });
    if (!data) return  res.success("Successfully!", {version:'0.0',message:''});
    return res.success("Successfully!", data);
  };

export const remove = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.error("404 not found");
  const data = await orm(Policy).findOne({
    where: {
      id,
    },
  });
  if (!data) return res.error("404 not found");
  await data.createLog(req, "remove", "Policy", data);
  await orm(Policy).delete(id);
  return res.success("Deleted Successfully!", data);
};
