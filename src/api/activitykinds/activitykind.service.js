import { getActivityKindDAO } from "./activitykind.dao.js";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '../../utils/api.error.js';

export const getActivitykindService = (cnf, log) => {
  const dao = getActivityKindDAO(log);

  return {
    create: async (data) => {
      const existing = await dao.findByName(data.name);
      if (existing)
        throw new ConflictError(`ActivityKind with name ${data.name} already exists`);
      const created = await dao.create(data);
      if (!created)
        throw new InternalServerError('Failed trying to create ActivityKind');
      return created;
    },
    destroy: async (id) => {
      const deleted = await dao.deleteById(id);
      if (!deleted)
        throw new InternalServerError(`Failed deleting ActivityKind with id ${id}`);
      return deleted;
    },
    findById: async (id) => {
      const found = await dao.findById(id);
      if (!found)
        throw new NotFoundError(`ActivityKind with id ${id} not found`);
      return found
    },
    query: async () => {
      const data = await dao.findAll();
      return data;
    },
    update: async (id, data) => {
      const updated = await dao.updateById(id, data);
      if (!updated)
        throw new InternalServerError(`Failed updating ActivityKind with id ${id}`);
      return updated;
    },
  };
};
