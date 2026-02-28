import vine from "@vinejs/vine";

import { BadRequestError } from "../utils/api.error.js";

const cuidValidator = vine.create({
  id: vine.string().minLength(20).maxLength(50).trim(),
});

export function getValidators() {
  return {
    validateIdParam: async (req, res, next) => {
      try {
        const validated = await cuidValidator.validate(req.params);
        req.locals = { ...req.locals, id: validated.id };
        next();
      } catch (err) {
        next(new BadRequestError("Faulty ID parameter", err.messages));
      }
    },
    validateBody: (schema) => {
      return async (req, _res, next) => {
        try {
          const validator = vine.create(schema);
          const validated = await validator.validate(req.body);
          req.locals = { ...req.locals, payload: validated };
          next();
        } catch (err) {
          next(new BadRequestError("Faulty body data", err.messages));
        }
      };
    },
  };
}
