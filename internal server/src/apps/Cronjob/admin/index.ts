import { warper } from "../../../middlewares";
import {
    createCronSchedule,
    getCronSchedule,
    getCronSchedule_id,
    updateCronSchedule,
    deleteCronSchedule,
    getCronjob,
    createCronJob,
    getCronjob_id,
    updateCronJob,
    runCronJobNow,
    stopCronJob,
    getCronJobLogs
} from "../controller/index";


export default (router) => {
    // schedule
    router.post('/cron/schedule', warper(createCronSchedule));
    router.get('/cron/schedule', warper(getCronSchedule));
    router.get('/cron/schedule/:id', warper(getCronSchedule_id));
    router.put('/cron/schedule/:id', warper(updateCronSchedule));
    router.delete('/cron/schedule/:id', warper(deleteCronSchedule));

    // cronjob
    router.post('/cron/index/new', warper(createCronJob));
    router.get('/cron/index', warper(getCronjob));
    router.get('/cron/index/:id', warper(getCronjob_id));
    router.put('/cron/index/:id', warper(updateCronJob));

    // process
    router.post('/cron/run/:id', warper(runCronJobNow));
    router.post('/cron/stop/:id', warper(stopCronJob));
    router.get('/cron/logs/:id', warper(getCronJobLogs));
}