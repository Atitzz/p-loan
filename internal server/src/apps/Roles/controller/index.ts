import { Like } from "typeorm";
import { orm } from "../../../data-source";
import { Roles } from "../entities";

export const store = async (req, res) => {
  const { id, roles, created_at, updated_at, deleted_at, ...obj } = req.body;
  const Keys = Object.keys(obj);
  const data = new Roles();
  Keys.forEach((key) => {
    data[key] = obj[key];
  });
  try {
    await data.createLog(req, "store", "Roles", obj);
    const result = await orm(Roles).save(data);
    return res.success("Created Successfully!", result);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

export const update = async (req, res) => {
  const { pid } = req.params;
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const data = await orm(Roles).findOne({
    where: {
      id: pid,
    },
  });
  const Keys = Object.keys(obj);
  if (!data) return res.error("404 not found");
  Keys.forEach((key) => {
    if (data[key]) data[key] = obj[key];
  });
  try {
    await data.createLog(req, "update", "Roles", obj);
    const result = await orm(Roles).save(data);
    return res.success("Update Successfully!", result);
  } catch (err) {
    return res.error(err.detail || err.routine);
  }
};

export const list = async (req, res) => {
  const { search, page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};
  if (search) {
    whereClause.name = Like(`%${search}%`);
  }
  const _total = await orm(Roles).count({ where: whereClause });
  const existed = await orm(Roles).find({
    where: whereClause,
    take: perPage,
    skip: offset,
  });
  return res.success("Get Successfully", existed, _total);
};

export const show = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.error("404 not found");
  const data = await orm(Roles).findOne({
    where: { id: id },
  });
  if (!data) return res.error("404 not found");
  return res.success("Successfully!", data);
};

export const remove = async (req, res) => {
  const { id } = req.query;
  if (!id) return res.error("404 not found");
  const data = await orm(Roles).findOne({
    where: {
      id,
    },
  });
  if (!data) return res.error("404 not found");
  await data.createLog(req, "remove", "Roles", data);
  await orm(Roles).delete(id);
  return res.success("Deleted Successfully!", data);
};
