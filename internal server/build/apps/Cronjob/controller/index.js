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
exports.updateLoanStatusIfDue = exports.startCronJobs = exports.getCronJobLogs = exports.stopCronJob = exports.runCronJobNow = exports.updateCronJob = exports.getCronjob_id = exports.getCronjob = exports.createCronJob = exports.deleteCronSchedule = exports.updateCronSchedule = exports.getCronSchedule_id = exports.getCronSchedule = exports.createCronSchedule = void 0;
var data_source_1 = require("../../../data-source");
var cronjob_1 = require("../entities/cronjob");
var cronjob_log_1 = require("../entities/cronjob_log");
var cronschedule_1 = require("../entities/cronschedule");
var loan_1 = require("../../Loan/entities/loan");
var enum_1 = require("../../Utils/enum");
var entities_1 = require("../../Users/entities");
var cron = require("node-cron");
var loan_plan_1 = require("../../Loan/entities/loan_plan");
var module_1 = require("../../Line_Message/module");
var dotenv = require("dotenv");
dotenv.config();
var CRONJOB_RUNNING = process.env.CRONJOB_RUNING;
var CRONJOB_TIMES = process.env.CRONJOB_TIMES;
var cron_interval = function (defaultInterval) {
    switch (CRONJOB_TIMES) {
        case 'M':
            return 60;
        case 'H':
            return 3600;
        case 'D':
            return 86400;
        default:
            return defaultInterval;
    }
};
var shouldRunCronJob = function () {
    return CRONJOB_RUNNING === 'ON';
};
// ---------------------------- Cron Schedule ---------------------------- //
var createCronSchedule = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, cronSchedule, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = __rest(req.body, []);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                cronSchedule = new cronschedule_1.CronSchedule();
                cronSchedule.name = obj.name;
                cronSchedule.interval = obj.interval;
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).save(cronSchedule)];
            case 2:
                _a.sent();
                return [4 /*yield*/, cronSchedule.createLog(req, 'create', 'cronjob_schedule', obj)];
            case 3:
                _a.sent();
                return [2 /*return*/, res.success('Created CronSchedule Success', cronSchedule)];
            case 4:
                err_1 = _a.sent();
                console.log(err_1);
                return [2 /*return*/, res.error(err_1.detail || err_1.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createCronSchedule = createCronSchedule;
var getCronSchedule = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cronSchedule, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).find({})];
            case 1:
                cronSchedule = _a.sent();
                if (!cronSchedule)
                    return [2 /*return*/, res.error('Cron schedule not found')];
                return [2 /*return*/, res.success('Get cron schedule', cronSchedule)];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [2 /*return*/, res.error(err_2.detail || err_2.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCronSchedule = getCronSchedule;
var getCronSchedule_id = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, cronSchedule, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).findOne({ where: { id: _id } })];
            case 2:
                cronSchedule = _a.sent();
                if (!cronSchedule)
                    return [2 /*return*/, res.error('Cron schedule not found')];
                return [2 /*return*/, res.success('Get cron schedule', cronSchedule)];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                return [2 /*return*/, res.error(err_3.detail || err_3.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCronSchedule_id = getCronSchedule_id;
var updateCronSchedule = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, obj, cronSchedule, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                obj = __rest(req.body, []);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).findOne({ where: { id: _id } })];
            case 2:
                cronSchedule = _a.sent();
                if (!cronSchedule)
                    return [2 /*return*/, res.error('Invalid schedule')];
                cronSchedule.name = obj.name;
                cronSchedule.interval = obj.interval;
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).save(cronSchedule)];
            case 3:
                _a.sent();
                return [4 /*yield*/, cronSchedule.createLog(req, 'update', 'cron_schedules', obj)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('Schedule updated successfully', cronSchedule)];
            case 5:
                err_4 = _a.sent();
                console.log(err_4);
                return [2 /*return*/, res.error(err_4.detail || err_4.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateCronSchedule = updateCronSchedule;
var deleteCronSchedule = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, cronSchedule, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).findOne({ where: { id: _id } })];
            case 2:
                cronSchedule = _a.sent();
                if (!cronSchedule)
                    return [2 /*return*/, res.error('Invalid schedule')];
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).delete(_id)];
            case 3:
                _a.sent();
                return [4 /*yield*/, cronSchedule.createLog(req, 'remove', 'cron_schedules', cronSchedule)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('Schedule deleted successfully', cronSchedule)];
            case 5:
                err_5 = _a.sent();
                console.log(err_5);
                return [2 /*return*/, res.error(err_5.detail || err_5.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteCronSchedule = deleteCronSchedule;
// เก็บ cron jobs ไว้ในตัวแปรสำหรับจัดการการหยุดและเริ่มใหม่
var scheduledCronJobs = new Map();
// ---------------------------- Cron Job ---------------------------- //
var createCronJob = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var obj, cronJob, schedule, interval, nextRun, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                obj = __rest(req.body, []);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                cronJob = new cronjob_1.CronJob();
                cronJob.name = obj.name;
                cronJob.alias = obj.name.toLowerCase().replace(/ /g, '_');
                ;
                cronJob.cron_schedule_id = obj.cron_schedule_id;
                cronJob.url = obj.url;
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).findOne({ where: { id: obj.cron_schedule_id } })];
            case 2:
                schedule = _a.sent();
                interval = cron_interval(schedule.interval);
                nextRun = new Date(Date.now() + interval * 1000);
                cronJob.next_run = nextRun;
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).save(cronJob)];
            case 3:
                _a.sent();
                return [4 /*yield*/, cronJob.createLog(req, 'create', 'cronjob', obj)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('Created Cronjob', cronJob)];
            case 5:
                err_6 = _a.sent();
                console.log(err_6);
                return [2 /*return*/, res.error(err_6.detail || err_6.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createCronJob = createCronJob;
var getCronjob = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cronjob, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).find({})];
            case 1:
                cronjob = _a.sent();
                if (!cronjob)
                    return [2 /*return*/, res.error('cronjob not found')];
                return [2 /*return*/, res.success('Get Cron', cronjob)];
            case 2:
                err_7 = _a.sent();
                console.log(err_7);
                return [2 /*return*/, res.error(err_7.detail || err_7.routine)];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getCronjob = getCronjob;
var getCronjob_id = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, cronjob, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).findOne({ where: { id: _id } })];
            case 2:
                cronjob = _a.sent();
                if (!cronjob)
                    return [2 /*return*/, res.error('CronJob not found')];
                return [2 /*return*/, res.success('Get Cron', cronjob)];
            case 3:
                err_8 = _a.sent();
                console.log(err_8);
                return [2 /*return*/, res.error(err_8.detail || err_8.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCronjob_id = getCronjob_id;
var updateCronJob = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, obj, cronjob, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                obj = __rest(req.body, []);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).findOne({ where: { id: _id } })];
            case 2:
                cronjob = _a.sent();
                if (!cronjob)
                    return [2 /*return*/, res.error('Invalid cronjob')];
                cronjob.name = obj.name;
                cronjob.alias = obj.name.toLowerCase().replace(/ /g, '_');
                ;
                cronjob.next_run = obj.next_run;
                cronjob.cron_schedule_id = obj.cron_schedule_id;
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).save(cronjob)];
            case 3:
                _a.sent();
                return [4 /*yield*/, cronjob.createLog(req, 'update', 'cronjob', obj)];
            case 4:
                _a.sent();
                return [2 /*return*/, res.success('Updated Crobjob Success', cronjob)];
            case 5:
                err_9 = _a.sent();
                console.log(err_9);
                return [2 /*return*/, res.error(err_9.detail || err_9.routine)];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateCronJob = updateCronJob;
var runCronJobNow = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, cronJob_1, schedule, interval, minutes, cronExpression, job, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).findOne({ where: { id: _id } })];
            case 2:
                cronJob_1 = _a.sent();
                if (!cronJob_1)
                    return [2 /*return*/, res.error('Cron job not found')];
                if (scheduledCronJobs.has(cronJob_1.id.toString())) {
                    scheduledCronJobs.get(cronJob_1.id.toString()).stop();
                    scheduledCronJobs.delete(cronJob_1.id.toString());
                }
                cronJob_1.is_running = enum_1.cron_status.Running;
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).findOne({ where: { id: cronJob_1.cron_schedule_id } })];
            case 3:
                schedule = _a.sent();
                interval = cron_interval(schedule.interval);
                minutes = interval / 60;
                cronExpression = "*/".concat(minutes, " * * * *");
                job = cron.schedule(cronExpression, function () {
                    runCronJob(cronJob_1);
                });
                scheduledCronJobs.set(cronJob_1.id.toString(), job);
                // รันทันทีหลัง start server (ถ้าไม่รันทันที กรณีที่ set cronjob ให้รันทุกวัน ครั้งแรกที่รันจะเป็นวันถัดไป)
                // ถ้าใช้งานจริง เอาออกได้ เพราะนัดงวดแรกจะเริ่มเป็นเดือนถัดไป ไม่จำเป็นต้องเช็คทันทีหลัง start server
                // await runCronJob(cronJob);
                return [2 /*return*/, res.success('Cron job run successfully', cronJob_1)];
            case 4:
                err_10 = _a.sent();
                console.log(err_10);
                return [2 /*return*/, res.error(err_10.detail || err_10.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.runCronJobNow = runCronJobNow;
var stopCronJob = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, cronJob, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).findOne({ where: { id: _id } })];
            case 2:
                cronJob = _a.sent();
                if (!cronJob)
                    return [2 /*return*/, res.error('Cron job not found')];
                cronJob.is_running = enum_1.cron_status.Pause;
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).save(cronJob)];
            case 3:
                _a.sent();
                // หยุด cron job ที่กำลังรันอยู่
                if (scheduledCronJobs.has(cronJob.id.toString())) {
                    scheduledCronJobs.get(cronJob.id.toString()).stop();
                    scheduledCronJobs.delete(cronJob.id.toString());
                }
                console.log("Stop scheduled jobs: ".concat(cronJob.name));
                return [2 /*return*/, res.success('Cron job stopped successfully', cronJob)];
            case 4:
                err_11 = _a.sent();
                console.log(err_11);
                return [2 /*return*/, res.error(err_11.detail || err_11.routine)];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.stopCronJob = stopCronJob;
var getCronJobLogs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _id, logs, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _id = parseInt(id) || -1;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_log_1.CronJobLog).find({ where: { cron_job_id: _id } })];
            case 2:
                logs = _a.sent();
                return [2 /*return*/, res.success('Get Cronjob log', logs)];
            case 3:
                err_12 = _a.sent();
                console.log(err_12);
                return [2 /*return*/, res.error(err_12.detail || err_12.routine)];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getCronJobLogs = getCronJobLogs;
// ---------------------------- เรียกใช้ cron ทั้งหมดที่ Run อยู่ ---------------------------- //
var startCronJobs = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cronJobs, _loop_1, _i, cronJobs_1, cronJob;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).find({ where: { is_running: enum_1.cron_status.Running } })];
            case 1:
                cronJobs = _a.sent();
                _loop_1 = function (cronJob) {
                    var schedule, interval, minutes, cronExpression, job;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0: return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).findOne({ where: { id: cronJob.cron_schedule_id } })];
                            case 1:
                                schedule = _b.sent();
                                interval = cron_interval(schedule.interval);
                                minutes = interval / 60;
                                cronExpression = "*/".concat(minutes, " * * * *");
                                job = cron.schedule(cronExpression, function () {
                                    runCronJob(cronJob);
                                });
                                scheduledCronJobs.set(cronJob.id.toString(), job);
                                console.log("Cron job: ".concat(cronJob.name));
                                // รันทันทีหลัง start server (ถ้าไม่รันทันที กรณีที่ set cronjob ให้รันทุกวัน ครั้งแรกที่รันจะเป็นวันถัดไป)
                                // ถ้าใช้งานจริง เอาออกได้ เพราะนัดงวดแรกจะเริ่มเป็นเดือนถัดไป ไม่จำเป็นต้องเช็คทันทีหลัง start server
                                return [4 /*yield*/, runCronJob(cronJob)];
                            case 2:
                                // รันทันทีหลัง start server (ถ้าไม่รันทันที กรณีที่ set cronjob ให้รันทุกวัน ครั้งแรกที่รันจะเป็นวันถัดไป)
                                // ถ้าใช้งานจริง เอาออกได้ เพราะนัดงวดแรกจะเริ่มเป็นเดือนถัดไป ไม่จำเป็นต้องเช็คทันทีหลัง start server
                                _b.sent();
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, cronJobs_1 = cronJobs;
                _a.label = 2;
            case 2:
                if (!(_i < cronJobs_1.length)) return [3 /*break*/, 5];
                cronJob = cronJobs_1[_i];
                return [5 /*yield**/, _loop_1(cronJob)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.startCronJobs = startCronJobs;
// ---------------------------- function ---------------------------- //
var runCronJob = function (cronJob) { return __awaiter(void 0, void 0, void 0, function () {
    var startAt, endAt, schedule, interval, log, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                // ตรวจสอบสถานะของ CRONJOB_RUNNING
                if (!shouldRunCronJob()) {
                    console.log("Cron job ".concat(cronJob.name, " \u0E16\u0E39\u0E01\u0E1B\u0E34\u0E14\u0E2D\u0E22\u0E39\u0E48"));
                    return [2 /*return*/];
                }
                startAt = new Date();
                console.log("Running cron job: ".concat(cronJob.name, " at ").concat(startAt));
                // Logic ของการทำงาน cronjob ตามปกติ
                // if (cronJob.url) {
                //     await axios.post(cronJob.url);
                // } else if (cronJob.action) {
                //     const action = JSON.parse(cronJob.action);
                //     if (action && action.length === 2) {
                //         const [controllerPath, methodName] = action;
                //         const controller = require(controllerPath);
                //         if (controller && controller[methodName]) {
                //             await controller[methodName]();
                //         }
                //     }
                // } else {
                //     await updateLoanStatusIfDue();
                // }
                return [4 /*yield*/, (0, exports.updateLoanStatusIfDue)()];
            case 1:
                // Logic ของการทำงาน cronjob ตามปกติ
                // if (cronJob.url) {
                //     await axios.post(cronJob.url);
                // } else if (cronJob.action) {
                //     const action = JSON.parse(cronJob.action);
                //     if (action && action.length === 2) {
                //         const [controllerPath, methodName] = action;
                //         const controller = require(controllerPath);
                //         if (controller && controller[methodName]) {
                //             await controller[methodName]();
                //         }
                //     }
                // } else {
                //     await updateLoanStatusIfDue();
                // }
                _a.sent();
                endAt = new Date();
                cronJob.last_run = endAt;
                return [4 /*yield*/, (0, data_source_1.orm)(cronschedule_1.CronSchedule).findOne({ where: { id: cronJob.cron_schedule_id } })];
            case 2:
                schedule = _a.sent();
                interval = schedule.interval;
                cronJob.next_run = new Date(endAt.getTime() + interval * 1000);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_1.CronJob).save(cronJob)];
            case 3:
                _a.sent();
                log = new cronjob_log_1.CronJobLog();
                log.cron_job_id = cronJob.id;
                log.start_at = startAt;
                log.end_at = endAt;
                log.duration = Math.round((endAt.getTime() - startAt.getTime()) / 1000);
                return [4 /*yield*/, (0, data_source_1.orm)(cronjob_log_1.CronJobLog).save(log)];
            case 4:
                _a.sent();
                console.log("Finished running cron job: ".concat(cronJob.name, " at ").concat(endAt));
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error('Error running cron job:', error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var updateLoanStatusIfDue = function () { return __awaiter(void 0, void 0, void 0, function () {
    var today, query, dueLoans, _i, dueLoans_1, loan, user, loanEntity, plan, nextAlertDate, formattedPerInstallment, formattedInstallmentDate, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                today = new Date();
                today.setHours(0, 0, 0, 0);
                query = "\n            SELECT \n            l.id, l.loan_number, l.user_id, l.installment_due, \n            l.last_alert_date, l.total_installment, l.given_installment + 1 AS given_installment,\n            l.delay_value\n            FROM loan l\n            WHERE l.installment_due <= ? \n            AND LOWER(l.status) NOT IN ('paid', 'bad', 'pending')\n        ";
                return [4 /*yield*/, data_source_1.AppDataSource.query(query, [today])];
            case 1:
                dueLoans = _a.sent();
                _i = 0, dueLoans_1 = dueLoans;
                _a.label = 2;
            case 2:
                if (!(_i < dueLoans_1.length)) return [3 /*break*/, 9];
                loan = dueLoans_1[_i];
                return [4 /*yield*/, (0, data_source_1.orm)(entities_1.Users).findOne({ where: { id: loan.user_id } })];
            case 3:
                user = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).findOne({ where: { id: loan.id } })];
            case 4:
                loanEntity = _a.sent();
                return [4 /*yield*/, (0, data_source_1.orm)(loan_plan_1.LoanPlan).findOne({ where: { id: loanEntity.plan_id } })];
            case 5:
                plan = _a.sent();
                if (!loanEntity) return [3 /*break*/, 8];
                nextAlertDate = loan.last_alert_date
                    ? new Date(new Date(loan.last_alert_date).setDate(new Date(loan.last_alert_date).getDate() + loan.delay_value))
                    : today;
                if (!(nextAlertDate <= today)) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, data_source_1.orm)(loan_1.Loan).save(__assign(__assign({}, loanEntity), { last_alert_date: today }))];
            case 6:
                _a.sent();
                formattedPerInstallment = "".concat(parseFloat(loanEntity.per_installment).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), " \u0E1A\u0E32\u0E17");
                formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }).format(new Date(loan.installment_due));
                if (!user.line_id) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, module_1.Line_SendNotificate)(user.line_id, plan.name, loanEntity.loan_number, formattedPerInstallment, formattedInstallmentDate, loan.given_installment, loanEntity.total_installment)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 2];
            case 9: return [3 /*break*/, 11];
            case 10:
                err_13 = _a.sent();
                console.error('Error updating loan status:', err_13);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.updateLoanStatusIfDue = updateLoanStatusIfDue;
// export const updateLoanStatusIfDue = async () => {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const query = `
//             SELECT
//             l.id, l.loan_number, l.user_id, l.installment_due,
//             l.installment_date
//             FROM loan l
//             LEFT JOIN loan_installment i ON l.id = i.loan_id
//             WHERE l.installment_due = ? AND LOWER(l.status) NOT IN ('Paid', 'Bad')
//         `;
//         const dueLoans = await AppDataSource.query(query, [today]);
//         const updatedLoans = new Set();  // ใช้ Set เพื่อเก็บ loan ที่ถูกส่งแล้ว
//         for (const loan of dueLoans) {
//             if (updatedLoans.has(loan.loan_number)) {
//                 continue;  // ถ้า loan นี้ส่งแล้วให้ข้ามไป
//             }
//             const user = await orm(Users).findOne({ where: { id: loan.user_id } })
//             const loanEntity = await orm(Loan).findOne({ where: { id: loan.id } });
//             const plan = await orm(LoanPlan).findOne({ where: { id: loanEntity.plan_id } })
//             if (loanEntity) {
//                 // loanEntity.status = loan_status.Due;
//                 await orm(Loan).save(loanEntity);
//                 console.log(`Loan Number ${loanEntity.loan_number} status updated to Due`);
//                 updatedLoans.add(loan.loan_number);  // เพิ่ม loan ลงใน Set
//                 // ใส่ ,
//                 const formattNumber = parseFloat(loanEntity.per_installment)
//                 const formattedPerInstallment = `${formattNumber.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;
//                 // วันที่เป็นภาษาไทย
//                 const formattedInstallmentDate = new Intl.DateTimeFormat('th-TH', {
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                 }).format(new Date(loan.installment_due));
//                 // ส่งข้อความแจ้งเตือนไปยังไลน์
//                 if (user.line_id) {
//                     // ส่งข้อความแจ้งเตือนไปยังไลน์
//                     await Line_SendNotificate(user.line_id, plan.name, loanEntity.loan_number, formattedPerInstallment, formattedInstallmentDate);
//                 }
//                 console.log(user.display_name)
//                 console.log(user.line_id)
//                 console.log(plan.name)
//                 console.log(loanEntity.loan_number)
//                 console.log(formattedPerInstallment)
//                 console.log(formattedInstallmentDate)
//             }
//         }
//     } catch (err) {
//         console.error('Error updating loan status:', err);
//     }
// };
// const autopayAllUsers = async () => {
//     try {
//         const today = new Date();
//         const query = `
//             SELECT i.*,
//                 l.user_id, l.per_installment, l.delay_value, l.delay_charge, l.loan_number
//                 FROM loan_installment i
//                 JOIN loan l ON i.loan_id = l.id
//                 WHERE i.installment_date <= ? AND i.isPaid = false
//             `;
//         const installments = await AppDataSource.query(query, [today]);
//         const userInstallmentsMap = new Map();
//         installments.forEach(installment => {
//             const userId = installment.user_id;
//             if (!userInstallmentsMap.has(userId)) {
//                 userInstallmentsMap.set(userId, []);
//             }
//             userInstallmentsMap.get(userId).push(installment);
//         });
//         userInstallmentsMap.forEach(async (userInstallments, userId) => {
//             const userBalance = await orm(User_Balance).findOne({ where: { user_id: userId } });
//             if (!userBalance) {
//                 console.log(`User ${userId} has no balance`);
//                 return;
//             }
//             for (const installment of userInstallments) {
//                 const loan = await orm(Loan).findOne({ where: { loan_number: installment.loan_number } });
//                 if (!loan) {
//                     console.log(`Loan not found for loan_number ${installment.loan_number}`);
//                     continue;
//                 }
//                 const plan = await orm(LoanPlan).findOne({ where: { id: loan.plan_id}})
//                 const installmentDate = new Date(installment.installment_date);
//                 const delayDays = Math.max(0, Math.ceil((today.getTime() - installmentDate.getTime()) / (1000 * 60 * 60 * 24)));
//                 const delayValue = parseInt(installment.delay_value);
//                 let delayCharge = 0;
//                 if (delayDays > delayValue) {
//                     const chargeableDelayDays = delayDays - delayValue;
//                     delayCharge = chargeableDelayDays * parseFloat(installment.delay_charge);
//                 }
//                 const totalDeductedAmount = parseFloat(installment.per_installment) + delayCharge;
//                 if (userBalance.balance < totalDeductedAmount) {
//                     console.log(`User ${userId} has insufficient funds for installment payment`);
//                     continue;
//                 }
//                 // ตัดยอดจาก balance ของผู้ใช้
//                 userBalance.balance -= totalDeductedAmount;
//                 await orm(User_Balance).save(userBalance);
//                 // บันทึก transaction
//                 const transaction = new Transaction();
//                 transaction.user_id = userId;
//                 transaction.amount = totalDeductedAmount;
//                 // transaction.trx_type = 'minus';
//                 // transaction.trx = `${installment.loan_number}`;
//                 // transaction.details = 'Loan installment paid';
//                 // transaction.remark = 'loan_installment';
//                 // transaction.post_balance = userBalance.balance;
//                 await orm(Transaction).save(transaction);
//                 // อัพ installment
//                 installment.isPaid = true;
//                 installment.given_at = today;
//                 installment.delay_days = delayDays;
//                 installment.delay_charge = delayCharge;
//                 installment.paid = installment.per_installment;
//                 await orm(Installment).save(installment);
//                 // อัพเดท loan
//                 loan.given_installment = loan.given_installment + 1;
//                 loan.total_paid = parseFloat(loan.total_paid) + parseFloat(installment.per_installment);
//                 loan.remaining = parseFloat(loan.remaining) - parseFloat(installment.per_installment);
//                 await orm(Loan).save(loan);
//                 const user = await orm(Users).findOne({ where: { id: userId } });
//                 if (user) {
//                     const emailContent = emailContent_pay(user, installment, plan, transaction, userBalance);
//                     await sendNotificationEmail(user.email, 'Paid Installment Successfully', emailContent, userId);
//                 }
//             }
//         });
//     } catch (err) {
//         console.error('Error processing installments:', err);
//     }
// };
