"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var index_1 = require("../controller/index");
exports.default = (function (router) {
    // schedule
    router.post('/cron/schedule', (0, middlewares_1.warper)(index_1.createCronSchedule));
    router.get('/cron/schedule', (0, middlewares_1.warper)(index_1.getCronSchedule));
    router.get('/cron/schedule/:id', (0, middlewares_1.warper)(index_1.getCronSchedule_id));
    router.put('/cron/schedule/:id', (0, middlewares_1.warper)(index_1.updateCronSchedule));
    router.delete('/cron/schedule/:id', (0, middlewares_1.warper)(index_1.deleteCronSchedule));
    // cronjob
    router.post('/cron/index/new', (0, middlewares_1.warper)(index_1.createCronJob));
    router.get('/cron/index', (0, middlewares_1.warper)(index_1.getCronjob));
    router.get('/cron/index/:id', (0, middlewares_1.warper)(index_1.getCronjob_id));
    router.put('/cron/index/:id', (0, middlewares_1.warper)(index_1.updateCronJob));
    // process
    router.post('/cron/run/:id', (0, middlewares_1.warper)(index_1.runCronJobNow));
    router.post('/cron/stop/:id', (0, middlewares_1.warper)(index_1.stopCronJob));
    router.get('/cron/logs/:id', (0, middlewares_1.warper)(index_1.getCronJobLogs));
});
