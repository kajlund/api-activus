import { getAuthMiddleware } from "../../middleware/auth.js";
import { getAuthHandler } from "./auth.handlers.js";
import { loginSchema } from "./auth.schemas.js";
import { getValidators } from "../../middleware/validators.js";

export function getAuthRoutes(cnf, log) {
  const { isAuthenticated } = getAuthMiddleware(cnf, log);
  const { validateBody } = getValidators();
  const hnd = getAuthHandler(cnf, log);

  return {
    group: {
      prefix: "/api/v1/auth",
      middleware: [],
    },
    routes: [
      {
        method: "get",
        path: "/",
        middleware: [isAuthenticated],
        handler: hnd.getSessionInfo,
      },
      {
        method: "post",
        path: "/",
        middleware: [validateBody(loginSchema)],
        handler: hnd.logon,
      },
      {
        method: "get",
        path: "/logout",
        middleware: [isAuthenticated],
        handler: hnd.logoff,
      },
    ],
  };
}
