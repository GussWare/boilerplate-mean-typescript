import winston from 'winston'
import config from '../config/config'
import * as constants from '../config/constants'

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack })
  }
  return info
})

const level = config.env === constants.NODE_ENV_DEVELOPER ? 'debug' : 'info'
const wistonFormatColorize = winston.format.colorize()
const wistonFormatUncolorize = winston.format.uncolorize()

const loggerHelper = winston.createLogger({
  level: level,
  format: winston.format.combine(enumerateErrorFormat(),
    config.env === constants.NODE_ENV_DEVELOPER
      ? wistonFormatColorize
      : wistonFormatUncolorize,
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    })
  ]
})

export default loggerHelper
