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
exports.Application_Form = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var enum_1 = require("../../Utils/enum");
var Application_Form = /** @class */ (function (_super) {
    __extends(Application_Form, _super);
    function Application_Form() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Application_Form.prototype, "plan_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Application_Form.prototype, "index", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
        __metadata("design:type", String)
    ], Application_Form.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 20 }),
        __metadata("design:type", String)
    ], Application_Form.prototype, "field_name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: enum_1.type_option, default: enum_1.type_option.required }),
        __metadata("design:type", String)
    ], Application_Form.prototype, "is_required", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
        __metadata("design:type", String)
    ], Application_Form.prototype, "label", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'json', nullable: true }),
        __metadata("design:type", Array)
    ], Application_Form.prototype, "options", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], Application_Form.prototype, "width", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
        __metadata("design:type", String)
    ], Application_Form.prototype, "instruction", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'json', nullable: true }),
        __metadata("design:type", Array)
    ], Application_Form.prototype, "extensions", void 0);
    Application_Form = __decorate([
        (0, typeorm_1.Entity)('loan_applicationform')
    ], Application_Form);
    return Application_Form;
}(baseEntity_1.default));
exports.Application_Form = Application_Form;
