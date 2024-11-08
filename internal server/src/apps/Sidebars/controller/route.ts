import { Like } from "typeorm";
import { orm } from "../../../data-source";
import { Route } from "../entities/Route";

export const route_post = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const Keys = Object.keys(obj);
  const data = new Route();
  Keys.map((key) => {
    data[key] = obj[key];
  });
  try {
    const result = await orm(Route).save(data);
    return res.success("Created Successfully!", result);
  } catch (err) {
    return res.status(400).json({ err: err.detail || err.routine });
  }
};

export const route_put = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const data = await orm(Route).findOne({
    where: {
      id: id,
    },
  });
  const Keys = Object.keys(obj);
  if (data) {
    Keys.map((key) => {
      data[key] = obj[key];
      return;
    });
    try {
      await orm(Route).save(data);
      return res.success("Updated Successfully!", data);
    } catch (err) {
      return res.status(400).json({ err: err.detail || err.routine });
    }
  }
  return res.status(400).json({ err: `Invalid form!` });
};

export const route_get = async (req, res) => {
  const { search, page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};
  if (search) {
    whereClause.name = Like(`%${search}%`);
  }
  const _total = await orm(Route).count({ where: whereClause});
  const existed = await orm(Route).find({
    where: whereClause,
    take: perPage,
    skip: offset,
  });
  return res.success("Get Successfully", existed,_total);
};

export const route_delete = async (req, res) => {
  const { id } = req.body;
  const data = await orm(Route).findOne({
    where: {
      id,
    },
  });
  if (data) {
    await orm(Route).delete(id);
    return res.success("Deleted Successfully!", data);
  }
  return res.status(400).json({ err: `Invalid form!` });
};
