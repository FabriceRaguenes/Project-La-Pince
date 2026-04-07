import Joi from "joi";
import HttpError from "../utils/HttpError.js";

export function validateCreateCategory(req, res, next) {
  const createCategorySchema = Joi.object({
    name: Joi.string().required(),
    color: Joi.string().max(7).required(),
    icon: Joi.string().required(),
    max_budget: Joi.number().positive().required(),
    user_id: Joi.number().min(1).required(),
  });

  const validation = createCategorySchema.validate(req.body);

  if (validation.error) {
    throw new HttpError(validation.error, 400);
  }

  next();
}

export function validateUpdateCategory(req, res, next) {
  const updateCategorySchema = Joi.object({
    name: Joi.string(),
    color: Joi.string().max(7),
    icon: Joi.string(),
    max_budget: Joi.number().positive(),
    // we are not supposed to edit the owner of an expense
  });

  const validation = updateCategorySchema.validate(req.body);

  if (validation.error) {
    throw new HttpError(validation.error, 400);
  }

  next();
}