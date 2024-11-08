import { AppDataSource, orm } from "../../../data-source";
import { LoanGuarantee } from '../entities/loan_guarantee';
import { LoanProperty } from '../entities/loan_property';
import { Not, Like } from "typeorm"

// ประเภท หลักประกัน
export const addProperty = async (req, res) => {
    const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
    try {
        if (!obj.name) {
            return res.error("กรุณาระบุชื่อประเภท");
        }

        const property = await orm(LoanProperty).findOne({ where: { name: obj.name } });
        if (property) return res.error('มีประเภทหลักประกันนี้อยู่แล้ว');

        const lastProperty = await orm(LoanProperty).findOne({
            where: {}, 
            order: { index: 'DESC' } 
        });

        const newIndex = lastProperty ? lastProperty.index + 1 : 1;

        const newproperty = new LoanProperty();
        newproperty.name = obj.name;
        newproperty.index = newIndex;

        await newproperty.createLog(req, "create", "loan_property", obj);
        const savedProperty = await orm(LoanProperty).save(newproperty);

        return res.success('เพิ่มประเภทหลักประกันสำเร็จ', savedProperty);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const getProperty = async (req, res) => {
    const { search, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    try {
        const trimmedSearch = search.trim().replace(/\s+/g, ' ');

        let whereClause: any = {};
        if (search) {
            whereClause = { name: Like(`%${trimmedSearch}%`) };
        }

        const _total = await orm(LoanProperty).count({ where: whereClause });
        const property = await orm(LoanProperty).find({
            where: whereClause,
            take: perPage,
            skip: offset,
            order: { index: 'ASC' }
        })
        if (!property) return res.error('ไม่พบหลักประกัน')

        return res.success('ประเภทหลักประกันทั้งหมด', property, _total)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const getPropertyId = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const property = await orm(LoanProperty).findOne({ where: { id: _id } })
        if (!property) return res.error('ไม่พบหลักประกัน')

        const guarantees = await orm(LoanGuarantee).find({
            where: { type: property.name },
            order: { index: 'ASC' }
        })

        return res.success('หลักประกัน', { property, guarantees })
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const updateProperty = async (req, res) => {
    const { id } = req.params;
    const { ...obj } = req.body;
    const _id = parseInt(id) || -1
    try {
        const property = await orm(LoanProperty).findOne({ where: { id: _id } })
        if (!property) return res.error('ไม่ประเภทพบหลักประกัน')

        const guarantees = await orm(LoanGuarantee).find({ where: { type: property.name } })

        if (obj.name) {
            property.name = obj.name;
        }
        if (obj.index) {
            property.index = obj.index;
        }

        await property.createLog(req, "update", "loan_property", obj);
        await orm(LoanProperty).save(property);

        if (guarantees.length > 0) {
            for (const guarantee of guarantees) {
                guarantee.type = obj.name;
                await orm(LoanGuarantee).save(guarantee);
            }
        }

        return res.success('แก้ไขประเภทหลักประกันสำเร็จ', property)

    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const deleteProperty = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const property = await orm(LoanProperty).findOne({ where: { id: _id } })
        if (!property) return res.error('ไม่พบหลักประกัน')

        const guarantees = await orm(LoanGuarantee).find({ where: { type: property.name } })

        if (guarantees.length > 0) {
            for (const guarantee of guarantees) {
                await orm(LoanGuarantee).delete(guarantee.id);
            }
        }

        await property.createLog(req, "remove", "loan_property", property)
        await orm(LoanProperty).delete(_id);

        return res.success('ลบหลักประกันสำเร็จ', property)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}


// หลักประกัน
export const addGuarantee = async (req, res) => {
    const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
    try {
        if (!obj.type) {
            return res.error("กรุณาเลือกประเภท");
        }
        if (!obj.name) {
            return res.error("กรุณาระบุชื่อหลักประกัน");
        }

        const lastGuarantee = await orm(LoanGuarantee).findOne({
            where: { type: obj.type },
            order: { index: 'DESC' }
        });

        const newIndex = lastGuarantee ? lastGuarantee.index + 1 : 1;

        const guarantee = await orm(LoanGuarantee).findOne({ where: { name: obj.name, type: obj.type } });
        if (guarantee) return res.error('มีหลักประกันนี้อยู่แล้ว');

        const newGuarantee = new LoanGuarantee();
        newGuarantee.type = obj.type;
        newGuarantee.name = obj.name;
        newGuarantee.index = newIndex;

        await newGuarantee.createLog(req, "create", "loan_guarantee", obj);
        const savedGuarantee = await orm(LoanGuarantee).save(newGuarantee);

        return res.success('เพิ่มหลักประกันสำเร็จ', savedGuarantee);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const getGuarantee = async (req, res) => {
    const { search, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    try {
        let whereClause: any = {};

        if (search) {
            whereClause.name = Like(`%${search}%`);
        }

        const _total = await orm(LoanGuarantee).count({ where: whereClause });
        const guarantee = await orm(LoanGuarantee).find({
            where: whereClause,
            take: perPage,
            skip: offset,
            order: { type: 'DESC', index: 'ASC' },
        });
        if (!guarantee) return res.error('ไม่พบหลักประกัน');

        return res.success('หลักประกันทั้งหมด', guarantee, _total);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};



export const getGuaranteeId = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const guarantee = await orm(LoanGuarantee).findOne({ where: { id: _id } })
        if (!guarantee) return res.error('ไม่พบหลักประกัน')

        return res.success('หลักประกัน', guarantee)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const updateGuarantee = async (req, res) => {
    const { id } = req.params;
    const { ...obj } = req.body;
    const _id = parseInt(id) || -1
    try {
        const guarantee = await orm(LoanGuarantee).findOne({ where: { id: _id } })
        if (!guarantee) return res.error('ไม่พบหลักประกัน')

        guarantee.type = obj.type || guarantee.type;
        guarantee.name = obj.name || guarantee.name;

        if (obj.index !== undefined) {
            guarantee.index = obj.index;
        }

        await guarantee.createLog(req, "update", "loan_guarantee", obj);
        await orm(LoanGuarantee).save(guarantee);

        return res.success('แก้ไขหลักประกันสำเร็จ', guarantee)

    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}

export const deleteGuarantee = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1
    try {
        const guarantee = await orm(LoanGuarantee).findOne({ where: { id: _id } })
        if (!guarantee) return res.error('ไม่พบหลักประกัน')

        await guarantee.createLog(req, "remove", "loan_guarantee", guarantee)
        await orm(LoanGuarantee).delete(_id);

        return res.success('ลบหลักประกันสำเร็จ', guarantee)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}