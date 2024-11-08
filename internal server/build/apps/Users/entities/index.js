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
exports.Users = void 0;
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var baseEntity_1 = require("../../../entities/baseEntity");
var entities_1 = require("../../Permission/entities");
var entities_2 = require("../../Roles/entities");
var Users = /** @class */ (function (_super) {
    __extends(Users, _super);
    function Users() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Index)(),
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "line_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "display_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "picture_url", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "titlename", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "firstname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "lastname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "citizen_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "back_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "birthdate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "decimal", precision: 28, scale: 8, default: 0 }),
        __metadata("design:type", Number)
    ], Users.prototype, "salary", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "book", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "bank", void 0);
    __decorate([
        (0, typeorm_1.Index)(),
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "mobile", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "phone", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "houseno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "villageno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "lane", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "road", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "subdistrict", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "district", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "province", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "zipcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "country", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_company_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_houseno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_villageno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_lane", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_road", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_subdistrict", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_district", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_province", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_zipcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "job_country", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", unique: true, nullable: true }),
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], Users.prototype, "username", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.Length)(4, 30),
        __metadata("design:type", String)
    ], Users.prototype, "password", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return entities_1.Permissions; }, function (x) { return x.users; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            eager: true,
            nullable: true
        }),
        __metadata("design:type", entities_1.Permissions)
    ], Users.prototype, "permissions", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return entities_2.Roles; }, function (x) { return x.users; }, {
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
            eager: true,
        }),
        __metadata("design:type", Array)
    ], Users.prototype, "roles", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["unverified", "pending", "verified"],
            default: "unverified",
            comment: "kyc verify",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "kyc", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["unverified", "verified"],
            default: "unverified",
            comment: "email verify",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "ev", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["unverified", "verified"],
            default: "unverified",
            comment: "mobile verify",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "sv", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["true", "false", "enable", "disable"],
            comment: "2fa",
            default: "disable",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "tf", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["true", "false", "enable", "disable"],
            comment: "pin active",
            default: "disable",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "pa", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["true", "false", "enable", "disable"],
            comment: "line active",
            default: "disable",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "la", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 6, nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "pin", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "enum",
            enum: ["active", "banned"],
            comment: "ban",
            default: "active",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "status", void 0);
    __decorate([
        (0, typeorm_1.Column)({
            type: "varchar",
            default: "0.0",
        }),
        __metadata("design:type", String)
    ], Users.prototype, "accept_privacy", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], Users.prototype, "ban_reason", void 0);
    Users = __decorate([
        (0, typeorm_1.Entity)("system_users")
    ], Users);
    return Users;
}(baseEntity_1.default));
exports.Users = Users;
