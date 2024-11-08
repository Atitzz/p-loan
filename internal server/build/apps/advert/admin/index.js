"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var controller_1 = require("../controller");
var multer_1 = require("../../../middlewares/multer");
exports.default = (function (router) {
    router.post('/advert', [middlewares_1.isStore], multer_1.upload.single('images'), (0, middlewares_1.warper)(controller_1.addAdvert));
    router.get('/advert', [middlewares_1.isList], (0, middlewares_1.warper)(controller_1.getAdvert));
    router.get('/advert/:id', [middlewares_1.isList], (0, middlewares_1.warper)(controller_1.getAdvertId));
    router.put('/advert/:id', [middlewares_1.isUpdate], multer_1.upload.single('images'), (0, middlewares_1.warper)(controller_1.editAdvertId));
    router.delete('/advert/:id', [middlewares_1.isRemove], (0, middlewares_1.warper)(controller_1.deleteAdvertId));
});
