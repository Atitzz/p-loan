import { uuid } from "uuidv4";
import axios from "axios";
import * as qs from "qs";
import * as jwt from "jsonwebtoken";
import { Users } from "../../Users/entities";
import { orm } from "../../../data-source";
import { UsersAccessToken } from "../../Users_AccessToken/entities";
export const login = async (req, res) => {
  const {mobile} = req.params;
  let state = uuid();
  if(mobile) state = mobile
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
    process.env.LINE_CHANNEL_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.CALLBACK_URI
  )}&state=${state}&scope=profile%20openid%20email`;
  res.redirect(lineLoginUrl);
};

export const LineRevoke = async (req, res) => {
  const existingUser = await orm(Users).findOne({
    where: { id: req.user.id },
  });
  await orm(Users).save({
    ...existingUser,
    line_id: null,
    la: "disable",
  });
  const token = req.headers['authorization']
  const __token = token.split(' ')[1];
  const data = await orm(UsersAccessToken).findOne({
    where: {
      token:__token
    },
  });
  await orm(UsersAccessToken).softDelete(data.id);
  return res.success("ยกเลิกการเชื่อมต่อ Line สำเร็จ!");
}

export const callback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const tokenResponse = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.CALLBACK_URI,
        client_id: process.env.LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    const profileResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = profileResponse.data;
    const existingUser = await orm(Users).findOne({
      where: { line_id: profile.userId },
    });

    if (existingUser) {
      // สร้าง session หรือใช้ตัวแทนในระบบ
      await orm(Users).save({
        ...existingUser,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
      });
      const accessToken = jwt.sign(
        { id: existingUser.id },
        process.env.SERECT_KEY,
        {
          expiresIn: "1d",
        }
      );
   
      await orm(UsersAccessToken).save({
        token: accessToken,
        userid: existingUser.id,
        last_used_at: new Date(),
        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      });
      return res.redirect(`${process.env.REDIRECT_URI}/line/${accessToken}`);
    } else {
     const __user = await orm(Users).save({
        line_id: profile.userId,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
        la: "enable",
      });

      const accessToken = jwt.sign(
        { id: __user.id },
        process.env.SERECT_KEY,
        {
          expiresIn: "1d",
        }
      );
   
      await orm(UsersAccessToken).save({
        token: accessToken,
        userid: __user.id,
        last_used_at: new Date(),
        expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      });
      return res.redirect(`${process.env.REDIRECT_URI}/line/${accessToken}`);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error.response.data);
  }
};

export const LineConnect = async (req, res) => {
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${
    process.env.LINE_CHANNEL_ID
  }&redirect_uri=${encodeURIComponent(process.env.CONNECT_URI)}&state=${
    req.user.id
  }&scope=profile%20openid%20email`;
  res.success("redirect", { url: lineLoginUrl });
};

export const connectCallback = async (req, res) => {
  const { code, state } = req.query;
  try {
    const tokenResponse = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.CONNECT_URI,
        client_id: process.env.LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    const profileResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = profileResponse.data;
    const existingUser = await orm(Users).findOne({
      where: { id: state },
    });
    if (!existingUser) res.error("User not found");
    // const existingLine = await orm(Users).find({
    //   where: { line_id: profile.userId },
    // });
    // if(existingLine) return res.redirect(`${process.env.REDIRECT_URI}/line/existed`);
    await orm(Users).save({
      ...existingUser,
      line_id: profile.userId,
      display_name: profile.displayName,
      picture_url: profile.pictureUrl,
      la: "enable",
    });

    return res.redirect(`${process.env.REDIRECT_URI}/profile/manage`);
  } catch (error) {
    console.log(error);
    return res.redirect(`${process.env.REDIRECT_URI}/profile/manage`);
  }
};
