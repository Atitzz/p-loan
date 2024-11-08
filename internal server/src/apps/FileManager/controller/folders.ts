import { Like } from "typeorm";
import { orm } from "../../../data-source";
import { Folder_Manager } from "../entities/Folder_Manager";

export const store = async (req, res) => {
  const { id,roles, created_at, updated_at, deleted_at, ...obj } = req.body;
  const Keys = Object.keys(obj);
  const data = new Folder_Manager();
  Keys.forEach((key) => {
    data[key] = obj[key];
  });
  try {
    await data.createLog(req, "store","Roles", obj);
    const result = await orm(Folder_Manager).save(data);
    return res.success("Created Successfully!", result);
  } catch (err) {
    console.log(err)
    return res.error(err.detail || err.routine);
  }
};

export const update = async (req, res) => {
  const { id, key,created_at, updated_at, deleted_at, ...obj } = req.body;
  const data = await orm(Folder_Manager).findOne({
    where: {
      id: id,
    },
  });
  const Keys = Object.keys(obj);
  if (data) return res.error("404 not found");
  Keys.forEach((key) => {
    if (data[key]) data[key] = obj[key];
  });
  try {
    await data.createLog(req, "update","Roles", obj);
    const result = await orm(Folder_Manager).save(data);
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
    const _total = await orm(Folder_Manager).count({ where: whereClause});
    const existed = await orm(Folder_Manager).find({
      where: whereClause,
      take: perPage,
      skip: offset,
    });
    return res.success("Get Successfully", existed,_total);
  };

export const remove = async (req, res) => {
  const { id } = req.query;
    if(!id) return res.error("404 not found");
  const data = await orm(Folder_Manager).findOne({
    where: {
      id,
    },
  });
  if (!data) return res.error("404 not found");
  await data.createLog(req, "remove","Roles", data);
  await orm(Folder_Manager).delete(id);
  return res.success("Deleted Successfully!", data);
};
