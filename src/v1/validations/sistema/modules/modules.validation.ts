import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import ApiError from "../../../../includes/library/api.error.library";

// Middleware para validar los datos de entrada
export const createValidation = async (req: Request, _res: Response, next: NextFunction) => {
    const actionSchema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        guard: Joi.string().required(),
        description: Joi.string().required()
      });
      
      const Schema = Joi.object({
        name: Joi.string().required(),
        slug: Joi.string().required(),
        guard: Joi.string().required(),
        description: Joi.string().required(),
        enabled: Joi.boolean().required(),
        actions: Joi.array().items(actionSchema).required()
      });

  try {
    await Schema.validateAsync(req.body);
    next();
  } catch (err) {
    //@ts-ignore
    next(new ApiError(httpStatus.BAD_REQUEST, err.details[0].message));
  }
}
