import { warper } from "../../../middlewares";
import { manualApprove, manualCharge, manualNotificate, manualReject, manualSlip, store } from "../controller";


export default (router) => {
    router.post('/send_notificate', warper(manualNotificate));
    router.post('/send_slip', warper(manualSlip));
    router.post('/send_charge', warper(manualCharge));
    router.post('/send_reject', warper(manualReject));
    router.post('/send_approve', warper(manualApprove));
    
}