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
exports.Route = void 0;
var typeorm_1 = require("typeorm");
var Menu_1 = require("./Menu");
var baseEntity_1 = require("../../../entities/baseEntity");
var Labels_1 = require("./Labels");
var Route = /** @class */ (function (_super) {
    __extends(Route, _super);
    function Route() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: "int", default: -1 }),
        __metadata("design:type", Number)
    ], Route.prototype, "index", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar" }),
        __metadata("design:type", String)
    ], Route.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar" }),
        __metadata("design:type", String)
    ], Route.prototype, "name_th", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return Labels_1.System_labels; }, function (x) { return x.routes; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Route.prototype, "labels", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], Route.prototype, "icon", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Route.prototype, "component", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: ["sidebar", "route"], default: "sidebar" }),
        __metadata("design:type", String)
    ], Route.prototype, "type", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], Route.prototype, "path", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], Route.prototype, "link", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "text" }),
        __metadata("design:type", String)
    ], Route.prototype, "details", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "enum", enum: [true, false], default: false }),
        __metadata("design:type", Boolean)
    ], Route.prototype, "badge", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: "varchar", default: "" }),
        __metadata("design:type", String)
    ], Route.prototype, "badge_param", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return Menu_1.Menu; }, function (x) { return x.route; }, { cascade: true }),
        (0, typeorm_1.JoinTable)(),
        __metadata("design:type", Array)
    ], Route.prototype, "menu", void 0);
    Route = __decorate([
        (0, typeorm_1.Entity)('system_routes')
    ], Route);
    return Route;
}(baseEntity_1.default));
exports.Route = Route;
