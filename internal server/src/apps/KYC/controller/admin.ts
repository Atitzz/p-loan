import { Like } from "typeorm";
import { AppDataSource, orm } from "../../../data-source";
import { Users_KYC } from "../entities";
import { Users } from "../../Users/entities";
import { Line_KYC_Apply } from "../../Line_Message/module";
import { formatDate, toDate } from "../../../Utils";
import { sendNotificationEmail, ApproveRejectKYC_notificate } from "../../Notification/controller"


export const update = async (req, res) => {
  const {pid} = req.params;
  const { id,line_id,username,email,password,permissions,roles,...obj } = req.body;
  const data = await orm(Users_KYC).findOne({
    where: {
      user_id: pid,
    },
  });
  const Keys = Object.keys(obj);
  if (!data) return res.error("404 not found");
  Keys.forEach((key) => {
    data[key] = obj[key];
  });
  try {
    const result = await orm(Users_KYC).save(data);
    await data.createLog(req, "update", "Users_KYC", {...result,imgBack:'',imgBook:'',imgFront:''});
    return res.success("Update Successfully!", result);
  } catch (err) {
    console.log(err)
    return res.error(err.detail || err.routine);
  }
};

  
  export const Approve = async (req, res) => {
    const {id} = req.params;
    const {
      created_at,
      updated_at,
      deleted_at,
      ...obj
    } = req.body;
    const data = await orm(Users_KYC).findOne({
      where: {
        user_id: id,
      },
    });
    if (!data) return res.error("404 not found");
    
    data.status = "approve"

    const __user = await orm(Users).findOne({
        where:{
            id:id
        }
    })
    if (!__user) return res.error("404 not found");
    __user.kyc = "verified";
    Line_KYC_Apply(__user.line_id,`${__user.firstname} ${__user.lastname}`,toDate(new Date().toISOString(),1),"1","")
    try {
     
      await data.createLog(req, "approve", "Users KYC", {});
      await orm(Users).save(__user);
      const result = await orm(Users_KYC).save(data);

      if (__user.email) {
        const subject = "การยืนยันตัวตนของคุณได้รับการอนุมัติ";
        const htmlContent = ApproveRejectKYC_notificate(__user, subject, toDate(new Date().toISOString(),1));
        sendNotificationEmail(__user.email, subject, htmlContent, __user.id);
      }

      return res.success("Approve Successfully!", result);
    } catch (err) {
      return res.error(err.detail || err.routine);
    }
  };

  export const Reject = async (req, res) => {
    const {id} = req.params;
    const {
      created_at,
      updated_at,
      deleted_at,
      reject_reason,
      ...obj
    } = req.body;
    const data = await orm(Users_KYC).findOne({
        where: {
          user_id: id,
        },
      });
      if (!data) return res.error("404 not found");
      console.log(data)
    data.status = "reject"
    data.reject_reason = reject_reason
    const __user = await orm(Users).findOne({
        where:{
            id:id
        }
    })
    if (!__user) return res.error("404 not found");
    __user.kyc = "unverified";
    Line_KYC_Apply(__user.line_id,`${__user.firstname} ${__user.lastname}`,toDate(new Date().toISOString(),1),"0",reject_reason)
    try {
      await data.createLog(req, "reject", "Users KYC", {reject_reason});
      await orm(Users).save(__user);
      const result = await orm(Users_KYC).save(data);

      if (__user.email) {
        const subject = "การยืนยันตัวตนของคุณถูกปฏิเสธ";
        const htmlContent = ApproveRejectKYC_notificate(__user, subject, toDate(new Date().toISOString(),1), reject_reason);
        sendNotificationEmail(__user.email, subject, htmlContent, __user.id);
      }

      return res.success("Reject Successfully!", result);
    } catch (err) {
        console.log(err)
      return res.error(err.detail || err.routine);
    }
  };
  
  export const list = async (req, res) => {
    const { status } = req.params;
    const { search, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;
    let whereClause: any = {};
    if (search) whereClause.name = Like(`%${search}%`);
    if (status) whereClause.status = String(status).toLowerCase();
    const _total = await orm(Users_KYC).count({ where: whereClause });
    const existed = await orm(Users_KYC).find({
        select:[
            "id",
            "user_id",
            "titlename",
            "firstname",
            "lastname",
            "birthdate",
            "citizen_id",
            "back_id",
            "job",
            "salary",
            "book",
            "bank",
            "status",
            "reject_reason",
            "address",
            "subdistrict",
            "district",
            "province",
            "zipcode",
            "country",
        ],
      where: whereClause,
      order:{id:'DESC'},
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
    if(!id) {
      return list(req,res)
    }
    const __data = await orm(Users_KYC).findOne({
      where: {user_id:id},
    });
    return res.success(
      "Get Successfully",
      __data
    );
  };
  
  export const remove = async (req, res) => {
    const { id } = req.query;
    if(!id) return res.error("404 not found");
    const data = await orm(Users_KYC).findOne({
      where: {
        id,
      },
    });
    if (!data) return res.error("404 not found");
    await data.createLog(req, "remove", "Users", data);
    await orm(Users_KYC).delete(id);
    return res.success("Deleted Successfully!", data);
  };
  