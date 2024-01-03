import Joi from "joi";

export const GroupByIdValidation = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

export const GroupCreateValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    codename: Joi.string().required(),
    description: Joi.string(),
  }),
};

export const GroupUpdateValidation = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    codename: Joi.string().required(),
    description: Joi.string(),
  }),
};