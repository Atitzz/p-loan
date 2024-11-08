import { io } from "../../..";
import { orm } from "../../../data-source";
import { File_Manager } from "../../FileManager/entities/File_Manager";
import { takeLoan } from "../../Loan/controller/user_loan";
import { Users } from "../../Users/entities";
import { Users_KYC } from "../entities";
import { sendNotificationEmail, kyc_notificate } from "../../Notification/controller"

export const store = async (req, res) => {
  // const { id, imgFront,imgBack,imgBook,...data } = req.body;
  const { id, line_id, username, email, password, permissions, roles, kyc, sv, pa, la, pin, status, accept_privacy, mobile, ...data } = req.body;
  const existingUser = await orm(Users).findOne({
    where: { id: req.user.id },
  });
  const __existed = await orm(Users_KYC).findOne({
    where: { user_id: req.user.id },
  });
  if (!existingUser) return res.error("กรุณาเข้าสู่ระบบอีกครั้ง");
  await orm(Users).save({
    ...existingUser,
    ...data,
    email: email,
    kyc: "pending",
  });
  io.emit('user_kyc_pending', { action: 1 })
  await orm(Users_KYC).save({
    ...data,
    user_id: req.user.id,
    id: __existed?.id,
    email: email,
  });

  if (existingUser.email) {
    try {
      const subject = "การยืนยันตัวตนสำเร็จ";
      const htmlContent = kyc_notificate(existingUser);
      sendNotificationEmail(existingUser.email, subject, htmlContent, req.user.id);
    } catch (error) {
      return res.error("ส่งอีเมลไม่สำเร็จ");
    }
  }
  return res.success("สำเร็จ");
};
