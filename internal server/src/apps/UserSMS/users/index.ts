import { class_checker, warper } from "../../../middlewares";
import { loginUsers, register } from "../../Users_Customer/controller/users";
import { resendOTP, verifyOTP, getOTP } from "../controller";
import { VerifyMobile } from "../schema";

export default (router) => {
  // router.get("/users/requestotp/:mobile", warper(getOTP));
  router.post("/users/resendotp", warper(resendOTP));
  router.post("/users/verifyotp", [class_checker(VerifyMobile)],warper(verifyOTP));
};
