"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var middlewares_1 = require("../../../middlewares");
var transaction_1 = require("../controller/transaction");
exports.default = (function (router) {
    router.get('/transactions', (0, middlewares_1.warper)(transaction_1.transactions_user));
});
