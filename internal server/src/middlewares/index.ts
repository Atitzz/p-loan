import * as jwt from "jsonwebtoken";
import { AppDataSource, orm } from "../data-source";
import { Users } from "../apps/Users/entities";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";

export async function AccessToken(req, res, next) {
  try {
    let token = req.headers["authorization"];
    if (token) {
      const __token = token.split(" ")[1];
      const decoded = jwt.verify(__token, process.env.SERECT_KEY);
      if (decoded) {
        const query = `
              SELECT
                  u.*,
                  uat.token,
                  uat.expires_at,
                  JSON_ARRAYAGG(
                      JSON_OBJECT('key', r.key, 'name', r.name)
                  ) AS roles,
                      JSON_OBJECT(
                          'key',
                          p.key,
                          'name',
                          p.name,
                          'approve',
                          p.approve,
                          'reject',
                          p.reject,
                          'show',
                          p.show,
                          'list',
                          p.list,
                          'store',
                          p.store,
                          'update',
                          p.update,
                          'remove',
                          p.remove,
                           'manage_users',
                          p.manage_users
                  ) AS permissions
              FROM
                  (
                  SELECT
                      *
                  FROM
                      users_access_token
                  WHERE
                      token = ? AND deleted_at IS NULL
              ) uat
              LEFT JOIN system_users u ON
                  u.id = uat.userid
              LEFT JOIN system_roles_users_system_users mr ON
                  mr.systemUsersId = uat.userid
              LEFT JOIN system_roles r ON
                  r.id = mr.systemRolesId
              LEFT JOIN system_permissions p ON
                  p.id = u.permissionsId
              GROUP BY
                  u.id,
                  uat.token,
                  uat.expires_at;
      `;
        const params = [__token];
        const users = await AppDataSource.query(query, params);
        if (users.length < 1) return res.error("กรุณาเข้าสู่ระบบ!");

        if (users[0].expires_at > Date.now()) {
          req.user = users[0];
          return next();
        } else return res.error("โทเค็นหมดอายุ!");
      }
      return res.error("การเข้าสู่ระบบผิดพลาด!");
    }
    return res.error("โทเค็นไม่ถูกต้อง!");
  } catch (err) {
    console.log(err);
    if (err?.expiredAt) return res.error("โทเค็นหมดอายุ!");
    else return res.error("การเข้าสู่ระบบผิดพลาด!");
  }
}

export async function AccessUsers(req, res, next) {
  try {
    let token = req.headers["authorization"];
    if (token) {
      const __token = token.split(" ")[1];
      const decoded = jwt.verify(__token, process.env.USER_SERECT_KEY);
      if (decoded) {
        const query = `
               SELECT
                  u.*,
                  uat.token,
                  uat.expires_at,
                  JSON_ARRAYAGG(
                      JSON_OBJECT('key', r.key, 'name', r.name)
                  ) AS roles,
                      JSON_OBJECT(
                          'key',
                          p.key,
                          'name',
                          p.name,
                          'approve',
                          p.approve,
                          'reject',
                          p.reject,
                          'show',
                          p.show,
                          'list',
                          p.list,
                          'store',
                          p.store,
                          'update',
                          p.update,
                          'remove',
                          p.remove,
                           'manage_users',
                          p.manage_users
                  ) AS permissions
              FROM
                  (
                  SELECT
                      *
                  FROM
                      users_access_token
                  WHERE
                      token = ? AND deleted_at IS NULL
              ) uat
              LEFT JOIN system_users u ON
                  u.id = uat.userid
              LEFT JOIN system_roles_users_system_users mr ON
                  mr.systemUsersId = uat.userid
              LEFT JOIN system_roles r ON
                  r.id = mr.systemRolesId
              LEFT JOIN system_permissions p ON
                  p.id = u.permissionsId
              GROUP BY
                  u.id,
                  uat.token,
                  uat.expires_at;
      `;
        const params = [__token];
        const users = await AppDataSource.query(query, params);
        if (users.length < 1) return res.error("กรุณาเข้าสู่ระบบ!");
        if (users[0].expires_at > Date.now()) {
          req.user = users[0];
          if (req.user.id === null) return res.error("ไม่พบโทเค็น!");
          return next();
        } else return res.error("โทเค็นหมดอายุ!");
      }
      return res.error("การเข้าสู่ระบบผิดพลาด!");
    }
    return res.error("ไม่พบโทเค็น!");
  } catch (err) {
    console.log(err);
    if (err?.expiredAt) return res.error("โทเค็นหมดอายุ!");
    else return res.error("การเข้าสู่ระบบผิดพลาด!");
  }
}

export const usePIN = (req, res, next) => {
  const user = req.user;
  let pin = req.headers["x-sign-pin"];
  if (user.pa == "enable") {
    if (user.pin != pin) return res.error("รหัส PIN ไม่ถูกต้อง!");
  }
  next();
};
export const isAdmin = (keys) => (req, res, next) => {
  if (!Array.isArray(keys)) return res.error("roles request array!");
  if (!req.user?.roles) return res.error("username invalid!");
  let isRole = false;
  for (const key of keys)
    if (
      req.user.roles.find(
        (x) => String(x.key).toLowerCase() === String(key).toLowerCase()
      )
    ) {
      isRole = true;
    }
    if(isRole)  return next();
  return res.error("roles deny!");
};

export const isList = (req, res, next) => {
  if (req.user.permissions.list !== "true")
    return res.error("permission list deny!");
  return next();
};

export const isManageUsers = (req, res, next) => {
  if (req.user.permissions.manage_users !== "true")
    return res.error("permission manage users deny!");
  return next();
};

export const isStore = (req, res, next) => {
  if (req.user.permissions.store !== "true")
    return res.error("permission store deny!");
  return next();
};

export const isUpdate = (req, res, next) => {
  if (req.user.permissions.update !== "true")
    return res.error("permission update deny!");
  return next();
};

export const isRemove = (req, res, next) => {
  if (req.user.permissions.remove !== "true")
    return res.error("permission remove deny!");
  return next();
};

export const isApprove = (req, res, next) => {
  if (req.user.permissions.approve !== "true")
    return res.error("permission approve deny!");
  return next();
};

export const isReject = (req, res, next) => {
  if (req.user.permissions.reject !== "true")
    return res.error("permission reject deny!");
  return next();
};

export const isShow = (req, res, next) => {
  if (req.user.permissions.show !== "true")
    return res.error("permission show deny!");
  return next();
};

export const isSuperAdmin = (req, res, next) => {
  if (
    req.user.roles.find((x) => String(x.key).toLowerCase() === "superadmin")
  ) {
    return next();
  }
  return res.error("roles deny!");
};
export function errorHandle(err, req, res, next) {
  console.log(err);

  return res.catch("Internal Server Error");
}

export function warper(fn) {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export const Success = (req, res, next) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = parseInt(page) || 0;
  res.success = (msg: string, data: object | object[], total?: number) => {
    return res.json({
      system_response: {
        status: 200,
        message: msg || "Success",
        data_type: !Array.isArray(data) ? "object" : "array",
      },
      data: data || {},
      pages: {
        page: offset,
        total: total || 1,
        limit: perPage,
      },
    });
  };
  return next();
};

export const Custom = (req, res, next) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = parseInt(page) || 0;
  res.custom = (
    status,
    msg: string,
    data: object | object[],
    total?: number
  ) => {
    return res.status(400).json({
      system_response: {
        status: status,
        message: msg || "Custom",
        data_type: !Array.isArray(data) ? "object" : "array",
      },
      data: data || {},
      pages: {
        page: offset,
        total: total || 1,
        limit: perPage,
      },
    });
  };
  return next();
};

export const Error = (req, res, next) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 1;
  const offset = parseInt(page) || 0;
  res.error = (msg: string, data: object | object[] = [], total?: number) => {
    return res.status(400).json({
      system_response: {
        status: 400,
        message: msg || "Invalid",
        data_type: !Array.isArray(data) ? "object" : "array",
      },
      data: data || [],
      pages: {
        page: offset,
        total: total || 0,
        limit: perPage,
      },
    });
  };
  return next();
};

export const Catch = (req, res, next) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 1;
  const offset = parseInt(page) || 0;
  res.catch = (msg: string, data: object | object[], total?: number) => {
    return res.status(400).json({
      system_response: {
        status: 500,
        message: msg || "Internal Server Error",
        data_type: !Array.isArray(data) ? "object" : "array",
      },
      data: data || {},
      pages: {
        page: offset,
        total: total || 0,
        limit: perPage,
      },
    });
  };
  return next();
};

export const class_checker = (className: any) => {
  return async (req, res, next) => {
    try {
      const instance = plainToClass(className, req.body);
      const errors = await validate(instance);

      if (errors.length > 0) {
        const customErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints).join(", "),
        }));
        return res.error("Data validation failed", customErrors);
      }

      next(); // หลังจากตรวจสอบผ่าน validation ให้เรียกฟังก์ชันถัดไป
    } catch (error) {
      console.error("Error in class_checker middleware:", error);
      return res.catch("Internal Server Error");
    }
  };
};
