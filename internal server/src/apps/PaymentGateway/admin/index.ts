import { class_checker, isAdmin, isStore, isShow, isList, isRemove, isUpdate, warper, isApprove, isReject } from "../../../middlewares";

import { get_paymentDetail } from "../controller/paymentdetail";

export default (router) => {
    router.get('/report/payment', [isList], warper(get_paymentDetail));
}