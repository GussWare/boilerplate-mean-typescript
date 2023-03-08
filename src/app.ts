import express, {NextFunction} from 'express'
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
import rv1 from "./v1/routes"
import ApiError from "./includes/library/api.error.library"
import ErrorMiddleware from "./includes/middelware/error.middleware"
import jwtMiddleware from './v1/middlewares/jwt.middleware';
import loggerHelper from './includes/helpers/logger.helper';

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(cors())
app.use(mongoSanitize())
app.use(createLocaleMiddleware({
  priority: ['accept-language', 'default'],
  default: 'es_Es'
}))

if (config.env === constants.NODE_ENV_DEVELOPER) {
  app.use(morgan('dev'))
}

// error 404
app.use((_, __, next: NextFunction) => {
	next(new ApiError(httpStatus.NOT_FOUND, ''));
});

app.use("/api", rv1);

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtMiddleware.getStrategy());

// documentos estaticos
app.use("/files", express.static("../files", { redirect: false }));
app.use("/assets", express.static("../assets", { redirect: false }));

// convert error to ApiError, if needed
app.use(ErrorMiddleware.converter);

// handle error
app.use(ErrorMiddleware.handler);

loggerHelper.info(JSON.stringify(config));
loggerHelper.info("SERVIDOR CORRIENDO...");

export default app
