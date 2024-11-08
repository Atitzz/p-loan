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
exports.Loan = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var enum_1 = require("../../Utils/enum");
var Loan = /** @class */ (function (_super) {
    __extends(Loan, _super);
    function Loan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 40, nullable: true }),
        __metadata("design:type", String)
    ], Loan.prototype, "loan_number", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
        __metadata("design:type", String)
    ], Loan.prototype, "reference", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
        __metadata("design:type", Number)
    ], Loan.prototype, "user_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
        __metadata("design:type", Number)
    ], Loan.prototype, "plan_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: 'เลือกวันเริ่มชำระ' }),
        __metadata("design:type", Date)
    ], Loan.prototype, "startDate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: 'วันสิ้นสุดการชำระ' }),
        __metadata("design:type", Date)
    ], Loan.prototype, "endDate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: 'วันเริ่มนับกำหนดชำระ' }),
        __metadata("design:type", Date)
    ], Loan.prototype, "installment_start", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: 'กำหนดชำระ' }),
        __metadata("design:type", Date)
    ], Loan.prototype, "installment_due", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "amount", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "per_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', nullable: true, comment: 'Date' }),
        __metadata("design:type", Number)
    ], Loan.prototype, "day_tricker", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 15 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "delay_value", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "charge_per_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "delay_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "given_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "total_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
        __metadata("design:type", String)
    ], Loan.prototype, "application_form", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], Loan.prototype, "admin_feedback", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: enum_1.loan_status, default: enum_1.loan_status.Pending }),
        __metadata("design:type", String)
    ], Loan.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Loan.prototype, "due_notification_sent", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Loan.prototype, "approved_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Loan.prototype, "admin_approve", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ที่ต้องจ่ายทั้งหมด' }),
        __metadata("design:type", Number)
    ], Loan.prototype, "receivable", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ที่จ่ายมาแล้วทั้งหมด' }),
        __metadata("design:type", Number)
    ], Loan.prototype, "total_paid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ยอดคงเหลือ' }),
        __metadata("design:type", Number)
    ], Loan.prototype, "remaining", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินต้น' }),
        __metadata("design:type", Number)
    ], Loan.prototype, "principle", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ย' }),
        __metadata("design:type", Number)
    ], Loan.prototype, "interest", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ยอดค้าง' }),
        __metadata("design:type", Number)
    ], Loan.prototype, "overdue_balance", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', nullable: true }),
        __metadata("design:type", Number)
    ], Loan.prototype, "days", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Loan.prototype, "closed_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date', nullable: true, comment: 'แจ้งเตือนล่าสุด' }),
        __metadata("design:type", Date)
    ], Loan.prototype, "last_alert_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Loan.prototype, "reject_reason", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 1 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "loan_ducument", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', nullable: true, default: 1 }),
        __metadata("design:type", Number)
    ], Loan.prototype, "loan_ducument_max", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Loan.prototype, "guarantee", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', nullable: true, default: null, comment: "ดอกเบี้ยของแต่ละสินเชื่อ" }),
        __metadata("design:type", Number)
    ], Loan.prototype, "loan_interest", void 0);
    Loan = __decorate([
        (0, typeorm_1.Entity)('loan')
    ], Loan);
    return Loan;
}(baseEntity_1.default));
exports.Loan = Loan;
