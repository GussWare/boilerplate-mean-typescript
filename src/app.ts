import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import mongoSanitize from 'express-mongo-sanitize'
import createLocaleMiddleware from 'express-locale'
import * as constants from '../src/config/constants'
import config from '../src/config/config'

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

export default app
