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
exports.createLoanPlan = exports.Payment = exports.takeLoan = void 0;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var takeLoan = /** @class */ (function () {
    function takeLoan() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], takeLoan.prototype, "user_id", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], takeLoan.prototype, "plan_id", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        __metadata("design:type", Number)
    ], takeLoan.prototype, "amount", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        __metadata("design:type", Number)
    ], takeLoan.prototype, "installment", void 0);
    __decorate([
        (0, class_validator_1.IsDate)(),
        (0, class_transformer_1.Type)(function () { return Date; }),
        __metadata("design:type", Date)
    ], takeLoan.prototype, "startDate", void 0);
    __decorate([
        (0, class_validator_1.IsDate)(),
        (0, class_transformer_1.Type)(function () { return Date; }),
        __metadata("design:type", Date)
    ], takeLoan.prototype, "createDate", void 0);
    __decorate([
        (0, class_validator_1.IsObject)(),
        __metadata("design:type", String)
    ], takeLoan.prototype, "appForm", void 0);
    return takeLoan;
}());
exports.takeLoan = takeLoan;
var Payment = /** @class */ (function () {
    function Payment() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], Payment.prototype, "loan_id", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Payment.prototype, "type", void 0);
    __decorate([
        (0, class_validator_1.IsNumber)(),
        __metadata("design:type", Number)
    ], Payment.prototype, "paidAmount", void 0);
    __decorate([
        (0, class_validator_1.IsDate)(),
        (0, class_transformer_1.Type)(function () { return Date; }),
        __metadata("design:type", Date)
    ], Payment.prototype, "paymentDate", void 0);
    return Payment;
}());
exports.Payment = Payment;
var createLoanPlan = /** @class */ (function () {
    function createLoanPlan() {
    }
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], createLoanPlan.prototype, "name", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], createLoanPlan.prototype, "title", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], createLoanPlan.prototype, "minimum_amount", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], createLoanPlan.prototype, "maximum_amount", void 0);
    return createLoanPlan;
}());
exports.createLoanPlan = createLoanPlan;
