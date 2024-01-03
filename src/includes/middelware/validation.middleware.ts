import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import _ from "lodash";
import httpStatus from "http-status";
import ApiError from "../library/api.error.library";
import { ValidSchema } from "../../types";

const validateMiddleware =
    (schema: ValidSchema) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const validSchema: ValidSchema = _.pick(schema, ["params", "query", "body"]);
        const object = _.pick(req, Object.keys(validSchema));

        const { value, error } = Joi.compile(validSchema)
            .prefs({ errors: { label: "key" }, abortEarly: false })
            .validate(object);

        if (error) {
            const errorMessage = error.details.reduce((acc: any, detail: any) => {
                if (!acc[detail.context.label]) {
                    acc[detail.context.label] = [];
                }

                acc[detail.context.label].push(detail.message);

                return acc;
            }, {});

            return next(new ApiError(httpStatus.BAD_REQUEST, JSON.stringify(errorMessage)));
        }

        Object.assign(req, value);
        return next();
    };

export default validateMiddleware;