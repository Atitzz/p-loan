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
exports.System_labels = void 0;
var typeorm_1 = require("typeorm");
var Route_1 = require("./Route");
var baseEntity_1 = require("../../../entities/baseEntity");
var Menu_1 = require("./Menu");
var System_labels = /** @class */ (function (_super) {
    __extends(System_labels, _super);
    function System_labels() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", unique: true }),
        __metadata("design:type", String)
    ], System_labels.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar" }),
        __metadata("design:type", String)
    ], System_labels.prototype, "lang", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Menu_1.Menu; }, function (x) { return x.labels; }, { onUpdate: "CASCADE", onDelete: "CASCADE", eager: true }),
        __metadata("design:type", String)
    ], System_labels.prototype, "menus", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return Route_1.Route; }, function (x) { return x.labels; }, { onUpdate: "CASCADE", onDelete: "CASCADE", eager: true }),
        __metadata("design:type", String)
    ], System_labels.prototype, "routes", void 0);
    System_labels = __decorate([
        (0, typeorm_1.Entity)('system_labels')
    ], System_labels);
    return System_labels;
}(baseEntity_1.default));
exports.System_labels = System_labels;
