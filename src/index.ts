import express, { Router, Express } from 'express'

import { port } from './config'
import exceptionHandlerMiddleware from './middlewares/exception-handler-middleware'
import { applyConfig } from './middlewares/helper'
import healthRouter from './routers/health-router'
import gracefulShutdown from './utils/graceful-shutdown'
import logger from './utils/logger'

import authMiddleware from '@src/middlewares/auth-middleware'
import userRouter from '@src/routers/user-router'

const createApp = async () => {
  await gracefulShutdown.register()

  const app: Express = express()
  applyConfig(app)

  const apiV1Router = Router()

  apiV1Router.use(healthRouter)
  apiV1Router.use(userRouter)

  app.use(authMiddleware)
  app.use('/api/v1', apiV1Router)
  app.use(exceptionHandlerMiddleware)

  app.listen(port, () => {
    logger.log(`Successfully started on the port: ${port}`)
  })
  return app
}

const app = createApp()

export default app
