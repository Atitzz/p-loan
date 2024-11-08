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
exports.LoanContract = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
// รายการยา
var LoanContract = /** @class */ (function (_super) {
    __extends(LoanContract, _super);
    function LoanContract() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ name: "user_id", type: "int" }),
        __metadata("design:type", Number)
    ], LoanContract.prototype, "user_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "loan_id", type: "int" }),
        __metadata("design:type", Number)
    ], LoanContract.prototype, "loan_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], LoanContract.prototype, "installment_start", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
        __metadata("design:type", Date)
    ], LoanContract.prototype, "installment_end", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', comment: 'อากรสแตมป์' }),
        __metadata("design:type", Number)
    ], LoanContract.prototype, "stamp", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', comment: 'เอกสาร คู่ฉบับ/คู่ฉีก' }),
        __metadata("design:type", Number)
    ], LoanContract.prototype, "document", void 0);
    LoanContract = __decorate([
        (0, typeorm_1.Entity)("loan_contract")
    ], LoanContract);
    return LoanContract;
}(baseEntity_1.default));
exports.LoanContract = LoanContract;
