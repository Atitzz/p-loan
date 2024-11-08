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
exports.LoanContractNonUser = void 0;
var baseEntity_1 = require("../../../entities/baseEntity");
var typeorm_1 = require("typeorm");
// รายการยา
var LoanContractNonUser = /** @class */ (function (_super) {
    __extends(LoanContractNonUser, _super);
    function LoanContractNonUser() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "amount", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "firstname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "birthdate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "mobile", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "job", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "objective", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "income", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "lastname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "sex", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "country", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "email2", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "job_company_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "job_address", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], LoanContractNonUser.prototype, "loan_plan", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: [0, 1], default: 0 }),
        __metadata("design:type", Number)
    ], LoanContractNonUser.prototype, "is_read", void 0);
    LoanContractNonUser = __decorate([
        (0, typeorm_1.Entity)("loan_contract_non_user")
    ], LoanContractNonUser);
    return LoanContractNonUser;
}(baseEntity_1.default));
exports.LoanContractNonUser = LoanContractNonUser;
