import express, { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'

import InternalServerErrorException from '@src/exceptions/internal-server-error-exception'
import NotFoundException from '@src/exceptions/not-found-exception'
import exceptionHandlerMiddleware from '@src/middlewares/exception-handler-middleware'

describe('exceptionHandlerMiddleware', async () => {
  let app: express.Application
  beforeEach(() => {
    app = express()
    app.use(express.json())
  })

  it.each([
    {
      error: new InternalServerErrorException('Internal Server Error'),
      expectedStatus: StatusCodes.INTERNAL_SERVER_ERROR,
      expectedMessage: 'Internal Server Error',
    },
    {
      error: new Error('Unexpected error'),
      expectedStatus: StatusCodes.INTERNAL_SERVER_ERROR,
      expectedMessage: 'An unexpected error occurred',
    },
    {
      error: new NotFoundException('Dummy error details'),
      expectedStatus: StatusCodes.NOT_FOUND,
      expectedMessage: 'Dummy error details',
    },
  ])(
    'should return $expectedStatus status when requesting error URL given $error',
    async ({ error, expectedStatus, expectedMessage }) => {
      app.get('/error', (_req: Request, _res: Response, next: NextFunction) => {
        next(error)
      })
      app.use(exceptionHandlerMiddleware)

      const response = await supertest(app).get('/error')

      expect(response.status).toBe(expectedStatus)
      expect(response.body).toEqual({ message: expectedMessage })
    }
  )
})
