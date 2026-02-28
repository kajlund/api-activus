import { asyncHandler } from "./async.js";
import { getAuthUtils } from "../utils/auth.utils.js";
import { UnauthorizedError } from "../utils/api.error.js";

export function getAuthMiddleware(cnf, log) {
  const utilAuth = getAuthUtils(cnf, log);

  return {
    checkRole: (role) => {
      return function (req, res, next) {
        if (req.user?.role === role) return next();
        next(
          new UnauthorizedError(
            `You are not autorized for this route as a user with role ${req.user?.role}`,
          ),
        );
      };
    },
    isAuthenticated: asyncHandler(async (req, _res, next) => {
      // Ensure we have a token or throw unauhtorized error
      const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

      if (!token) throw new UnauthorizedError("Invalid Credentials");

      // Verify JWT or throw unauhtorized error
      const verified = utilAuth.verifyAccessToken(token);
      if (!verified) throw new UnauthorizedError("Invalid Credentials");

      // If verified add user info to request
      req.user = verified;
      next();
    }),
  };
}
