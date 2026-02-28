import { activitySchema } from "./activity.schemas.js";
import { getActivityHandler } from "./activity.handlers.js";
import { getAuthMiddleware } from "../../middleware/auth.js";
import { getValidators } from "../../middleware/validators.js";

export function getActivityRoutes(cnf, log) {
  const { isAuthenticated } = getAuthMiddleware(cnf, log);
  const { validateBody, validateIdParam } = getValidators();
  const hnd = getActivityHandler(cnf, log);

  return {
    group: {
      prefix: "/api/v1/activities",
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
        middleware: [validateBody(activitySchema)],
        handler: hnd.create,
      },
      {
        method: "patch",
        path: "/:id",
        middleware: [validateIdParam, validateBody(activitySchema)],
        handler: hnd.update,
      },
      {
        method: "delete",
        path: "/:id",
        middleware: [validateIdParam],
        handler: hnd.destroy,
      },
    ],
  };
}
