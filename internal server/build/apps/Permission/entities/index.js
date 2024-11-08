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
exports.Permissions = void 0;
var typeorm_1 = require("typeorm");
var Menu_1 = require("../../Sidebars/entities/Menu");
var entities_1 = require("../../Users/entities");
var baseEntity_1 = require("../../../entities/baseEntity");
var Permissions = /** @class */ (function (_super) {
    __extends(Permissions, _super);
    function Permissions() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", unique: true }),
        __metadata("design:type", String)
    ], Permissions.prototype, "key", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", unique: true }),
        __metadata("design:type", String)
    ], Permissions.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return entities_1.Users; }, function (x) { return x.permissions; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Permissions.prototype, "users", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return Menu_1.Menu; }, function (x) { return x.permissions; }, { cascade: true }),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", Array)
    ], Permissions.prototype, "menus", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "approve", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "reject", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "show", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: true }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "list", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "store", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "update", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "remove", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Permissions.prototype, "manage_users", void 0);
    Permissions = __decorate([
        (0, typeorm_1.Entity)("system_permissions")
    ], Permissions);
    return Permissions;
}(baseEntity_1.default));
exports.Permissions = Permissions;
