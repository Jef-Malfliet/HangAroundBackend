import "./config/environment";
import http, { Server } from "http";
import express, { Express, Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connect from "./database/index";
import activityRouter from "./services/activityService";
import personRouter from "./services/personService";

const startServer = async () => {
  try {
    await connect();
    const app: Express = express();
    const routes = Router();

    app.use(bodyParser.json());
    app.use(routes);
    app.use(cors({ origin: true }));
    app.options("*", cors());

    routes.use(function(req, res, next) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      next();
    });

    routes.get("/", (req, res) => res.send("OK"));
    // use routers from services
    routes.use("/", activityRouter);
    routes.use("/", personRouter);
    const httpServer: Server = http.createServer(app);
    httpServer.listen(process.env.PORT, async () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
    });
    const shutdown = async () => {
      await new Promise(resolve => httpServer.close(() => resolve()));
      await mongoose.disconnect();
      if (process.env.NODE_ENV === "test") return;
      process.exit(0);
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    process.on("SIGQUIT", shutdown);
  } catch (e) {
    console.log(e);
  }
};

startServer();
