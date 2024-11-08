import { Between, Like } from "typeorm";
import { orm } from "../../../data-source";
import { LoanContractNonUser } from "../entities/loan_contract";
import { io } from "../../..";

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
    const Keys = Object.keys(obj);
    const data = new LoanContractNonUser();
    Keys.forEach((key) => {
      data[key] = obj[key];
    });
   
    try {
      io.emit('loan_apply_now',{action:1})
      const result = await orm(LoanContractNonUser).save(data);
      return res.success("Create Successfully!", result);
    } catch (err) {
      console.log(err);
      return res.error(err.detail || err.routine);
    }
  };
  
  export const update = async (req, res) => {
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
    const data = await orm(LoanContractNonUser).findOne({where:{id:id}})
    if(!data) return res.error('ไม่พบรายการนี้!')
    data.is_read = 1;
    try {
      const result = await orm(LoanContractNonUser).save(data);
      return res.success("Update Successfully!", result);
    } catch (err) {
      console.log(err);
      return res.error(err.detail || err.routine);
    }
  };

  export const list = async (req, res) => {
    const { search, page, limit ,start,end} = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;
    let whereClause: any = {is_read:'0'};
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
    const _total = await orm(LoanContractNonUser).count({ where: whereClause});
    const existed = await orm(LoanContractNonUser).find({
      where: whereClause,
      take: perPage,
      skip: offset,
      order:{created_at:'DESC'}
    });
    return res.success("Get Successfully", existed,_total);
  };