import {Request, Response, NextFunction} from "express";

const catchAsyncHelper = (fn:any) => (req:Request, res:Response, next:NextFunction) => {
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

export default catchAsyncHelper;
