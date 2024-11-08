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
exports.Users_KYC = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var class_validator_1 = require("class-validator");
var Users_KYC = /** @class */ (function (_super) {
    __extends(Users_KYC, _super);
    function Users_KYC() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: "int" }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "user_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "titlename", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "firstname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "lastname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "birthdate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "citizen_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "mobile", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "back_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "decimal", precision: 28, scale: 8, default: 0 }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", Number)
    ], Users_KYC.prototype, "salary", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "longtext", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "imgFront", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "longtext", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "imgBack", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "longtext", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "imgBook", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "book", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "bank", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["pending", "reject", "approve"],
            default: "pending",
        }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "reject_reason", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "houseno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "villageno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "lane", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "road", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "subdistrict", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "district", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "province", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "zipcode", void 0);
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "country", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_company_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_houseno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_villageno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_lane", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_road", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_subdistrict", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_district", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_province", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_zipcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true, default: 'ไทย' }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "job_country", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users_KYC.prototype, "email", void 0);
    Users_KYC = __decorate([
        (0, typeorm_1.Entity)("users_kyc")
    ], Users_KYC);
    return Users_KYC;
}(baseEntity_1.default));
exports.Users_KYC = Users_KYC;
