import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import httpLogger from "pino-http";

import { getRouter } from "./router.js";
import { getErrorHandler } from "./middleware/error.handler.js";
import { getNotFoundHandler } from "./middleware/notfound.handler.js";

export function getApp(cnf, log) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1); // trust first proxy
  app.use(express.json({ limit: "100kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        if (cnf.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // Set to true for cookies/sessions
    }),
  );

  // Logging Middleware
  if (cnf.logHttp) {
    app.use(httpLogger({ logger: log }));
  }

  // Add API routes
  app.use(getRouter(cnf, log));

  // Add 404 handler
  app.use(getNotFoundHandler());

  // Add Generic Error handler
  app.use(getErrorHandler(log));

  return app;
}
