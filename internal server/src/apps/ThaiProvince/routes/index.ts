import { class_checker, warper } from "../../../middlewares";
import { district, province, subdistrict } from "../controller";


export default (router) => {
    router.get('/users/province',warper(province));
    router.get('/users/district',warper(district));
    router.get('/users/subdistrict',warper(subdistrict));

    router.get('/admin/province',warper(province));
    router.get('/admin/district',warper(district));
    router.get('/admin/subdistrict',warper(subdistrict));
}