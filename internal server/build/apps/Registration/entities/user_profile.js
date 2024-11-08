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
exports.User_profile = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var User_profile = /** @class */ (function (_super) {
    __extends(User_profile, _super);
    function User_profile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], User_profile.prototype, "fullname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "title", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "firstname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "lastname", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "ไทย" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "group", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "citizenid", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "date", nullable: true }),
        __metadata("design:type", Date)
    ], User_profile.prototype, "birthdate", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", length: 50, default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "tel", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "สัญชาติ" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nationality", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "เชื้อชาติ" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "ethnicity", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "ศาสนา" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "religion", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "ไม่ระบุ" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "address", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "houseno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "lane", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "province", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "road", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "district", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "subdistrict", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "villageNo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "zipcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "country", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nhouseno", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nvillageNo", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nlane", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nprovince", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nroad", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nsubdistrict", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "ndistrict", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "nzipcode", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "ncountry", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "ไม่ระบุ" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "sex", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "ไม่ระบุ" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "blood_type", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "ไม่ระบุ" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "relation", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "int", default: 0 }),
        __metadata("design:type", Number)
    ], User_profile.prototype, "child", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], User_profile.prototype, "etc", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "email", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "phone", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "job", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "jobphone", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text", nullable: true }),
        __metadata("design:type", String)
    ], User_profile.prototype, "jobaddress", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "timecontact", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "oncontact", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "er_contract", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "er_tel", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], User_profile.prototype, "er_relation", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'date' }),
        __metadata("design:type", Date)
    ], User_profile.prototype, "registered_at", void 0);
    User_profile = __decorate([
        (0, typeorm_1.Entity)("user_profile")
    ], User_profile);
    return User_profile;
}(baseEntity_1.default));
exports.User_profile = User_profile;
