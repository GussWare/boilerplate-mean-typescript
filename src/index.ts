import app from './app'
import mongoose from 'mongoose'
import config from './includes/config/config'
import loggerHelper from './includes/helpers/logger.helper'

let server: any = null

const uri: string = config.mongoose.uri

mongoose.connect(uri, {
  autoIndex: true,
  autoCreate: true,
  useNewUrlParser:true
}, () => {
  server = app.listen(config.port)
  loggerHelper.info(`SERVIDOR CORRIENDO EN EL PUERTO ${config.port}`);
})

const exitHandler = (): void => {
  if (server !== null) {
    server.close(() => {
      loggerHelper.info('Server closed')
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (error: any): void => {
  loggerHelper.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', (): void => {
  loggerHelper.info('SIGTERM received')
  if (server !== null) {
    server.close()
  }
})

export default app;