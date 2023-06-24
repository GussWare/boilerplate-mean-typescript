import express, { NextFunction } from 'express'
import helmet from 'helmet'
import httpStatus from "http-status";
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import passport from "passport"
import mongoSanitize from 'express-mongo-sanitize'
import createLocaleMiddleware from 'express-locale'
import * as constants from './includes/config/constants'
import config from './includes/config/config'
import apiRoutes from "./v1/routes/sistema/index.router"
import ApiError from "./includes/library/api.error.library"
import ErrorMiddleware from "./includes/middelware/error.middleware";
import jwtMiddleware from './v1/middlewares/jwt.middleware';
import languageMiddleware from './includes/middelware/language.middleware';

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(mongoSanitize())
app.use(createLocaleMiddleware({
  "priority": ["accept-language", "default"],
  "default": "es_Es"
}));

app.use(languageMiddleware.load);

if (config.env === constants.NODE_ENV_DEVELOPER) {
  app.use(morgan('dev'))
}

app.use("/api", apiRoutes);

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtMiddleware.getStrategy());

// documentos estaticos
app.use("/files", express.static("../files", { redirect: false }));
app.use("/assets", express.static("../assets", { redirect: false }));

// error 404
app.use((_, __, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'GENERAL_ERROR_API_NOT_FOUND'));
});

// convert error to ApiError, if needed
app.use(ErrorMiddleware.errorConverter);

// handle error
app.use(ErrorMiddleware.errorHandler);

export default app
