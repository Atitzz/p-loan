import { AccessToken, class_checker, isAdmin, isApprove, isList, isReject, isShow, isUpdate, warper } from "../../../middlewares";
import { store } from "../controller";
import { Approve, list, Reject, show, update } from "../controller/admin";
import { Users_KYC } from "../entities";

export default (router) => {
    // router.get('/system/users/kyc/:status',[isList], warper(list));
    router.put('/customer/users/kyc/details/:pid',[isUpdate], warper(update));
    router.get('/customer/users/kyc/details/:id',[isShow], warper(show));
    router.post('/customer/users/kyc/approve/:id',[isApprove], warper(Approve));
    router.post('/customer/users/kyc/reject/:id',[isReject], warper(Reject));
}