"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlan = exports.delete_plan = exports.update_plan = exports.get_planId = exports.get_plan = exports.uploadPlanImage = exports.create_plan = void 0;
var data_source_1 = require("../../../data-source");
var loan_plan_1 = require("../entities/loan_plan");
var loan_applicationform_1 = require("../entities/loan_applicationform");
var Utils_1 = require("../../../Utils");
var path = require("path");
var sharp = require("sharp");
var loan_1 = require("../entities/loan");
var loan_installment_1 = require("../entities/loan_installment");
var tax_1 = require("../entities/tax");
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
var create_plan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, created_at, updated_at, deleted_at, applicationForm, addRate, obj, data, existingLoan, savedLoanPlan, existingForms, guaranteeExists, property_insuranceExists, applicationForms, currentIndex, _i, applicationForm_1, form, applicationFormData, savedForms, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, applicationForm = _a.applicationForm, addRate = _a.addRate, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at", "applicationForm", "addRate"]);
                data = new loan_plan_1.LoanPlan();
                data.name = obj.name;
                data.title = obj.title;
                data.description = obj.description;
                data.minimum_amount = obj.minimum_amount;
                data.maximum_amount = obj.maximum_amount;
                data.instruction = obj.instruction;
                data.delay_value = obj.delay_value;
                data.fixed_charge = obj.fixed_charge;
                data.application_percent_charge = obj.application_percent_charge;
                data.stamp = obj.stamp;
                data.document = obj.document;
                data.is_guarantee = obj.is_guarantee;
                data.type_interest = obj.type_interest;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { name: data.name } })];
            case 2:
                existingLoan = _b.sent();
                if (existingLoan)
                    return [2 /*return*/, res.status(400).json({ error: 'มีแผนสินเชื่อนี้อยู่แล้ว' })];
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
                    return [2 /*return*/, res.error('กรุณาระบุอัตราดอกเบี้ย')];
                }
                data.rate = Array.isArray(addRate) ? addRate : [];
                return [4 /*yield*/, data.createLog(req, "create", "loan_plan", obj)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).save(data)];
            case 4:
                savedLoanPlan = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).find({ where: { plan_id: savedLoanPlan.id }, order: { index: "ASC" } })];
            case 5:
                existingForms = _b.sent();
                guaranteeExists = existingForms.some(function (f) { return f.field_name === 'guarantee'; });
                property_insuranceExists = existingForms.some(function (f) { return f.field_name === 'property_insurance'; });
                applicationForms = [];
                currentIndex = 0;
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
                    for (_i = 0, applicationForm_1 = applicationForm; _i < applicationForm_1.length; _i++) {
                        form = applicationForm_1[_i];
                        applicationFormData = new loan_applicationform_1.Application_Form();
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
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).save(applicationForms)];
            case 6:
                savedForms = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).save(savedLoanPlan)];
            case 7:
                _b.sent();
                return [2 /*return*/, res.success('Created LoanPlan and ApplicationForm successfully', savedLoanPlan)];
            case 8:
                err_1 = _b.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.create_plan = create_plan;
var uploadPlanImage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loanPlan_id, plan, imagePath, filename, uploadPath, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loanPlan_id = req.params.loanPlan_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: loanPlan_id } })];
            case 2:
                plan = _a.sent();
                if (!plan)
                    return [2 /*return*/, res.status(404).json({ error: 'ไม่พบแผนสินเชื่อนี้' })];
                imagePath = plan.images;
                if (!req.file) return [3 /*break*/, 4];
                filename = (0, Utils_1.writeFile)("planId".concat(plan.id), req.file, 'uploads/plan');
                uploadPath = path.join(__dirname, '../../../uploads/plan', filename);
                return [4 /*yield*/, sharp(req.file.buffer)
                        .resize(390, 170)
                        .toFile(uploadPath)];
            case 3:
                _a.sent();
                imagePath = "plan/".concat(filename);
                _a.label = 4;
            case 4:
                plan.images = imagePath;
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).save(plan)];
            case 5:
                _a.sent();
                return [2 /*return*/, res.success('Image uploaded successfully', plan)];
            case 6:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.uploadPlanImage = uploadPlanImage;
var get_plan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search, page, limit, perPage, offset, whereClause, parameters, countQuery, query, totalCountResult, totalCount, detailLoanPlan, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, search = _a.search, page = _a.page, limit = _a.limit;
                perPage = parseInt(limit) || 20;
                offset = (parseInt(page) - 1) * perPage || 0;
                whereClause = '';
                parameters = [];
                if (search) {
                    whereClause = "WHERE LOWER(lp.name) LIKE LOWER(?)";
                    parameters.push("%".concat(search, "%"));
                }
                parameters.push(perPage, offset);
                countQuery = "\n            SELECT COUNT(*) AS total\n            FROM loan_plan lp\n            ".concat(whereClause, "\n        ");
                query = "\n        SELECT lp.*\n        FROM loan_plan lp\n        ".concat(whereClause, "\n        LIMIT ? OFFSET ?\n    ");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, data_source_1.AppDataSource.query(countQuery, parameters)];
            case 2:
                totalCountResult = _b.sent();
                totalCount = Number(totalCountResult[0].total);
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, parameters)];
            case 3:
                detailLoanPlan = _b.sent();
                if (!detailLoanPlan.length) {
                    return [2 /*return*/, res.error('Loan Plan not found')];
                }
                return [2 /*return*/, res.success('Get all LoanPlan', detailLoanPlan, totalCount)];
            case 4:
                err_3 = _b.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.get_plan = get_plan;
var get_planId = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loanPlan_id, _loanplanId, loanPlan, form, updated_at, deleted_at, filteredLoanPlan, cutfield, data, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loanPlan_id = req.params.loanPlan_id;
                _loanplanId = parseInt(loanPlan_id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: _loanplanId } })];
            case 2:
                loanPlan = _a.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error('LoanPlan not found')];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).find({ where: { plan_id: loanPlan.id }, order: { index: 'asc' } })];
            case 3:
                form = _a.sent();
                updated_at = loanPlan.updated_at, deleted_at = loanPlan.deleted_at, filteredLoanPlan = __rest(loanPlan, ["updated_at", "deleted_at"]);
                cutfield = form.map(function (form) {
                    var updated_at = form.updated_at, deleted_at = form.deleted_at, filteredForm = __rest(form, ["updated_at", "deleted_at"]);
                    return filteredForm;
                });
                data = {
                    loanPlan: filteredLoanPlan,
                    applicationForm: cutfield
                };
                return [2 /*return*/, res.success("Get LoanPlan Success", data)];
            case 4:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.get_planId = get_planId;
var update_plan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loanPlan_id, _a, id, created_at, updated_at, deleted_at, applicationForm, addRate, obj, _id, loanPlan, updatedLoanPlan, existingForms, guaranteeExists, property_insuranceExists, applicationForms, _loop_1, _i, applicationForm_2, form, formIdsToUpdate_1, formsToDelete, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                loanPlan_id = req.params.loanPlan_id;
                _a = req.body, id = _a.id, created_at = _a.created_at, updated_at = _a.updated_at, deleted_at = _a.deleted_at, applicationForm = _a.applicationForm, addRate = _a.addRate, obj = __rest(_a, ["id", "created_at", "updated_at", "deleted_at", "applicationForm", "addRate"]);
                _id = parseInt(loanPlan_id) || -1;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: _id } })];
            case 2:
                loanPlan = _b.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error('LoanPlan not found')];
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
                loanPlan.is_guarantee = obj.is_guarantee;
                loanPlan.type_interest = obj.type_interest;
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
                return [4 /*yield*/, loanPlan.createLog(req, "update", "loan_plan", obj)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).save(loanPlan)];
            case 4:
                updatedLoanPlan = _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).find({ where: { plan_id: updatedLoanPlan.id }, order: { index: "ASC" } })];
            case 5:
                existingForms = _b.sent();
                guaranteeExists = existingForms.some(function (f) { return f.field_name === 'guarantee'; });
                property_insuranceExists = existingForms.some(function (f) { return f.field_name === 'property_insurance'; });
                applicationForms = [];
                _loop_1 = function (form) {
                    var __none = ["type", "label", "field_name"].filter(function (field) { return !form[field]; });
                    if (__none.length > 0)
                        return "continue";
                    var applicationFormData = new loan_applicationform_1.Application_Form();
                    if (form.id) {
                        // Update existing form
                        var id_1 = form.id, obj_1 = __rest(form, ["id"]);
                        var __existed = existingForms.find(function (f) { return f.id === form.id; });
                        if (__existed) {
                            applicationFormData = __assign(__assign({}, __existed), obj_1);
                        }
                    }
                    else {
                        // Add new form
                        applicationFormData = __assign(__assign(__assign({}, applicationFormData), form), { plan_id: updatedLoanPlan.id });
                    }
                    applicationForms.push(applicationFormData);
                };
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
                for (_i = 0, applicationForm_2 = applicationForm; _i < applicationForm_2.length; _i++) {
                    form = applicationForm_2[_i];
                    _loop_1(form);
                }
                formIdsToUpdate_1 = applicationForms.filter(function (f) { return f.id; }).map(function (f) { return f.id; });
                formsToDelete = existingForms.filter(function (f) { return !formIdsToUpdate_1.includes(f.id); });
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).remove(formsToDelete)];
            case 6:
                _b.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_applicationform_1.Application_Form).save(applicationForms)];
            case 7:
                _b.sent();
                return [2 /*return*/, res.success('Update LoanPlan Success', updatedLoanPlan)];
            case 8:
                err_5 = _b.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.update_plan = update_plan;
var delete_plan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loanPlan_id, _id, loanPlan, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loanPlan_id = req.params.loanPlan_id;
                _id = parseInt(loanPlan_id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: _id } })];
            case 2:
                loanPlan = _a.sent();
                if (!loanPlan)
                    return [2 /*return*/, res.error('LoanPlan not found')];
                return [4 /*yield*/, loanPlan.createLog(req, "remove", "loan_plan", loanPlan)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).delete(loanPlan_id)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('LoanPlan deleted', loanPlan)];
            case 5:
                err_6 = _a.sent();
                console.log(err_6);
                return [2 /*return*/, res.error(err_6.detail || err_6.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.delete_plan = delete_plan;
var removePlan = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, loanplan_1, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: _id } })];
            case 2:
                loanplan_1 = _a.sent();
                if (!loanplan_1)
                    return [2 /*return*/, res.error("ไม่พบแผนสินเชื่อ")];
                return [4 /*yield*/, data_source_1.AppDataSource.transaction(function (transactionManager) { return __awaiter(void 0, void 0, void 0, function () {
                        var loans, _i, loans_1, loan, installments, _a, installments_1, installment, applicationForms;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, transactionManager.find(loan_1.Loan, {
                                        where: { plan_id: _id },
                                    })];
                                case 1:
                                    loans = _b.sent();
                                    _i = 0, loans_1 = loans;
                                    _b.label = 2;
                                case 2:
                                    if (!(_i < loans_1.length)) return [3 /*break*/, 11];
                                    loan = loans_1[_i];
                                    return [4 /*yield*/, transactionManager.find(loan_installment_1.Installment, {
                                            where: { loan_id: loan.id },
                                        })];
                                case 3:
                                    installments = _b.sent();
                                    _a = 0, installments_1 = installments;
                                    _b.label = 4;
                                case 4:
                                    if (!(_a < installments_1.length)) return [3 /*break*/, 7];
                                    installment = installments_1[_a];
                                    return [4 /*yield*/, transactionManager.delete(tax_1.Tax, { installment_id: installment.id })];
                                case 5:
                                    _b.sent();
                                    _b.label = 6;
                                case 6:
                                    _a++;
                                    return [3 /*break*/, 4];
                                case 7: return [4 /*yield*/, transactionManager.remove(loan_installment_1.Installment, installments)];
                                case 8:
                                    _b.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_1.Loan, loan)];
                                case 9:
                                    _b.sent();
                                    _b.label = 10;
                                case 10:
                                    _i++;
                                    return [3 /*break*/, 2];
                                case 11: return [4 /*yield*/, transactionManager.find(loan_applicationform_1.Application_Form, {
                                        where: { plan_id: _id },
                                    })];
                                case 12:
                                    applicationForms = _b.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_applicationform_1.Application_Form, applicationForms)];
                                case 13:
                                    _b.sent();
                                    return [4 /*yield*/, transactionManager.remove(loan_plan_1.LoanPlan, loanplan_1)];
                                case 14:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _a.sent();
                return [2 /*return*/, res.success("ลบแผนสินเชื่อและข้อมูลที่เกี่ยวข้องเรียบร้อยแล้ว")];
            case 4:
                err_7 = _a.sent();
                console.log(err_7);
                return [2 /*return*/, res.error(err_7.detail || err_7.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.removePlan = removePlan;
