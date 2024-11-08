import { In, IsNull, Like, Not } from "typeorm";
import { AppDataSource, orm } from "../../../data-source";
import { Menu } from "../../Sidebars/entities/Menu";
import { Users } from "../entities";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UsersAccessToken } from "../../Users_AccessToken/entities";
import { Permissions } from "../../Permission/entities";
import { Roles } from "../../Roles/entities";
import { Route } from "../../Sidebars/entities/Route";

export async function current(req, res) {
  const __user = await orm(Users).findOne({
    where: { id: req.user.id },
  });
  if (!__user) return res.error("unauth", { status: false });
  let isRole = false;
  for (const key of ['admin','employee'])
    if (
      __user.roles.find(
        (x) => String(x.key).toLowerCase() === String(key).toLowerCase()
      )
    ) {
      isRole = true;
    }
    if(!isRole)  return res.error("roles deny!");

    if (!__user.permissions)
      return res.error("permissions deny!", { status: false });
  const __menus = await orm(Menu)
    .createQueryBuilder("menu")
    .leftJoinAndSelect("menu.route", "route")
    .leftJoinAndSelect("menu.permissions", "permissions")
    .where("permissions.id = :permissionsId", {
      permissionsId: __user.permissions.id,
    })
    .orderBy("menu.index", "ASC")
    .addOrderBy("route.index", "ASC")
    .getMany();

  const __route = await orm(Route).find({
    where: {
      type: "route",
    },
  });

  delete __user.password;
  delete __user.accesstoken;
  delete __user.pin;
  __user.status = true;
  return res.success("Successfully!", {
    ...__user,
    sidebars: __menus,
    route: __route,
  });
}

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const user = await orm(Users).findOne({ where: { username } });
  if (!user) return res.error("username invalid!");
 
  let isRole = false;
  for (const key of ['admin','employee'])
    if (
      user.roles.find(
        (x) => String(x.key).toLowerCase() === String(key).toLowerCase()
      )
    ) {
      isRole = true;
    }
    if(!isRole)  return res.error("roles deny!");

    if (!user.permissions)
      return res.error("permissions deny!", { status: false });
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) return res.error("password invalid!");
  if (user.status === "banned")
    return res.error(`${user.status}, ${user.ban_reason}`);
  const accessToken = jwt.sign({}, process.env.SERECT_KEY, {
    expiresIn: "1d",
  });

  const __menus = await orm(Menu)
    .createQueryBuilder("menu")
    .leftJoinAndSelect("menu.route", "route")
    .leftJoinAndSelect("menu.permissions", "permissions")
    .where("permissions.id = :permissionsId", {
      permissionsId: user.permissions.id,
    })
    .orderBy("menu.index", "ASC")
    .addOrderBy("route.index", "ASC")
    .getMany();

  user.accesstoken = accessToken;
  const __route = await orm(Route).find({
    where: {
      type: "route",
    },
  });
  await orm(UsersAccessToken).save({
    token: accessToken,
    userid: user.id,
    last_used_at: new Date(),
    expires_at: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
  });
  const result = await orm(Users).save(user);
  delete result.password;
  delete result.pin;

  return res.success("Login Successfully!", {
    ...result,
    sidebars: __menus,
    route: __route,
  });
};

export const logout = async (req, res) => {
  const data = await orm(UsersAccessToken).findOne({
    where: {
      token: req.user.token,
    },
  });
  if (!data) return res.error("404 not found");
  await orm(UsersAccessToken).softDelete(data.id);
  return res.success("logged out successfully!", data);
};

export const addRoles = async (req, res) => {
  const {
    id,
    permission,
    roles,
    created_at,
    updated_at,
    deleted_at,
    ...obj
  } = req.body;

  const __existUsers = await orm(Users).findOne({
    where: {
      id:id,
    },
  });
  if (!__existUsers) return res.error("user not found");

  const __existPermissions = await orm(Permissions).findOne({
    where: { id: permission },
  });
  __existUsers.permissions = __existPermissions as Permissions;
  if(!permission)  __existUsers.permissions = null;
  
  if (!Array.isArray(roles)) return res.error("roles request array!");

  const __existRoles = await orm(Roles).find({ where: { key: In(roles) } });

  __existUsers.roles = __existRoles as Roles[];
  try {
    await __existUsers.createLog(req, "add Role & permissions", "Users", {permission,roles:roles});
    const result = await orm(Users).save(__existUsers);

    delete result.password;
    delete result.pin;
    return res.success("Update Successfully!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
}
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
  const __existUsers = await orm(Users).findOne({
    where: {
      username,
    },
  });
  if (__existUsers) return res.error("dupplicated username");

  const __existPermissions = await orm(Permissions).findOne({
    where: { id: permission },
  });
  if (!__existPermissions) return res.error("permission not found");

  if (!Array.isArray(roles)) return res.error("roles request array!");

  const __existRoles = await orm(Roles).find({ where: { id: In(roles) } });
  if (!__existRoles) return res.error("permission not found");

  const Keys = Object.keys(obj);
  const data = new Users();
  Keys.forEach((key) => {
    data[key] = obj[key];
  });
  data.username = username;
  data.password = bcrypt.hashSync(password, 8);
  data.permissions = __existPermissions as Permissions;
  data.roles = __existRoles as Roles[];
  try {
    await data.createLog(req, "store", "Users", obj);
    const result = await orm(Users).save(data);

    delete result.password;
    delete result.pin;
    return res.success("Created Successfully!", result);
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
  if (data) return res.error("404 not found");
  Keys.forEach((key) => {
    if (data[key]) data[key] = obj[key];
  });
  if (password) data.password = bcrypt.hashSync(password, 8);
  if (permission) {
    const __existPermissions = await orm(Permissions).findOne({
      where: { id: permission },
    });
    if (!__existPermissions) return res.error("permission not found");
    data.permissions = __existPermissions as Permissions;
  }

  if (roles) {
    if (!Array.isArray(roles)) return res.error("roles request array!");

    const __existRoles = await orm(Roles).find({ where: { id: In(roles) } });
    if (!__existRoles) return res.error("permission not found");
    data.roles = __existRoles as Roles[];
  }
  try {
    await data.createLog(req, "update", "Users", obj);
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
  console.log(req.user);
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};
  if (search) whereClause.firstname = Like(`%${search}%`);
  const queryBuilder = orm(Users)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.roles", "roles")
    .leftJoinAndSelect("user.permissions", "permissions") 
    .where(whereClause)
    .andWhere("roles.id IS NOT NULL");
  const _total = await queryBuilder.getCount();
  const existed = await queryBuilder
    .orderBy("user.id", "DESC")
    .take(perPage)
    .skip(offset)
    .getMany();

  return res.success(
    "Get Successfully",
    existed.map(({ password, accesstoken, ...user }) => user),
    _total
  );
};

export const show = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return list(req, res);
  }
  const query = `
        SELECT
            u.*,
            SUM(
                CASE WHEN LOWER(lp.status) = 'pending' THEN 1 ELSE 0
            END
        ) AS loan_pending,
        SUM(
            CASE WHEN LOWER(lp.status) = 'running' THEN 1 ELSE 0
        END
        ) AS loan_running,
        SUM(
            CASE WHEN LOWER(lp.status) = 'due' THEN 1 ELSE 0
        END
        ) AS loan_due,
        SUM(
            CASE WHEN LOWER(lp.status) = 'pain' THEN 1 ELSE 0
        END
        ) AS loan_pain,
        SUM(
            CASE WHEN LOWER(lp.status) = 'reject' THEN 1 ELSE 0
        END
        ) AS loan_reject
        FROM
            (
            SELECT
                *
            FROM
                system_users
            WHERE
                id = ?
        ) u
        LEFT JOIN loan lp ON lp.user_id = u.id;
  `;
  const result = await AppDataSource.manager.query(query, [id, id]);
  const __data = result[0];
  delete __data.password;
  delete __data.pin;
  return res.success("Get Successfully", __data);
};

export const remove = async (req, res) => {
  const { id } = req.query;
  if(!id) return res.error("404 not found");
  const data = await orm(Users).findOne({
    where: {
      id,
    },
  });
  if (!data) return res.error("404 not found");
  await data.createLog(req, "remove", "Users", data);
  await orm(Users).delete(id);
  return res.success("Deleted Successfully!", data);
};
