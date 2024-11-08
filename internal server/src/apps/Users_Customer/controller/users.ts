import { In, Like } from "typeorm";
import { orm } from "../../../data-source";
import { Menu } from "../../Sidebars/entities/Menu";
import { Users } from "../../Users/entities";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UsersAccessToken } from "../../Users_AccessToken/entities";
import { Permissions } from "../../Permission/entities";
import { Roles } from "../../Roles/entities";
import { uuid } from "uuidv4";
import {
  htmlEmailVerify,
  obfuscateEmail,
  obfuscateTel,
  Random_String,
  send_mail,
} from "../../../Utils";
import { Users_Email } from "../../Users_Emil/entities";

export const current = async (req, res) => {
  const result = { ...req.user, status: true };
  delete result.password;
  delete result.pin;
  delete result.line_id;
  delete result.token;
  delete result.roles;
  delete result.permissions;
  result.mobile = obfuscateTel(result.mobile);
  return res.success("get user", result);
};

export const changePasswords = async (req, res) => {
  const {
    id,
    username,
    mobile,
    password,
    newPassword,
    created_at,
    updated_at,
    deleted_at,
    ...obj
  } = req.body;
  const __existUsers = await orm(Users).findOne({
    where: {
      id: req.user.id,
    },
  });
  if (!__existUsers) return res.error("กรุณาเข้าสู่ระบบ!", []);
  const passwordIsValid = bcrypt.compareSync(password, __existUsers.password);
  if (!passwordIsValid) return res.error("รหัสผ่านไม่ถูกต้อง");
  __existUsers.password = bcrypt.hashSync(newPassword, 8);

  try {
    await __existUsers.createLog(req, "changePassword", "Users", obj);
    const result = await orm(Users).save(__existUsers);
    delete result.password;

    return res.success("เปลี่ยนรหัสผ่านเสร็จสิ้น!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};


export const setPassword = async (req, res) => {
  const {
    id,
    username,
    mobile,
    password,
    created_at,
    updated_at,
    deleted_at,
    ...obj
  } = req.body;
  const __existUsers = await orm(Users).findOne({
    where: {
      id: req.user.id,
    },
  });
  if (!__existUsers) return res.error("กรุณาเข้าสู่ระบบ!", []);
  __existUsers.password = bcrypt.hashSync(password, 8);

  try {
    await __existUsers.createLog(req, "setPassword", "Users", obj);
    const result = await orm(Users).save(__existUsers);
    delete result.password;
    delete result.pin

    return res.success("ตั้งรหัสผ่านเสร็จสิ้น!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const verifyPIN = async (req, res) => {
  const {pin} =req.body;
  if (req.user.pa == "enable") {
    if (req.user.pin != pin) return res.error("รหัส PIN ไม่ถูกต้อง!");
  }
  return res.success();
}

export const setPIN = async (req, res) => {
  const {
    id,
    username,
    mobile,
    pin,
    created_at,
    updated_at,
    deleted_at,
    ...obj
  } = req.body;
  const __existUsers = await orm(Users).findOne({
    where: {
      id: req.user.id,
    },
  });
  if (!__existUsers) return res.error("กรุณาเข้าสู่ระบบ!", []);
  __existUsers.pin = pin;
  __existUsers.pa = "enable";

  try {
    await __existUsers.createLog(req, "setPIN", "Users", obj);
    const result = await orm(Users).save(__existUsers);
    delete result.password;
    delete result.pin

    return res.success("ตั้งรหัสผ่านเสร็จสิ้น!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};


export const register = async (req, res) => {
  const {
    id,
    username,
    mobile,
    password,
    created_at,
    updated_at,
    deleted_at,
    ...obj
  } = req.body;

  const __existUsers = await orm(Users).findOne({
    where: {
      mobile,
    },
  });
  if (__existUsers)
    return res.error("หมายเลขของคุณลงทะเบียนแล้ว!", [
      { field: "mobile", message: "หมายเลขของคุณลงทะเบียนแล้ว" },
    ]);

  const Keys = Object.keys(obj);
  const data = new Users();
  Keys.forEach((key) => {
    data[key] = obj[key];
  });
  data.mobile = mobile;
  data.password = bcrypt.hashSync(password, 8);
  // const token = uuid();
  try {
    await data.createLog(req, "register", "Users", obj);
    const result = await orm(Users).save(data);
    delete result.password;
    delete result.pin
    // await orm(Users_Email).save({
    //   from: process.env.GMAIL_USER,
    //   to: data.email,
    //   user_id: result.id,
    //   token: token,
    // });
    // send_mail(
    //   data.email,
    //   "email verification",
    //   htmlEmailVerify(
    //     `${process.env.USER_DOMAIN}/activated?token=${token}`,
    //     data.username
    //   )
    // );

    return res.success("สมัครสมาชิกสำเร็จ!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const acceptPrivacy = async (req,res) => {
  const {version} = req.body;
  const user = await orm(Users).findOne({ where: { id:req.user.id } });
  if (!user) return res.error("ไม่พบผู้ใช้งานในระบบ");
  user.accept_privacy = version;
  await orm(Users).save(user);
  return res.success("Accept Successfully!", { });
}

export const loginUsers = async (req, res) => {
  const { mobile, password } = req.body;
  const user = await orm(Users).findOne({ where: { mobile } });
  if (!user) return res.error("หมายเลขโทรศัพท์ หรือ รหัสผ่านไม่ถูกต้อง");
  if (!user.password) return res.error("กรุณาเข้าสู่ระบบผ่าน Line");
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid)
    return res.error("หมายเลขโทรศัพท์ หรือ รหัสผ่านไม่ถูกต้อง");

  if (user.status === "banned")
    return res.error(`${user.status}, ${user.ban_reason}`);

  if (user.sv === "unverified")
    return res.custom(900, `กรุณายืนยันหมายเลขโทรศัพท์`, {
      url: `otp/${user.mobile}`,
    });

  const accessToken = jwt.sign({}, process.env.USER_SERECT_KEY, {
    expiresIn: "1d",
  });

  user.accesstoken = accessToken;

  await orm(UsersAccessToken).save({
    token: accessToken,
    userid: user.id,
    last_used_at: new Date(),
    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
  });
  const result = await orm(Users).save(user);
  delete result.password;
  delete result.pin
  return res.success("Login Successfully!", { ...result });
};

export const logout = async (req, res) => {
  const accessToken = jwt.sign(
    { id: req.user.id },
    process.env.USER_SERECT_KEY,
    {
      expiresIn: "1s",
    }
  );
  req.user.accesstoken = accessToken;
  await orm(Users).save(req.user);
  return res.success("logged out successfully");
};
