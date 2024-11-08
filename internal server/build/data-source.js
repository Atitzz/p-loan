"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.orm = exports.AppDataSource = void 0;
require("reflect-metadata");
var typeorm_1 = require("typeorm");
require('dotenv').config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: Boolean(Number(((_a = process.env) === null || _a === void 0 ? void 0 : _a.DB_SYNCHRONIZE) || "0")),
    logging: false,
    entities: ["".concat(__dirname, "/apps/**/entities/*.{ts,tsx,js}")],
    migrations: [],
    subscribers: [],
});
var orm = function (entityName) { return exports.AppDataSource.manager.getRepository(entityName); };
exports.orm = orm;
