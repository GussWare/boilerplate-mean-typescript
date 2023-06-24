import { Request, Response, NextFunction } from "express"
import Polyglot from 'node-polyglot';
import httpStatus from "http-status";
import ApiError from "../library/api.error.library"
import config from "../config/config";

class LanguageMiddleware {

  async load(_req: Request, _res: Response, next: NextFunction) {
    const lang =  config.language.default;

    try {
      const pathFile = `../../v1/language/${lang}.json`
      const polyglot = new Polyglot();
      const messages = await import(pathFile);

      polyglot.extend(messages);
      // @ts-ignore
      global.polyglot = polyglot;

      next();
    } catch (error) {
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Idioma File Not Found'));
    }
  }
}

export default new LanguageMiddleware();