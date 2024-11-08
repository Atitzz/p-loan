import { AccessToken, class_checker, isAdmin, warper } from "../../../middlewares";
import { store } from "../controller";
import { Users_KYC } from "../entities";

export default (router) => {
    router.post('/profile/kyc',[class_checker(Users_KYC)],warper(store));
}