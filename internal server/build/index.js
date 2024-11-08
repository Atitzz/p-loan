"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
var data_source_1 = require("./data-source");
var dotenv_1 = require("dotenv");
var express = require("express");
var helmet_1 = require("helmet");
var compression = require("compression");
var cors = require("cors");
var http = require("http");
var socket_io_1 = require("socket.io");
var router_1 = require("./router");
var routerUsers_1 = require("./routerUsers");
var routerAdmin_1 = require("./routerAdmin");
var middlewares_1 = require("./middlewares");
var socket_1 = require("./socket");
var seeder_1 = require("./seeder");
var Utils_1 = require("./Utils");
var controller_1 = require("./apps/Cronjob/controller");
var path = require("path");
(0, dotenv_1.config)();
var corsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
};
data_source_1.AppDataSource.initialize()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, server;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Inserting a new user into the database...");
                return [4 /*yield*/, data_source_1.AppDataSource.manager.query("SET GLOBAL time_zone = '+07:00';")];
            case 1:
                _a.sent();
                return [4 /*yield*/, data_source_1.AppDataSource.manager.query("SET time_zone = '+07:00';")];
            case 2:
                _a.sent();
                app = express();
                app.use(function (req, res, next) {
                    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
                    next();
                });
                // ปิงเพิ่มเพื่อใช้ webhook stripe (ลองไปเพิ่มใน routes แล้วไม่ได้)
                // app.use("/admin/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);
                app.use(cors(corsOptions));
                app.use(compression());
                app.use(express.json({ limit: "10mb" }));
                app.use(express.urlencoded({ extended: true, limit: "10mb" }));
                app.use("/admin/file", express.static(path.join(__dirname, "uploads")));
                app.use("/admin/public", express.static(path.join(__dirname, "public")));
                app.use("/users/file", express.static(path.join(__dirname, "uploads")));
                app.use("/users/public", express.static(path.join(__dirname, "public")));
                app.use((0, helmet_1.default)());
                app.use(middlewares_1.Success);
                app.use(middlewares_1.Custom);
                app.use(middlewares_1.Error);
                app.use(middlewares_1.Catch);
                app.use("/", [Utils_1.logs], (0, router_1.default)());
                app.use("/users", [middlewares_1.AccessUsers, Utils_1.logs], (0, routerUsers_1.default)());
                app.use("/admin", [middlewares_1.AccessToken, (0, middlewares_1.isAdmin)(["admin", "employee"]), Utils_1.logs], (0, routerAdmin_1.default)());
                app.use("*", function (req, res) { return res.error("404 Not Found"); });
                app.use(middlewares_1.errorHandle);
                server = http.createServer();
                exports.io = new socket_io_1.Server(server, {
                    cors: corsOptions
                });
                exports.io.on("connection", function (socket) {
                    console.log("a user connected");
                    socket.emit('message', 'welcome');
                    (0, socket_1.SocketConnected)(socket);
                    socket.on("disconnect", function () {
                        console.log("user disconnected");
                    });
                });
                (0, controller_1.startCronJobs)();
                app.listen(process.env.PORT, function () {
                    console.log("Express server is running on port ".concat(process.env.PORT));
                });
                server.listen(Number(process.env.PORT) + 1, function () {
                    console.log("Socket server listening on port ".concat(Number(process.env.PORT) + 1));
                });
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (error) { return console.log(error); })
    .finally(function () {
    (0, seeder_1.seeder)();
});
