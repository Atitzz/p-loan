import { orm } from "../../../data-source";
import { Users } from "../../Users/entities";
import { Users_Email } from "../entities";

export const emailVerify = async (req, res) => {
    const { token } = req.query;

    const __existUsersEmail = await orm(Users_Email).findOne({
      where: {
        token,
        verify: "false",
      },
    });
    if (!__existUsersEmail)

      return res.status(404).send(`<!-- public/404.html -->
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 Not Found</title>
  </head>
  <body>
      <h1>404 Not Found</h1>
      <p>Email The page you are looking for does not exist.</p>
  </body>
  </html>`);
  const __existUsers = await orm(Users).findOne({
    where: {
      id:__existUsersEmail.user_id,
    },
  });
  if (!__existUsers)
    return res.status(404).send(`<!-- public/404.html -->
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
  </head>
  <body>
    <h1>404 Not Found</h1>
    <p>User The page you are looking for does not exist.</p>
  </body>
  </html>`);
    await orm(Users_Email).save({
      ...__existUsersEmail,
      verify: "true",
    });
    await orm(Users).save({
        ...__existUsers,
        ev:'verified'
      })

    
    return res.redirect(`${process.env.REDIRECT_URI}/`);
  };