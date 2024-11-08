import { In, Like } from "typeorm";
import { AppDataSource, orm } from "../../../data-source";
import { Permissions } from "../../Permission/entities";
import { Roles } from "../../Roles/entities";
import { Users } from "../../Users/entities";

import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { Users_KYC } from "../../KYC/entities";
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
    imgBack,
    imgBook,
    imgFront,
    ...obj
  } = req.body;
  const __existed = await orm(Users).findOne({
    where: {
      mobile: obj.mobile,
    },
  });
  const Keys = Object.keys(obj);
  if (__existed) return res.error("ผู้ใช้งานมีการลงทะเบียนไว้แล้ว!",[{field:"mobile",message:"ผู้ใช้งานมีการลงทะเบียนไว้แล้ว!"}]);
  
  const data = new Users();
  Keys.forEach((key) => {
    data[key] = obj[key];
  });
 
  try {
    await data.createLog(req, "create", "Users",  {...obj,imgBack:'',imgBook:'',imgFront:''});
    const result = await orm(Users).save(data);

    await orm(Users_KYC).save({
      ...obj,
      status:"pending",
      imgBack,
      imgBook,
      imgFront,
      user_id: result.id,
    });
    delete result.password;
    delete result.pin;
    io.emit('users',{action:1})
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
  const data = await orm(Users).findOne({
    where: {
      id: id,
    },
  });
  const Keys = Object.keys(obj);
  if (!data) return res.error("404 not found");
  Keys.forEach((key) => {
    data[key] = obj[key];
  });

  if (String(obj.kyc).toLowerCase() == "unverified") {
    const data = await orm(Users_KYC).findOne({
      where: {
        user_id: id,
      },
    });
    if (data) {
      data.status = "pending";
      await orm(Users_KYC).save(data);
    }
  }
  try {
    await data.createLog(req, "update", "Users", {...data,imgBack:'',imgBook:'',imgFront:''});
    const result = await orm(Users).save(data);
    delete result.password;
    delete result.pin;
    return res.success("Update Successfully!", result);
  } catch (err) {
    return res.error(err.detail || err.routine);
  }
};

export const list = async (req, res) => {
  const { status, ev, sv, kyc } = req.params;
  const { search, page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};
  if (search) whereClause.firstname = Like(`%${search}%`);
  if (status) whereClause.status = String(status).toLowerCase();
  if (ev) whereClause.ev = String(ev).toLowerCase();
  if (sv) whereClause.sv = String(sv).toLowerCase();
  if (kyc) whereClause.kyc = String(kyc).toLowerCase();
  const _total = await orm(Users).count({ where: whereClause });
  const existed = await orm(Users).find({
    where: whereClause,
    order: { id: "DESC" },
    take: perPage,
    skip: offset,
  });
  return res.success(
    "Get Successfully",
    existed.map(({ password, accesstoken, permissions, ...user }) => user),
    _total
  );
};


export const show = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return list(req, res);
  }
  const result = await orm(Users).findOne({where: { id: id}});
  if(!result) return res.error('ไม่พบลูกค้าดังกล่าว!');
 
  delete result.password;
  delete result.pin;
  return res.success("Get Successfully", result);
};


// export const show = async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return list(req, res);
//   }
//   const query = `
// WITH user_transactions AS (
//     SELECT
//         user_id,
//         SUM(balance) AS total_balance,
//         SUM(deposits) AS total_deposits,
//         SUM(withdrawals) AS total_withdrawals,
//         COUNT(id) AS transactions_count
//     FROM
//         users_transactions
//     WHERE
//         user_id = ?
//     GROUP BY
//         user_id
// )

// SELECT
//     u.*,
//     COALESCE(ut.total_balance, 0) AS balance,
//     COALESCE(ut.total_deposits, 0) AS deposits,
//     COALESCE(ut.total_withdrawals, 0) AS withdrawals,
//     COALESCE(ut.transactions_count, 0) AS transactions,
//     SUM(CASE WHEN LOWER(lp.status) = 'pending' THEN 1 ELSE 0 END) AS loan_pending,
//     SUM(CASE WHEN LOWER(lp.status) = 'running' THEN 1 ELSE 0 END) AS loan_running,
//     SUM(CASE WHEN LOWER(lp.status) = 'due' THEN 1 ELSE 0 END) AS loan_due,
//     SUM(CASE WHEN LOWER(lp.status) = 'pain' THEN 1 ELSE 0 END) AS loan_pain,
//     SUM(CASE WHEN LOWER(lp.status) = 'reject' THEN 1 ELSE 0 END) AS loan_reject
// FROM
//     system_users u
// LEFT JOIN
//     loan lp ON lp.user_id = u.id
// LEFT JOIN
//     user_transactions ut ON ut.user_id = u.id
// WHERE
//     u.id = ?
//     `;
//   const result = await AppDataSource.manager.query(query, [id, id]);
//   const __data = result[0];
//   delete __data.password;
//   delete __data.pin;
//   return res.success("Get Successfully", __data);
// };
