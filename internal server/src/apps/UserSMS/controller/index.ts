import axios from "axios";
import { orm } from "../../../data-source";
import { Users } from "../../Users/entities";
import { uuid } from "uuidv4";
import { Users_SMS } from "../entities";
import { obfuscateTel, Random_String } from "../../../Utils";
import { UsersAccessToken } from "../../Users_AccessToken/entities";
// export const requestOTP = async (req,res) =>{
//   const {mobile} = req.params;
//   const __existUser = await orm(Users).findOne({where:{mobile:mobile}});
//   if(!__existUser) return res.error('หมายเลขโทรศัพท์ไม่ถูกต้อง');
//   if(__existUser.la === 'enable') return res.error('หมายเลขโทรศัพท์นี้ลงทะเบียนแล้ว');
//   return res.success('โปรดระบุรหัส OTP ที่ได้รับ',{token:'xxx'})
// }

export const verifyOTP = async (req,res) =>{
  const {id,mobile,otp_code} = req.body;
  const __existUsers = await orm(Users).findOne({where:{id}});
  if(!__existUsers) return res.error('ไม่พบข้อมูลผู้ใช้งาน');
  const __existSMS = await orm(Users_SMS).findOne({where:{mobile:mobile}});
  if(!__existSMS) return res.error('กรุณาขอรหัส OTP ก่อนทำรายการ');
  try{
    const response = await axios.post(
      `${process.env.SMS_ENDPOINT}/otp-sms/verify`,
      {
       token:__existSMS.token,
       otp_code:otp_code
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${process.env.SMS_KEY}`
        },
      }
    );
    if(!response.data.data.is_valid) return res.error(response.data.data.message);
    const __existRegisted = await orm(Users).findOne({where:{mobile}});
    if(__existRegisted)
    {
      await orm(Users).save({
        ...__existRegisted,
        line_id:__existUsers.line_id,
        display_name:__existUsers.display_name,
        picture_url:__existUsers.picture_url,
        mobile,
        username:__existUsers.username == null ? mobile : __existUsers.username ,
        sv:'verified'
    });
    let token = req.headers['authorization'];
    if (token) {
      const __token = token.split(' ')[1];
      const __existToken = await orm(UsersAccessToken).findOne({where:{token:__token}});
      await orm(UsersAccessToken).save({
        ...__existToken,
       userid:__existRegisted.id,
      });
    }
    if(__existUsers.id !== __existRegisted.id)
    await orm(Users).delete(id);
    }else{
      await orm(Users).save({
        ...__existUsers,
        mobile,
        username:__existUsers.username == null ? mobile : __existUsers.username ,
        sv:'verified'
    });
    }
 
  const result = {...req.user,status:true};
  delete result.password;
  delete result.pin;
  delete result.line_id;
  delete result.token;
  delete result.roles;
  delete result.permissions;
  result.mobile = obfuscateTel(mobile);
    res.success("ขอบคุณที่ทำรายการ",result);
  }catch(err){
    console.log(err);
    return res.error("การทำรายการไม่สำเร็จ");
  }
}

export const getOTP = async (req,res) =>{
  try {
    const {mobile} = req.params;
   const data = await orm(Users_SMS).findOne({where:{mobile:mobile}});
    return res.success("Successfully",data);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
}

export const resendOTP = async (req,res) =>{
  try {
    const {mobile} = req.body;
    const __random = Random_String(6);
    if(!mobile) return res.error("กรุณากรอกหมายเลขโทรศัพท์")
    const response = await axios.post(
      `${process.env.SMS_ENDPOINT}/otp-sms/send`,
      {
        recipient: mobile,
        sender_name: process.env.SMS_SENDER,
        ref_code:__random,
        custom_message:`OTP: {otp} (Ref:{refcode}) กรุณาทำการยืนยันภายในเวลา {validity} นาที ห้ามแจ้งรหัสกับบุคคลอื่นทุกกรณี`
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
           `Bearer ${process.env.SMS_KEY}`
        },
      }
    );
    let __existSMS = await orm(Users_SMS).findOne({where:{mobile:mobile}});
    if(__existSMS)
    {
      __existSMS = await orm(Users_SMS).save({
        ...__existSMS,
        ref_code: __random,
        token:response.data.data.token
      })
    }else
    __existSMS = await orm(Users_SMS).save({
      mobile:mobile,
      ref_code: __random,
      token:response.data.data.token
    })
    return res.success("Successfully",__existSMS);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
}
