import { AppDataSource } from "./data-source";
import { config } from "dotenv";
import * as express from "express";
import helmet from "helmet";
import * as compression from "compression";
import * as cors from "cors";
import * as http from "http";
import { Server } from "socket.io";
import router from "./router";
import routerUsers from "./routerUsers";
import routerAdmin from "./routerAdmin";
import {
  AccessToken,
  AccessUsers,
  Catch,
  Custom,
  Error,
  Success,
  errorHandle,
  isAdmin,
} from "./middlewares";
import { SocketConnected } from "./socket";
import { seeder } from "./seeder";
import { logs } from "./Utils";
import { startCronJobs } from "./apps/Cronjob/controller"
// import { stripeWebhook } from "./apps/Deposit/controller/admin_gateway"
import { paymentCalculator } from "./apps/Loan/controller/calurate";
const path = require("path");
config();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
};
export var io;
AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new user into the database...");
    await AppDataSource.manager.query(`SET GLOBAL time_zone = '+07:00';`);
    await AppDataSource.manager.query(`SET time_zone = '+07:00';`);
    const app = express();
    app.use((req, res, next) => {
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
    app.use(helmet());
    app.use(Success);
    app.use(Custom);
    app.use(Error);
    app.use(Catch);
    app.use("/", [logs], router());
    app.use("/users", [AccessUsers, logs], routerUsers());
    app.use(
      "/admin",
      [AccessToken, isAdmin(["admin", "employee"]), logs],
      routerAdmin()
    );
    app.use("*", (req, res) => res.error("404 Not Found"));
    app.use(errorHandle);
    const server = http.createServer();

    io = new Server(server, {
      cors: corsOptions
    });

    io.on("connection", (socket) => {
      console.log("a user connected");
      socket.emit('message','welcome');
      SocketConnected(socket);
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });

    startCronJobs()
    app.listen(process.env.PORT, () => {
      console.log(`Express server is running on port ${process.env.PORT}`);
    });
    server.listen(Number(process.env.PORT)+1, () => {
      console.log(`Socket server listening on port ${Number(process.env.PORT)+1}`);
    });
  })
  .catch((error) => console.log(error))
  .finally(() => {
    seeder();
  });
