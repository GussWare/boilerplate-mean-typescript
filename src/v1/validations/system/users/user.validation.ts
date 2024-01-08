import Joi from "joi";
import { objecIdCustom } from "../../custom.validation";

export const UserByIdValidation = {
  params: Joi.object().keys({
    id: Joi.string().custom(objecIdCustom)
  }),
};

export const UserCreateValidation = {
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string(),
    password: Joi.string().required(),
    re_password: Joi.string().valid(Joi.ref('password')).required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    description: Joi.string(),
    is_superadmin: Joi.boolean(),
  }),
};

export const UserUpdateValidation = {
  params: Joi.object().keys({
    id: Joi.string().custom(objecIdCustom)
  }),
  body: Joi.object().keys({
    first_name: Joi.string().required(),
    last_name: Joi.string(),
    email: Joi.string().email().required(),
    is_superadmin: Joi.boolean(),
  }),
};