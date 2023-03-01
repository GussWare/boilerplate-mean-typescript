import { NextFunction, Request, Response } from "express"
import ApiError from "../library/api.error.library";
import mongoose from "mongoose"
import httpStatus from "http-status";
import config from "../config/config"
import * as constants from "../config/constants"
import loggerHelper from "../helpers/logger.helper";

class ErrorMiddleware {

    constructor() {

    }

    /**
     * Se encarga de cachar el error y transformarlo con forme a la libreria ApiError
     * 
     * @param err 
     * @param _req 
     * @param _res 
     * @param next 
     */
    converter(err: Error, _req: Request, _res: Response, next: NextFunction) {

        let error: any = err;

        if (!(error instanceof ApiError)) {
            let statusCode = null;

            if (error.statusCode) {
                statusCode = error.statusCode;
            } else {
                if (error instanceof mongoose.Error) {
                    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
                } else {
                    statusCode = httpStatus.BAD_REQUEST;
                }
            }

            const message = error.message || httpStatus[statusCode];
            error = new ApiError(statusCode, message, false, err.stack);
        }

        next(error);
    }

    /**
     * Se encarga de recibir el error de la libreria ApiError y devulver el mensaje de error al cliente con el formato deseado
     * 
     * @param err 
     * @param _req 
     * @param res 
     * @param _next 
     */
    handler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
        let { statusCode, message } = err;

        if (config.env === constants.NODE_ENV_PRODUCTION && !err.isOperational) {
            statusCode = httpStatus.INTERNAL_SERVER_ERROR;
            message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
        }

        res.locals.errorMessage = err.message;

        const response = {
            code: statusCode,
            message,
            ...(config.env === constants.NODE_ENV_DEVELOPER && { stack: err.stack }),
        };

        if (config.env === constants.NODE_ENV_DEVELOPER) {
            loggerHelper.error(err);
        }

        res.status(statusCode).send(response);
    }
}


export default new ErrorMiddleware();