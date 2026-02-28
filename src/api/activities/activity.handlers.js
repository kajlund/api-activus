import { ApiResponse } from "../../utils/api.response.js";
import { asyncHandler } from "../../middleware/async.js";
import { getActivityService } from "./activity.service.js";
import { codes } from "../../utils/status.js";

export function getActivityHandler(cnf, log) {
  const svc = getActivityService(cnf, log);

  return {
    create: asyncHandler(async (req, res) => {
      const { payload } = req.locals;
      const data = await svc.create(payload);
      res.json(new ApiResponse(codes.CREATED, data, `Created activity`));
    }),
    destroy: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const data = await svc.destroy(id);
      res.json(new ApiResponse(codes.OK, data, `Deleted activity with ID ${id}`));
    }),
    findById: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const data = await svc.findById(id);
      res.json(new ApiResponse(codes.OK, data, `Found activity with ID ${id}`));
    }),
    list: asyncHandler(async (req, res) => {
      const data = await svc.query();
      res.json(new ApiResponse(codes.OK, data, `Found ${data.length} activities`));
    }),
    update: asyncHandler(async (req, res) => {
      const { id, payload } = req.locals;
      const data = await svc.update(id, payload);
      res.json(new ApiResponse(codes.OK, data, `Updated activity with ID ${id}`));
    }),
  };
}
