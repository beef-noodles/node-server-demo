import dayjs from 'dayjs'
import { Router, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import logger from '@src/utils/logger'

const healthRouter: Router = Router()

export enum HealthStatus {
  Running = 'Running',
}

interface HealthRouterResponse {
  status: HealthStatus
  dateTime: string
}

healthRouter.get(
  '/health',
  async (_req: Request, res: Response): Promise<void> => {
    logger.log('Start to get health result')
    const resp = {
      status: HealthStatus.Running,
      dateTime: dayjs().format(),
    } as HealthRouterResponse
    res.status(StatusCodes.OK)
    logger.info('Successfully get the health result')
    res.json(resp)
  }
)

export default healthRouter
