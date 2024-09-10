import express, { Router } from 'express'

export const mockApp = (
  routeBaseUrl: string,
  route: Router
): express.Application => {
  const app: express.Application = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routeBaseUrl, route)
  return app
}
