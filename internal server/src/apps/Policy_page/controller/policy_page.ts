import { Frontend } from '../entities/frontend';
import { AppDataSource, orm } from "../../../data-source";


// -------------------------------- Policy -------------------------------- //

// สร้างหน้า Policy ใหม่
export const createPolicyPage = async (req, res) => {
  try {
    const { dataKeys, dataValues, seoContent, tempname, slug } = req.body;

    const newPolicyPage = orm(Frontend).create({ dataKeys, dataValues, seoContent, tempname, slug });
    await orm(Frontend).save(newPolicyPage);

    return res.success('Create Policy Success', newPolicyPage);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// แสดงข้อมูลหน้า Policy ทั้งหมด
export const getPolicyPages = async (req, res) => {
  try {
    const policyPages = await orm(Frontend).find({});
    if (!policyPages) {
      return res.status(404).json({ message: 'Policy page not found' });
    }
    return res.success('Get Policy Success', policyPages);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// แสดงข้อมูลหน้า Policy ตาม ID
export const getPolicyPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const policyPage = await orm(Frontend).findOne({ where: { id } });

    if (!policyPage) {
      return res.status(404).json({ message: 'Policy page not found' });
    }

    return res.success('Get PolicyId Success', policyPage);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// อัปเดตหน้า Policy
export const updatePolicyPage = async (req, res) => {
  try {
    const { id } = req.params;
    const { dataKeys, dataValues, seoContent, tempname, slug } = req.body;

    const policyPage = await orm(Frontend).findOne({ where: { id } });

    if (!policyPage) {
      return res.status(404).json({ message: 'Policy page not found' });
    }

    orm(Frontend).merge(policyPage, { dataKeys, dataValues, seoContent, tempname, slug });
    await orm(Frontend).save(policyPage);

    return res.success('Updated Policy Success', policyPage);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};

// ลบหน้า Policy
export const deletePolicyPage = async (req, res) => {
  try {
    const { id } = req.params;

    const policyPage = await orm(Frontend).findOne({ where: { id } });

    if (!policyPage) {
      return res.status(404).json({ message: 'Policy page not found' });
    }

    await orm(Frontend).remove(policyPage);
    return res.success('Policy page deleted successfully', policyPage);
  } catch (err) {
    console.log(err);
    return res.error(err.detail || err.routine);
  }
};