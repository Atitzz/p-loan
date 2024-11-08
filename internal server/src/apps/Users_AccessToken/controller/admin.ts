import { Like } from "typeorm";
import { orm } from "../../../data-source";
import { UsersAccessToken } from "../entities";

export const list = async (req, res) => {
    const { search, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;
    let whereClause: any = {};
    if (search) {
      whereClause.name = Like(`%${search}%`);
    }
    const _total = await orm(UsersAccessToken).count({ where: whereClause});
    const existed = await orm(UsersAccessToken).find({
      where: whereClause,
      take: perPage,
      skip: offset,
    });
    return res.success("Get Successfully", existed,_total);
};

export const remove = async (req, res) => {
  const { id } = req.query;
  if(!id) return res.error("404 not found");
  const data = await orm(UsersAccessToken).findOne({
    where: {
      id,
    },
  });
  if (!data) return res.error("404 not found");
  await data.createLog(req, "remove","Roles", data);
  await orm(UsersAccessToken).softDelete(data.id);
  return res.success("Deleted Successfully!", data);
};
