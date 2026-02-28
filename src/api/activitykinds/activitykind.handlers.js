import { ApiResponse } from "../../utils/api.response.js";
import { asyncHandler } from "../../middleware/async.js";
import { getActivitykindService } from "./activitykind.service.js";
import { codes } from "../../utils/status.js";

export function getActivityKindsHandler(cnf, log) {
  const svc = getActivitykindService(cnf, log);

  return {
    create: asyncHandler(async (req, res) => {
      const { payload } = req.locals;
      const data = await svc.create(payload);
      res.json(new ApiResponse(codes.CREATED, data, `Created activitykind`));
    }),
    destroy: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const data = await svc.destroy(id);
      res.json(new ApiResponse(codes.OK, data, `Deleted activitykind with ID ${id}`));
    }),
    findById: asyncHandler(async (req, res) => {
      const { id } = req.locals;
      const data = await svc.findById(id);
      res.json(new ApiResponse(codes.OK, data, `Found activitykind with ID ${id}`));
    }),
    list: asyncHandler(async (req, res) => {
      const data = await svc.query();
      res.json(new ApiResponse(codes.OK, data, `Found ${data.length} activitykinds`));
    }),
    update: asyncHandler(async (req, res) => {
      const { id, payload } = req.locals;
      const data = await svc.update(id, payload);
      res.json(new ApiResponse(codes.OK, data, `Updated activitykind with ID ${id}`));
    }),
  };
}
