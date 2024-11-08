import { Like } from "typeorm";
import { AppDataSource, orm } from "../../../data-source";
import { User_profile } from "../entities/user_profile";

export async function list(req, res) {
  const { search, page, limit } = req.query;
  const perPage = parseInt(limit) || 20;
  const offset = (parseInt(page) - 1) * perPage || 0;
  let whereClause: any = {};
  if (search) {
    whereClause.name = Like(`%${search}%`);
  }
  const _total = await orm(User_profile).count();
  const existed = await orm(User_profile).find({
    where: whereClause,
    take: perPage,
    skip: offset,
  });
  try {
    return res.success("Get Successfully", existed,_total);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
}

export async function store(req, res) {
  try {
    const { id,hnid, ...obj } = req.body;
    const _id = parseInt(id) || -1;
    const existed = await orm(User_profile).findOne({ where: { id: _id } });
    let save = {};
    if (existed)
      save = await orm(User_profile).save({
        ...existed,
        ...obj
      });
    else
    {
    save = await orm(User_profile).save({
      ...obj,
      registered_at: new Date()
    });
    }
  

    return res.success("Successfully", save);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
}

export async function remove(req, res) {
  const { id } = req.params;
  const _id = parseInt(id) || -1;
  const existed = await orm(User_profile).findOne({ where: { id:_id } });

  if (!existed) return res.error("Data Not Found!");

  try {
    await orm(User_profile).delete(id);
    return res.success("Successfully");
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
}
