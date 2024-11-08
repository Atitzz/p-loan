import { class_checker, usePIN, warper } from "../../../middlewares";
import { acceptPrivacy, changePasswords, current, loginUsers, register, setPassword, setPIN, verifyPIN } from "../controller/users";
import { CheckChangePassword, CheckSetPassword, CheckSetPIN } from "../schema";

export default (router) => {
    router.get('/current', warper(current));
    router.post('/update/password', [class_checker(CheckChangePassword)],warper(changePasswords));
    router.post('/set/password',[class_checker(CheckSetPassword),usePIN],warper(setPassword));
    router.post('/set/pin',[class_checker(CheckSetPIN)],warper(setPIN));
    router.post('/verify/pin',warper(verifyPIN));
    router.post('/accept/privacy', warper(acceptPrivacy));
}