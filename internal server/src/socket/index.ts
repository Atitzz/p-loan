import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import { orm } from "../data-source";

require("dotenv").config();

export let rooms = {};

export const SocketConnected = (data) => {
  const appsDir = path.join(__dirname, "../apps"); // Adjust this to your apps' directory path

  // Read each app directory inside the apps directory
  fs.readdirSync(appsDir).forEach((appDir) => {
    let routerPath;
    const isDev = process.env.NODE_ENV === "development";
    // console.log("process.env.ENV:", process.env.ENV)
    const fileExtension = isDev ? ".ts" : ".js"; // Use .ts in development and .js in production

    if (appDir.startsWith(".") || appDir.startsWith("_")) return;
    // Check for `${routerPath}.js` pattern

    if (fs.existsSync(path.join(appsDir, appDir, "socket.ts"))) {
      routerPath = path.join(appsDir, appDir, "socket.ts");
      // Dynamically import and attach the router
      const appRouter = require(routerPath).default;
      appRouter(data);
    }
    // Check for `${routerPath}/index.js` pattern
    else {
      const routerFolder = path.join(appsDir, appDir, "socket");
      if (fs.existsSync(routerFolder)) {
        fs.readdirSync(routerFolder).forEach((routerFile) => {
          if (
            routerFile.startsWith(".") ||
            routerFile.startsWith("_") ||
            !routerFile.endsWith(fileExtension)
          )
            return;
          routerPath = path.join(routerFolder, routerFile);

          // Dynamically import and attach the router
          const appRouter = require(routerPath).default;
          appRouter(data);
        });
      }
    }
  });
};