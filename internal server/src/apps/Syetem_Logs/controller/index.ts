import { Between, Like } from "typeorm";
import { orm } from "../../../data-source";
import { System_Logs } from "../entities";

export const list = async (req, res) => {
    const { search, page, limit ,start,end} = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;
    let whereClause: any = {};
    if (search) {
      whereClause.table = Like(`%${search}%`);
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
    const _total = await orm(System_Logs).count({ where: whereClause});
    const existed = await orm(System_Logs).find({
      where: whereClause,
      order:{id:"DESC"},
      take: perPage,
      skip: offset,
    });
    return res.success("Get Successfully", existed,_total);
};
