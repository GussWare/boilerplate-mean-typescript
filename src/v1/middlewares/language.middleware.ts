import { Request, Response, NextFunction } from "express"
import Polyglot from 'node-polyglot';
import httpStatus from "http-status";
import ApiError from "../../includes/library/api.error.library"

class LanguageMiddleware {
    private polyglot: Polyglot;
  
    constructor() {
      this.polyglot = new Polyglot();
    }
  
    async load(req: Request, _res: Response, next: NextFunction) {
      const lang = req.locale.language;
  
      try {
        const messages = await import(`../languages/${lang}.json`);
        this.polyglot.extend(messages);
  
        // @ts-ignore
        global.polyglot = this.polyglot;

        next();
      } catch (error) {
        next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Idioma File Not Found'));
      }
    }
  }
  
  export default new LanguageMiddleware();