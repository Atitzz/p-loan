import { Like } from "typeorm";
import { orm } from "../../../data-source";
import { Permissions } from "../../Permission/entities";
import { Menu } from "../entities/Menu";

export const menu_post = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const Keys = Object.keys(obj);
  const data = new Menu();
  Keys.map((key) => {
    data[key] = obj[key];
  });
  try {
    const result = await orm(Menu).save(data);
    return res.success("Created Successfully!", result);
  } catch (err) {
    return res.error(err.detail || err.routine);
  }
};

export const menu_put = async (req, res) => {
  const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
  const data = await orm(Menu).findOne({
    where: {
      id:id,
    }
  });
  const Keys = Object.keys(obj);
  if (data) {
    Keys.map((key) => {
      data[key] = obj[key];
      return;
    });
    try {
        await orm(Menu).save(data);
      } catch (err) {
        return res.error(err.detail || err.routine);
      }
    return res.success("Updated Successfully!", data);
  }
  return res.error(`Invalid form!`);
};

export const menu_get = async (req, res) => {
  const { search, page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};
  if (search) {
    whereClause.name = Like(`%${search}%`);
  }
  const _total = await orm(Menu).count({ where: whereClause});
  const existed = await orm(Menu).find({
    where: whereClause,
    take: perPage,
    skip: offset,
  });
  return res.success("Get Successfully", existed,_total);
};

export const menu_delete = async (req, res) => {
  const { id } = req.body;
  const data = await orm(Menu).findOne({
    where: {
      id,
    },
  });
  if (data) {
    await orm(Menu).delete(id);
    return res.success("Geted Successfully!", data);
  }
  return res.error(`Invalid form!`);
};
