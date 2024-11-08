import { LoanCategory } from '../entities/loan_category';
import { AppDataSource, orm } from "../../../data-source";
import { Not, Like } from "typeorm"
import { LoanPlan } from '../entities/loan_plan';
import { Application_Form } from '../entities/loan_applicationform';
import { File_Manager } from '../../FileManager/entities/File_Manager';
import { writeFile } from "../../../Utils"
import { type_option } from "../../Utils/enum"
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { LoanGuarantee } from '../entities/loan_guarantee';
import { Loan } from '../entities/loan';
import { Installment } from '../entities/loan_installment';
import { Tax } from '../entities/tax';

// แปลง base64 เป็นไฟล์
// const saveBase64Image = async (base64String, name, folder) => {
//     try {
//         const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
//         const buffer = Buffer.from(base64Data, 'base64');

//         const resizedBuffer = await sharp(buffer)
//             .resize(375, 100)
//             .toBuffer();

//         const filename = `${name}.jpg`;
//         const filePath = path.join(__dirname, `../../../${folder}`, filename);
//         fs.writeFileSync(filePath, resizedBuffer);
//         return filename;
//     } catch (error) {
//         console.error('Error resizing image:', error);
//         throw error;
//     }
// };
// // ใช้กับ update (ถ้าหากเปลี่ยนภาพ ก็ให้ลบภาพเก่า)
// const deleteOldImages = (imagePaths, folder) => {
//     imagePaths.forEach(image => {
//         const filePath = path.join(__dirname, `../../../${folder}`, image);
//         if (fs.existsSync(filePath)) {
//             fs.unlinkSync(filePath);
//         }
//     });
// };


// -------------------------------- loan category -------------------------------- //
// export const create_category = async (req, res) => {
//     const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
//     const data = new LoanCategory();
//     data.name = obj.name;
//     data.description = obj.description;

//     try {
//         const existing = await orm(LoanCategory).findOne({ where: { name: data.name } });
//         if (existing) return res.error('Category already exists');

//         await data.createLog(req, "create", "loan_category", obj);
//         await orm(LoanCategory).save(data);
//         return res.success('Created Successfully', data);
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// };

// export const get_category = async (req, res) => {
//     const { search } = req.query
//     try {
//         let whereClause: any = {};
//         if (search) {
//             whereClause.name = Like(`%${search}%`)
//         }
//         const _total = await orm(LoanCategory).count({ where: whereClause })
//         const categories = await orm(LoanCategory).find({ where: whereClause });
//         if (!categories) return res.error('No categories')
//         return res.success('Get All Category', categories, _total);
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// }

// export const get_categoryId = async (req, res) => {
//     const { category_id } = req.params;
//     const _id = parseInt(category_id) || -1;
//     try {
//         const category = await orm(LoanCategory).findOne({ where: { id: _id } });
//         if (!category) return res.error('Category not found')

//         return res.success('Get category_id', category);
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// }

// export const update_category = async (req, res) => {
//     const { category_id } = req.params;
//     const { id, created_at, updated_at, deleted_at, ...obj } = req.body;
//     const _id = parseInt(category_id) || -1;


//     try {
//         const category = await orm(LoanCategory).findOne({ where: { id: _id } });
//         if (!category) return res.error('Category not found');

//         const existingCategory = await orm(LoanCategory).findOne({ where: { name: obj.name, id: Not(_id) } });
//         if (existingCategory) return res.error(`${obj.name} already exists`);

//         category.name = obj.name;
//         category.description = obj.description;


//         await category.createLog(req, "update", "loan_category", obj);
//         await orm(LoanCategory).save(category);
//         return res.success('Updated Successfully', category);
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// };

// export const delete_category = async (req, res) => {
//     const { category_id } = req.params;
//     const _id = parseInt(category_id) || -1;
//     try {
//         const category = await orm(LoanCategory).findOne({ where: { id: _id } });
//         if (!category) return res.error('Category not found')


//         await category.createLog(req, "remove", "loan_category", category)
//         await orm(LoanCategory).delete(category_id);
//         return res.success('Category deleted', category);
//     } catch (err) {
//         console.log(err);
//         return res.error(err.detail || err.routine);
//     }
// }



// -------------------------------- loan plan -------------------------------- //
export const create_plan = async (req, res) => {
    const { id, created_at, updated_at, deleted_at, applicationForm, addRate, ...obj } = req.body;

    const data = new LoanPlan();
    data.name = obj.name;
    data.title = obj.title;
    data.description = obj.description;
    data.minimum_amount = obj.minimum_amount;
    data.maximum_amount = obj.maximum_amount;
    data.instruction = obj.instruction;
    data.delay_value = obj.delay_value;
    data.fixed_charge = obj.fixed_charge;
    data.application_percent_charge = obj.application_percent_charge;
    data.stamp = obj.stamp
    data.document = obj.document;
    data.is_guarantee = obj.is_guarantee
    data.type_interest = obj.type_interest
    // data.images = images;

    try {
        const existingLoan = await orm(LoanPlan).findOne({ where: { name: data.name } });
        if (existingLoan) return res.status(400).json({ error: 'มีแผนสินเชื่อนี้อยู่แล้ว' });

        // let savedImage = null;
        // if (images) {
        //     try {
        //         const imagePath = await saveBase64Image(images, `plan-${obj.title}`, 'uploads/plan');
        //         savedImage = imagePath; 
        //     } catch (error) {
        //         console.error('Error saving image', error);
        //     }
        // }

        if (!addRate || !Array.isArray(addRate) || addRate.length === 0) {
            return res.error('กรุณาระบุอัตราดอกเบี้ย');
        }

        data.rate = Array.isArray(addRate) ? addRate : [];

        await data.createLog(req, "create", "loan_plan", obj);
        const savedLoanPlan = await orm(LoanPlan).save(data);

        const existingForms = await orm(Application_Form).find({ where: { plan_id: savedLoanPlan.id }, order: { index: "ASC" } });

        // ตรวจสอบว่ามี guarantee field อยู่แล้วหรือไม่
        const guaranteeExists = existingForms.some(f => f.field_name === 'guarantee');
        const property_insuranceExists = existingForms.some(f => f.field_name === 'property_insurance');

        const applicationForms = [];
        let currentIndex = 0;

        // if (!guaranteeExists) {
        //     const fixedFormGuarantee = new Application_Form();
        //     fixedFormGuarantee.plan_id = savedLoanPlan.id;
        //     fixedFormGuarantee.index = ++currentIndex;
        //     fixedFormGuarantee.type = 'select';
        //     fixedFormGuarantee.field_name = 'guarantee';
        //     fixedFormGuarantee.is_required = type_option.options;
        //     fixedFormGuarantee.label = 'หลักประกัน';
        //     fixedFormGuarantee.options = ['บุคคลค้ำประกัน', 'ที่ดิน', 'หลักประกันทางธุรกิจ'];
        //     fixedFormGuarantee.width = 100;
        //     applicationForms.push(fixedFormGuarantee);
        // }

        // if (!property_insuranceExists) {
        //     const fixedFormProperty_insurance = new Application_Form();
        //     fixedFormProperty_insurance.plan_id = savedLoanPlan.id;
        //     fixedFormProperty_insurance.index = ++currentIndex;
        //     fixedFormProperty_insurance.type = 'select';
        //     fixedFormProperty_insurance.field_name = 'property_insurance';
        //     fixedFormProperty_insurance.is_required = type_option.options;
        //     fixedFormProperty_insurance.label = 'ทรัพย์สินที่ใช้ประกัน';
        //     fixedFormProperty_insurance.options = ['ที่ดิน', 'สมุดคู่มือจดทะเบียนรถยนต์', 'สมุดคู่มือจดทะเบียนรถเพื่อการเกษตร', 'สมุดคู่มือจดทะเบียนรถจักรยานยนต์', 'สมุดคู่มือจดทะเบียนรถอื่นๆ'];
        //     fixedFormProperty_insurance.width = 100;
        //     applicationForms.push(fixedFormProperty_insurance);
        // }

        if (applicationForm && applicationForm.length > 0) {
            for (const form of applicationForm) {
                const applicationFormData = new Application_Form();
                applicationFormData.plan_id = savedLoanPlan.id;
                applicationFormData.index = form.index;
                applicationFormData.type = form.type;
                applicationFormData.field_name = form.field_name;
                applicationFormData.is_required = form.is_required;
                applicationFormData.label = form.label;
                applicationFormData.options = form.options;
                applicationFormData.width = form.width;
                applicationFormData.instruction = form.instruction;
                applicationFormData.extensions = form.extensions;
                applicationForms.push(applicationFormData);
            }
        }

        const savedForms = await orm(Application_Form).save(applicationForms);
        await orm(LoanPlan).save(savedLoanPlan);

        return res.success('Created LoanPlan and ApplicationForm successfully', savedLoanPlan);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};

export const uploadPlanImage = async (req, res) => {
    const { loanPlan_id } = req.params;

    try {
        const plan = await orm(LoanPlan).findOne({ where: { id: loanPlan_id } });
        if (!plan) return res.status(404).json({ error: 'ไม่พบแผนสินเชื่อนี้' });

        let imagePath = plan.images;
        if (req.file) {
            // ลบรูปภาพเก่า
            // if (imagePath) {
            //     const oldImagePath = path.join(__dirname, '../../../uploads/plan', path.basename(plan.images));
            //     if (fs.existsSync(oldImagePath)) {
            //         fs.unlink(oldImagePath, (err) => {
            //             if (err) console.error('Failed to delete old image:', err);
            //         });
            //     }
            // }

            const filename = writeFile(`planId${plan.id}`, req.file, 'uploads/plan');

            const uploadPath = path.join(__dirname, '../../../uploads/plan', filename);
            await sharp(req.file.buffer)
                .resize(390, 170)
                .toFile(uploadPath);

            imagePath = `plan/${filename}`;
        }

        plan.images = imagePath;
        await orm(LoanPlan).save(plan);

        return res.success('Image uploaded successfully', plan);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const get_plan = async (req, res) => {
    const { search, page, limit } = req.query;
    const perPage = parseInt(limit) || 20;
    const offset = (parseInt(page) - 1) * perPage || 0;

    let whereClause = '';
    const parameters = [];
    if (search) {
        whereClause = `WHERE LOWER(lp.name) LIKE LOWER(?)`;
        parameters.push(`%${search}%`);
    }
    parameters.push(perPage, offset)

    const countQuery = `
            SELECT COUNT(*) AS total
            FROM loan_plan lp
            ${whereClause}
        `;

    const query = `
        SELECT lp.*
        FROM loan_plan lp
        ${whereClause}
        LIMIT ? OFFSET ?
    `;
    try {
        const totalCountResult = await AppDataSource.query(countQuery, parameters);
        const totalCount = Number(totalCountResult[0].total);

        const detailLoanPlan = await AppDataSource.query(query, parameters);

        if (!detailLoanPlan.length) {
            return res.error('Loan Plan not found');
        }


        return res.success('Get all LoanPlan', detailLoanPlan, totalCount);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const get_planId = async (req, res) => {
    const { loanPlan_id } = req.params;
    const _loanplanId = parseInt(loanPlan_id) || -1

    try {
        const loanPlan = await orm(LoanPlan).findOne({ where: { id: _loanplanId } });
        if (!loanPlan) return res.error('LoanPlan not found');

        const form = await orm(Application_Form).find({ where: { plan_id: loanPlan.id }, order: { index: 'asc' } })

        const { updated_at, deleted_at, ...filteredLoanPlan } = loanPlan;

        const cutfield = form.map(form => {
            const { updated_at, deleted_at, ...filteredForm } = form;
            return filteredForm;
        });

        const data = {
            loanPlan: filteredLoanPlan,
            applicationForm: cutfield
        };

        return res.success("Get LoanPlan Success", data)
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}


export const update_plan = async (req, res) => {
    const { loanPlan_id } = req.params;
    const { id, created_at, updated_at, deleted_at, applicationForm, addRate, ...obj } = req.body;
    const _id = parseInt(loanPlan_id) || -1;

    try {
        const loanPlan = await orm(LoanPlan).findOne({ where: { id: _id } });
        if (!loanPlan) return res.error('LoanPlan not found');

        loanPlan.name = obj.name;
        loanPlan.title = obj.title;
        loanPlan.description = obj.description;
        loanPlan.minimum_amount = obj.minimum_amount;
        loanPlan.maximum_amount = obj.maximum_amount;
        loanPlan.instruction = obj.instruction;
        loanPlan.delay_value = obj.delay_value;
        loanPlan.fixed_charge = obj.fixed_charge;
        loanPlan.stamp = obj.stamp;
        loanPlan.document = obj.document;
        // loanPlan.per_interest = obj.per_interest;
        loanPlan.application_percent_charge = obj.application_percent_charge;
        loanPlan.is_guarantee = obj.is_guarantee
        loanPlan.type_interest = obj.type_interest

        // loanPlan.images = images;

        // let savedImages = loanPlan.images ? JSON.parse(loanPlan.images) : null;

        // if (images && images.length > 0) {
        //     if (savedImages) {
        //         deleteOldImages(savedImages, 'uploads/plan');
        //     }
        //     savedImages = [];
        //     for (let i = 0; i < images.length; i++) {
        //         try {
        //             const imagePath = await saveBase64Image(images[i], `plan-${loanPlan.id}`, 'uploads/plan');
        //             savedImages.push(imagePath);
        //         } catch (error) {
        //             console.error('Error saving image', error);
        //         }
        //     }
        //     savedImages = JSON.stringify(savedImages);
        // }
        // loanPlan.images = savedImages;

        loanPlan.rate = Array.isArray(addRate) ? addRate : [];

        await loanPlan.createLog(req, "update", "loan_plan", obj);
        const updatedLoanPlan = await orm(LoanPlan).save(loanPlan);

        const existingForms = await orm(Application_Form).find({ where: { plan_id: updatedLoanPlan.id }, order: { index: "ASC" } });

        // ตรวจสอบว่ามี guarantee field อยู่แล้วหรือไม่
        const guaranteeExists = existingForms.some(f => f.field_name === 'guarantee');
        const property_insuranceExists = existingForms.some(f => f.field_name === 'property_insurance');

        const applicationForms = [];

        // if (!guaranteeExists) {
        //     const fixedFormGuarantee = new Application_Form();
        //     fixedFormGuarantee.plan_id = updatedLoanPlan.id;
        //     fixedFormGuarantee.index = existingForms.length + 1;
        //     fixedFormGuarantee.type = 'select';
        //     fixedFormGuarantee.field_name = 'guarantee';
        //     fixedFormGuarantee.is_required = type_option.options;
        //     fixedFormGuarantee.label = 'หลักประกัน';
        //     fixedFormGuarantee.options = ['บุคคลค้ำประกัน', 'ที่ดิน', 'หลักประกันทางธุรกิจ'];
        //     fixedFormGuarantee.width = 100;
        //     applicationForms.push(fixedFormGuarantee);
        // }
        // if (!property_insuranceExists) {
        //     const fixedFormProperty_insurance = new Application_Form();
        //     fixedFormProperty_insurance.plan_id = updatedLoanPlan.id;
        //     fixedFormProperty_insurance.index = existingForms.length + 1;
        //     fixedFormProperty_insurance.type = 'select';
        //     fixedFormProperty_insurance.field_name = 'property_insurance';
        //     fixedFormProperty_insurance.is_required = type_option.options;
        //     fixedFormProperty_insurance.label = 'ทรัพย์สินที่ใช้ประกัน';
        //     fixedFormProperty_insurance.options = ['ที่ดิน', 'สมุดคู่มือจดทะเบียนรถยนต์', 'สมุดคู่มือจดทะเบียนรถเพื่อการเกษตร', 'สมุดคู่มือจดทะเบียนรถจักรยานยนต์', 'สมุดคู่มือจดทะเบียนรถอื่นๆ'];
        //     fixedFormProperty_insurance.width = 100;
        //     applicationForms.push(fixedFormProperty_insurance);
        // }

        for (const form of applicationForm) {
            const __none = ["type", "label", "field_name"].filter(field => !form[field]);
            if (__none.length > 0) continue;
            let applicationFormData = new Application_Form();
            if (form.id) {
                // Update existing form
                const { id, ...obj } = form;
                const __existed = existingForms.find(f => f.id === form.id);
                if (__existed) {
                    applicationFormData = {
                        ...__existed,
                        ...obj
                    }
                }
            } else {
                // Add new form
                applicationFormData = {
                    ...applicationFormData,
                    ...form,
                    plan_id: updatedLoanPlan.id
                }
            }

            applicationForms.push(applicationFormData);
        }

        const formIdsToUpdate = applicationForms.filter(f => f.id).map(f => f.id);
        const formsToDelete = existingForms.filter(f => !formIdsToUpdate.includes(f.id));
        await orm(Application_Form).remove(formsToDelete);
        await orm(Application_Form).save(applicationForms);
        return res.success('Update LoanPlan Success', updatedLoanPlan);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};


export const delete_plan = async (req, res) => {
    const { loanPlan_id } = req.params;
    const _id = parseInt(loanPlan_id) || -1
    try {
        const loanPlan = await orm(LoanPlan).findOne({ where: { id: _id } });
        if (!loanPlan) return res.error('LoanPlan not found')

        await loanPlan.createLog(req, "remove", "loan_plan", loanPlan)
        await orm(LoanPlan).delete(loanPlan_id);
        return res.success('LoanPlan deleted', loanPlan);
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
}


export const removePlan = async (req, res) => {
    const { id } = req.params;
    const _id = parseInt(id) || -1

    try {
        const loanplan = await orm(LoanPlan).findOne({ where: { id: _id } });
        if (!loanplan) return res.error("ไม่พบแผนสินเชื่อ");

        await AppDataSource.transaction(async (transactionManager) => {
            const loans = await transactionManager.find(Loan, {
                where: { plan_id: _id },
            });

            for (const loan of loans) {
                const installments = await transactionManager.find(Installment, {
                    where: { loan_id: loan.id },
                });

                for (const installment of installments) {
                    await transactionManager.delete(Tax, { installment_id: installment.id });
                }

                await transactionManager.remove(Installment, installments);

                await transactionManager.remove(Loan, loan);
            }

            const applicationForms = await transactionManager.find(Application_Form, {
                where: { plan_id: _id },
            });
            await transactionManager.remove(Application_Form, applicationForms);

            await transactionManager.remove(LoanPlan, loanplan);
        });

        return res.success("ลบแผนสินเชื่อและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว");
    } catch (err) {
        console.log(err);
        return res.error(err.detail || err.routine);
    }
};
