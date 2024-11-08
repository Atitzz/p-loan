"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.LoanPlan = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var enum_1 = require("../../Utils/enum");
var LoanPlan = /** @class */ (function (_super) {
    __extends(LoanPlan, _super);
    function LoanPlan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "images", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "form_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "description", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "minimum_amount", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "maximum_amount", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0.00, comment: '%' }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "per_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0, comment: 'ค่าปรับ' }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "application_fixed_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0, comment: 'ค่าธรรมเนียม' }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "application_percent_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "instruction", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 15 }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "delay_value", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าทวงถาม1' }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "fixed_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าทวงถาม2' }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "fixed_charge2", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "percent_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: enum_1.status, default: enum_1.status.Enable }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'json', nullable: false }),
        __metadata("design:type", Array)
    ], LoanPlan.prototype, "rate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 2000.00000000 }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "stamp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], LoanPlan.prototype, "document", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: ['is_guarantee', 'not_guarantee'], default: 'not_guarantee', comment: 'มีหลักประกันหรือไม่' }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "is_guarantee", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: ['flatrate', 'effectiverate'], nullable: true, default: null, comment: 'ประเภทดอกเบี้ย' }),
        __metadata("design:type", String)
    ], LoanPlan.prototype, "type_interest", void 0);
    LoanPlan = __decorate([
        (0, typeorm_1.Entity)('loan_plan')
    ], LoanPlan);
    return LoanPlan;
}(baseEntity_1.default));
exports.LoanPlan = LoanPlan;
