"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCreateUser = exports.AdminUpdate = exports.Login = exports.CheckSetPIN = exports.CheckSetPassword = exports.CheckChangePassword = exports.Register = void 0;
var class_validator_1 = require("class-validator");
var Register = /** @class */ (function () {
    function Register() {
    }
    __decorate([
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], Register.prototype, "password", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Register.prototype, "mobile", void 0);
    return Register;
}());
exports.Register = Register;
var CheckChangePassword = /** @class */ (function () {
    function CheckChangePassword() {
    }
    __decorate([
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], CheckChangePassword.prototype, "password", void 0);
    __decorate([
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], CheckChangePassword.prototype, "newPassword", void 0);
    return CheckChangePassword;
}());
exports.CheckChangePassword = CheckChangePassword;
var CheckSetPassword = /** @class */ (function () {
    function CheckSetPassword() {
    }
    __decorate([
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], CheckSetPassword.prototype, "password", void 0);
    return CheckSetPassword;
}());
exports.CheckSetPassword = CheckSetPassword;
var CheckSetPIN = /** @class */ (function () {
    function CheckSetPIN() {
    }
    __decorate([
        (0, class_validator_1.Length)(6, 6),
        __metadata("design:type", String)
    ], CheckSetPIN.prototype, "pin", void 0);
    return CheckSetPIN;
}());
exports.CheckSetPIN = CheckSetPIN;
var Login = /** @class */ (function () {
    function Login() {
    }
    __decorate([
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], Login.prototype, "mobile", void 0);
    __decorate([
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], Login.prototype, "password", void 0);
    return Login;
}());
exports.Login = Login;
var AdminUpdate = /** @class */ (function () {
    function AdminUpdate() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], AdminUpdate.prototype, "id", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminUpdate.prototype, "firstname", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminUpdate.prototype, "lastname", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminUpdate.prototype, "mobile", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminUpdate.prototype, "address", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminUpdate.prototype, "country", void 0);
    return AdminUpdate;
}());
exports.AdminUpdate = AdminUpdate;
var AdminCreateUser = /** @class */ (function () {
    function AdminCreateUser() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "imgFront", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "imgBack", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "imgBook", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "titlename", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "firstname", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "lastname", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "mobile", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "salary", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], AdminCreateUser.prototype, "job", void 0);
    return AdminCreateUser;
}());
exports.AdminCreateUser = AdminCreateUser;
