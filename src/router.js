import express from "express";

import { getActivityKindRoutes } from "./api/activitykinds/activitykind.routes.js";
import { getAuthRoutes } from "./api/auth/auth.routes.js";

export function getRouter(cnf, log) {
  const sharedRoutes = {
    group: {
      prefix: "",
      middleware: [],
    },
    routes: [
      {
        method: "get",
        path: "/health",
        middleware: [],
        handler: (_req, res) => {
          res.json({ status: "ok" });
        },
      },
    ],
  };

  const kindRoutes = getActivityKindRoutes(cnf, log);
  const authRoutes = getAuthRoutes(cnf, log);
  const routeGroups = [sharedRoutes, kindRoutes, authRoutes];

  const router = express.Router();

  routeGroups.forEach(({ group, routes }) => {
    routes.forEach(({ method, path, middleware = [], handler }) => {
      log.info(`Route: ${method} ${group.prefix}${path}`);
      router[method](group.prefix + path, [...(group.middleware || []), ...middleware], handler);
    });
  });

  // Example route
  router.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return router;
}
