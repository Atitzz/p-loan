import { class_checker, isAdmin, isStore, isShow, isList, isRemove, isUpdate, warper, isApprove, isReject } from "../../../middlewares";

import {
    addAdvert,
    getAdvert,
    getAdvertId,
    editAdvertId,
    deleteAdvertId
} from '../controller'

import { upload } from "../../../middlewares/multer"

export default (router) => {
    router.post('/advert', [isStore], upload.single('images'), warper(addAdvert));
    router.get('/advert', [isList], warper(getAdvert));
    router.get('/advert/:id', [isList], warper(getAdvertId));
    router.put('/advert/:id', [isUpdate], upload.single('images'), warper(editAdvertId));
    router.delete('/advert/:id', [isRemove], warper(deleteAdvertId));
}