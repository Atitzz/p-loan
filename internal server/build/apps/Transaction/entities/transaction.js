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
exports.Transaction = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var Transaction = /** @class */ (function (_super) {
    __extends(Transaction, _super);
    function Transaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "user_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "loan_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
        __metadata("design:type", String)
    ], Transaction.prototype, "plan", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
        __metadata("design:type", String)
    ], Transaction.prototype, "loan_number", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "installment_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "amount", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Transaction.prototype, "installment_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Transaction.prototype, "given_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "paid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "given_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "total_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "delay_days", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "delay_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าปรับ' }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "application_fixed_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าธรรมเนียม' }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "application_percent_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "receivable", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "total_paid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "remaining", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ตัดเงินต้นเท่าไหร่' }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "principle", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ตัดดอกเบี้ยเท่าไหร่' }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "interest", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค้างชำระ' }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "overdue_balance", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', nullable: true }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "days", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินสด' }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "cash", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินโอน' }),
        __metadata("design:type", Number)
    ], Transaction.prototype, "transfer_payment", void 0);
    Transaction = __decorate([
        (0, typeorm_1.Entity)({ name: 'loan_transaction' })
    ], Transaction);
    return Transaction;
}(baseEntity_1.default));
exports.Transaction = Transaction;
