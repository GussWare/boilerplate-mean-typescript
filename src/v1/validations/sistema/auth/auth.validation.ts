import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import Joi from "joi";
import { passwordCustom } from "../../custom.validation";
import ApiError from "../../../../includes/library/api.error.library";

/**
 * Middleware Para validar Api Login
 * 
 * @param req 
 * @param _res 
 * @param next 
 */
export const loginValidation = async (req: Request, _res: Response, next: NextFunction) => {
  const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
  });

  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    //@ts-ignore
    next(new ApiError(httpStatus.BAD_REQUEST, err.details[0].message));
  }
}

/**
 * Middleware Para validar Api Registro de Usuario
 * 
 * @param req 
 * @param _res 
 * @param next 
 */
export const logoutValidation = async (req: Request, _res: Response, next: NextFunction) => {
  const loginSchema = Joi.object().keys({
    refreshToken: Joi.string().required(),
  })

  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    //@ts-ignore
    next(new ApiError(httpStatus.BAD_REQUEST, err.details[0].message));
  }
}

export const registerValidation = async (req: Request, _res: Response, next: NextFunction) => {
  const loginSchema = Joi.object().keys({
    name: Joi.string().required(),
    surname: Joi.string().required(),
    picture: Joi.string(),
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(passwordCustom),
  })

  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    //@ts-ignore
    next(new ApiError(httpStatus.BAD_REQUEST, err.details[0].message));
  }
}

export const refreshTokensValidation = async (req: Request, _res: Response, next: NextFunction) => {
  const loginSchema = Joi.object().keys({
    refreshToken: Joi.string().required(),
  })

  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    //@ts-ignore
    next(new ApiError(httpStatus.BAD_REQUEST, err.details[0].message));
  }
}

export const forgotPasswordValidation = async (req: Request, _res: Response, next: NextFunction) => {
  const loginSchema = Joi.object().keys({
    email: Joi.string().email().required(),
  })

  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    //@ts-ignore
    next(new ApiError(httpStatus.BAD_REQUEST, err.details[0].message));
  }
}