import { NextFunction, Request, Response } from "express"
import ApiError from "../library/api.error.library";
import mongoose from "mongoose"
import httpStatus from "http-status";
import config from "../config/config"
import * as constants from "../config/constants"

class ErrorMiddleware {


	async errorConverter(err: Error, _req: Request, _res: Response, next: NextFunction) {
		let error = err;

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
			//@ts-ignore
			error = new ApiError(statusCode, message, false, err.stack);
		}
		next(error);
	}


	async errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
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

		}

		res.status(statusCode).send(response);
	}
}

export default new ErrorMiddleware();