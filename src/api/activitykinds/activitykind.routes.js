import { getActivityKindsHandler } from "./activitykind.handlers.js";

import { getValidators } from "../../middleware/validators.js";
import { activitykindSchema } from "./activitykind.schemas.js";
import { getAuthMiddleware } from "../../middleware/auth.js";

export function getActivityKindRoutes(cnf, log) {
  const { isAuthenticated, checkRole } = getAuthMiddleware(cnf, log);
  const { validateBody, validateIdParam } = getValidators();
  const requireAdmin = checkRole("ADMIN");
  const hnd = getActivityKindsHandler(cnf, log);

  return {
    group: {
      prefix: "/api/v1/activitykinds",
      middleware: [isAuthenticated],
    },
    routes: [
      {
        method: "get",
        path: "/",
        middleware: [],
        handler: hnd.list,
      },
      {
        method: "get",
        path: "/:id",
        middleware: [validateIdParam],
        handler: hnd.findById,
      },
      {
        method: "post",
        path: "/",
        middleware: [validateBody(activitykindSchema)],
        handler: hnd.create,
      },
      {
        method: "patch",
        path: "/:id",
        middleware: [validateIdParam, validateBody(activitykindSchema)],
        handler: hnd.update,
      },
      {
        method: "delete",
        path: "/:id",
        middleware: [requireAdmin, validateIdParam],
        handler: hnd.destroy,
      },
    ],
  };
}
