import { getActivitiesDAO } from "./activity.dao.js";
import { InternalServerError, NotFoundError } from "../../utils/api.error.js";

export const getActivityService = (cnf, log) => {
  const dao = getActivitiesDAO(log);

  return {
    create: async (data) => {
      const created = await dao.create(data);
      if (!created) throw new InternalServerError("Failed trying to create Activity");
      return created;
    },
    destroy: async (id) => {
      const deleted = await dao.deleteById(id);
      if (!deleted) throw new InternalServerError(`Failed deleting Activity with id ${id}`);
      return deleted;
    },
    findById: async (id) => {
      const found = await dao.findById(id);
      if (!found) throw new NotFoundError(`Activity with id ${id} not found`);
      return found;
    },
    query: async () => {
      const data = await dao.query();
      return data;
    },
    update: async (id, data) => {
      const updated = await dao.updateById(id, data);
      if (!updated) throw new InternalServerError(`Failed updating Activity with id ${id}`);
      return updated;
    },
  };
};
