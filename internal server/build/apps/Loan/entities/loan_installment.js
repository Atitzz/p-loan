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
exports.Installment = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var Installment = /** @class */ (function (_super) {
    __extends(Installment, _super);
    function Installment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
        __metadata("design:type", Number)
    ], Installment.prototype, "plan_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
        __metadata("design:type", Number)
    ], Installment.prototype, "loan_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', unsigned: true }),
        __metadata("design:type", Number)
    ], Installment.prototype, "user_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Installment.prototype, "qrcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Installment.prototype, "barcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Installment.prototype, "loan_number", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Installment.prototype, "delay_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Installment.prototype, "start_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Installment.prototype, "installment_date", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000 }),
        __metadata("design:type", Number)
    ], Installment.prototype, "amount", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: "ยอดหนี้คงเหลือทั้งหมด" }),
        __metadata("design:type", Number)
    ], Installment.prototype, "outstanding_balance", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: "เงินต้นคงเหลือ" }),
        __metadata("design:type", Number)
    ], Installment.prototype, "remaining", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: ['โอน', 'เงินสด'], default: 'โอน' }),
        __metadata("design:type", String)
    ], Installment.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], Installment.prototype, "given_at", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', nullable: true }),
        __metadata("design:type", Number)
    ], Installment.prototype, "delay_days", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 1 }),
        __metadata("design:type", Number)
    ], Installment.prototype, "installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 1 }),
        __metadata("design:type", Number)
    ], Installment.prototype, "total_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'boolean', default: false, comment: 'งวดนี้จ่ายแล้วหรือยัง' }),
        __metadata("design:type", Boolean)
    ], Installment.prototype, "isPaid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ยอดที่จ่ายในงวดนี้' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "paid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ยอดที่ต้องชำระ' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "per_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'เงินต้นที่ต้องชำระในงวดนี้' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "principle_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ดอกเบี้ยที่ต้องชำระในงวดนี้' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "interest_installment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'จ่ายค่าปรับเท่าไปเท่าไหร่' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "delay_charge_paid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'จ่ายดอกเบี้ยไปเท่าไหร่' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "interest_paid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'จ่ายเงินต้นไปเท่าไหร่' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "principle_paid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, unsigned: true, default: 0.00000000, comment: 'ยอดค้าง' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "overdue_balance", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'boolean', default: false, comment: 'จ่ายเต็มจำนวนยอดต่อเดือนหรือไม่' }),
        __metadata("design:type", Boolean)
    ], Installment.prototype, "paidFull", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Installment.prototype, "paid_by", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ค่าธรรมเนียม' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "application_charge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินสด' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "cash", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'เงินโอน' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "transfer_payment", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'longtext', nullable: true }),
        __metadata("design:type", String)
    ], Installment.prototype, "image", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ยแต่ละเดือน' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "interest_due", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ยคงเหลือทั้งหมด' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "total_interest", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', nullable: true, precision: 28, scale: 8, default: 0.00000000, comment: 'เงินต้นที่ต้องจ่ายงวดถัดไป' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "principle_next_due", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', nullable: true, precision: 28, scale: 8, default: 0.00000000, comment: 'ดอกเบี้ยที่ต้องจ่ายงวดถัดไป' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "interest_next_due", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', nullable: true, precision: 28, scale: 8, default: 0.00000000, comment: 'ยอดรวมที่ต้องจ่ายงวดถัดไป' }),
        __metadata("design:type", Number)
    ], Installment.prototype, "total_amount_next_due", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, comment: 'วันชำระงวดถัดไป' }),
        __metadata("design:type", Date)
    ], Installment.prototype, "installment_next_due", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Installment.prototype, "receipt_number", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'decimal', precision: 28, scale: 8, default: 0.00000000, comment: "เงินต้นคงเหลือ" }),
        __metadata("design:type", Number)
    ], Installment.prototype, "principle", void 0);
    Installment = __decorate([
        (0, typeorm_1.Entity)('loan_installment')
    ], Installment);
    return Installment;
}(baseEntity_1.default));
exports.Installment = Installment;
