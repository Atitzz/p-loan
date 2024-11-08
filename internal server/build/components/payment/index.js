"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pillComponent = void 0;
var pillComponent = function (__amount, __rate, installment) {
    var __diff = __amount * __rate;
    var __pill = Math.pow(1 + __rate, installment);
    var __diff2 = __diff * __pill;
    var __pill2 = __pill - 1;
    return Math.round((__diff2 / __pill2 + Number.EPSILON) * 100) / 100;
};
exports.pillComponent = pillComponent;
