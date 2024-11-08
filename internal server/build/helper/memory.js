"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memories = {};
exports.default = {
    getMemory: function (key) { return memories[key]; },
    setMemory: function (key, value, expiry) {
        memories[key] = value;
        if (expiry) {
            setTimeout(function () {
                console.log("[message] auto delete cache ".concat(key));
                delete memories[key];
            }, expiry);
        }
    },
    remove: function (key) { delete memories[key]; },
};
