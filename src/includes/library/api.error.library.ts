import loggerHelper from "../helpers/logger.helper";
export default class ApiError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    
	constructor(statusCode: number, message:string, isOperational:boolean = true, stack:string = "") {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		loggerHelper.debug(statusCode);
		loggerHelper.debug(message);
		loggerHelper.debug(isOperational);
		loggerHelper.debug(stack);

		if (stack) {
			loggerHelper.debug("entra en if");
			this.stack = stack;
		} else {
			loggerHelper.debug("entra en else");
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
