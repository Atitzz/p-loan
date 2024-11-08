import {  warper } from "../../../middlewares";
import {
    create_coupons,
    claim_coupon_code,
    use_coupon,
    get_coupon_status,
    delete_coupon
} from "../controller/coupon";


export default (router) => {
    router.post('/create_coupons', warper(create_coupons));
    router.post('/claim_coupon_code', warper(claim_coupon_code));
    router.post('/use_coupon', warper(use_coupon));
    router.get('/coupon_status', warper(get_coupon_status));
    router.delete('/delete_coupon', warper(delete_coupon));
}