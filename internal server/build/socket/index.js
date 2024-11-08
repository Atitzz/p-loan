"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketConnected = exports.rooms = void 0;
var path = require("path");
var fs = require("fs");
require("dotenv").config();
exports.rooms = {};
var SocketConnected = function (data) {
    var appsDir = path.join(__dirname, "../apps"); // Adjust this to your apps' directory path
    // Read each app directory inside the apps directory
    fs.readdirSync(appsDir).forEach(function (appDir) {
        var routerPath;
        var isDev = process.env.NODE_ENV === "development";
        // console.log("process.env.ENV:", process.env.ENV)
        var fileExtension = isDev ? ".ts" : ".js"; // Use .ts in development and .js in production
        if (appDir.startsWith(".") || appDir.startsWith("_"))
            return;
        // Check for `${routerPath}.js` pattern
        if (fs.existsSync(path.join(appsDir, appDir, "socket.ts"))) {
            routerPath = path.join(appsDir, appDir, "socket.ts");
            // Dynamically import and attach the router
            var appRouter = require(routerPath).default;
            appRouter(data);
        }
        // Check for `${routerPath}/index.js` pattern
        else {
            var routerFolder_1 = path.join(appsDir, appDir, "socket");
            if (fs.existsSync(routerFolder_1)) {
                fs.readdirSync(routerFolder_1).forEach(function (routerFile) {
                    if (routerFile.startsWith(".") ||
                        routerFile.startsWith("_") ||
                        !routerFile.endsWith(fileExtension))
                        return;
                    routerPath = path.join(routerFolder_1, routerFile);
                    // Dynamically import and attach the router
                    var appRouter = require(routerPath).default;
                    appRouter(data);
                });
            }
        }
    });
};
exports.SocketConnected = SocketConnected;
