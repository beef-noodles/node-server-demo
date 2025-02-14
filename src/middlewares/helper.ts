import cors from 'cors'
import express, { Express } from 'express'

import envConfig from '../config/env'

export enum UserRole {
  Contributor = 'Contributor',
  Viewer = 'Viewer',
}

export enum UserHeader {
  Name = 'X-User-Name',
  Role = 'X-User-Role',
}

const applyConfig = (app: Express) => {
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(
    cors({
      origin: envConfig.allowList,
    })
  )

  app.disable('x-powered-by')
}

export { applyConfig }
