import { Like } from "typeorm";
import { orm } from "../../../data-source";
import { File_Manager } from "../entities/File_Manager";

export const list = async (req, res) => {
    const { search, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;
    let whereClause: any = {};
    if (search) {
      whereClause.name = Like(`%${search}%`);
    }
    const _total = await orm(File_Manager).count({ where: whereClause});
    const existed = await orm(File_Manager).find({
      where: whereClause,
      take: perPage,
      skip: offset,
    });
    return res.success("Get Successfully", existed,_total);
  };
