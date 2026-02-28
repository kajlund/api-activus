import { ApiResponse } from "../../utils/api.response.js";
import { asyncHandler } from "../../middleware/async.js";
import { codes } from "../../utils/status.js";

export function getAuthHandler(cnf, _log) {
  return {
    getSessionInfo: asyncHandler(async (req, res) => {
      res.json(new ApiResponse(codes.OK, req.user, `User info`));
    }),
    logon: asyncHandler(async (req, res) => {
      const { payload } = req.locals;
      const response = await fetch(`${cnf.authUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        return res
          .status(response.status)
          .json(new ApiResponse(response.status, null, data.message || "Login failed"));
      }
      // Set token in cookie
      const token = data.data.accessToken;
      res.cookie("token", token, { httpOnly: true, secure: true });
      res.json(new ApiResponse(codes.OK, { token }, "Login successful"));
    }),
    logoff: asyncHandler(async (req, res) => {
      res.clearCookie("token", {
        domain: cnf.isProd ? ".kajlund.com" : "localhost",
        path: "/",
      });
      res.json(new ApiResponse(codes.OK, null, "Logged out successfully"));
    }),
  };
}
