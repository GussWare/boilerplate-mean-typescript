import { NextFunction, Request, Response } from "express"
import ApiError from "../library/api.error.library";
import mongoose from "mongoose"
import httpStatus from "http-status";
import config from "../config/config"
import * as constants from "../config/constants"
import loggerHelper from "../helpers/logger.helper";
import JsonHelper from "../helpers/json.helper";

class ErrorMiddleware {

	async errorConverter(error: Error, _req: Request, _res: Response, next: NextFunction) {

		if (!(error instanceof ApiError)) {
			let statusCode = null;

			//@ts-ignore
			if (error.statusCode) {
				//@ts-ignore
				statusCode = error.statusCode;
			} else {
				if (error instanceof mongoose.Error) {
					statusCode = httpStatus.INTERNAL_SERVER_ERROR;
				} else {
					statusCode = httpStatus.BAD_REQUEST;
				}
			}

			const message = error.message || httpStatus[statusCode];
			
			error = new ApiError(statusCode, message, false, error.stack);
		}
		next(error);
	}


	async errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
		let { statusCode, message } = err;

		if (config.env === constants.NODE_ENV_PRODUCTION && !err.isOperational) {
			message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
		}

		res.locals.errorMessage = err.message;
		
		const isJsonValid = JsonHelper.isJsonValid(message);
		const response = (isJsonValid) ? JSON.parse(message) : { detail:  message };

		if (config.env === constants.NODE_ENV_DEVELOPER && err.stack) {
			loggerHelper.error(err.stack);
		}

		res.status(statusCode).send(response);
	}
}

export default new ErrorMiddleware();