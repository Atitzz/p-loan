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
exports.CronJob = void 0;
var typeorm_1 = require("typeorm");
var baseEntity_1 = require("../../../entities/baseEntity");
var enum_1 = require("../../Utils/enum");
var CronJob = /** @class */ (function (_super) {
    __extends(CronJob, _super);
    function CronJob() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 40, nullable: true }),
        __metadata("design:type", String)
    ], CronJob.prototype, "name", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 40, nullable: true }),
        __metadata("design:type", String)
    ], CronJob.prototype, "alias", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'text', nullable: true }),
        __metadata("design:type", String)
    ], CronJob.prototype, "action", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
        __metadata("design:type", String)
    ], CronJob.prototype, "url", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'int', default: 0 }),
        __metadata("design:type", Number)
    ], CronJob.prototype, "cron_schedule_id", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
        __metadata("design:type", Date)
    ], CronJob.prototype, "next_run", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
        __metadata("design:type", Date)
    ], CronJob.prototype, "last_run", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'enum', enum: enum_1.cron_status, default: enum_1.cron_status.Running }),
        __metadata("design:type", String)
    ], CronJob.prototype, "is_running", void 0);
    __decorate([
        (0, typeorm_1.Column)({ type: 'tinyint', default: 1 }),
        __metadata("design:type", Boolean)
    ], CronJob.prototype, "is_default", void 0);
    CronJob = __decorate([
        (0, typeorm_1.Entity)('cron_jobs')
    ], CronJob);
    return CronJob;
}(baseEntity_1.default));
exports.CronJob = CronJob;
