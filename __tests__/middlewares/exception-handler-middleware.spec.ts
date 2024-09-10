import { beforeEach, describe, expect, it } from 'vitest'
import supertest from 'supertest'
import express, { NextFunction, Request, Response } from 'express'
import exceptionHandlerMiddleware from '@src/middlewares/exception-handler-middleware'
import InternalServerErrorException from '@src/exceptions/internal-server-error-exception'
import NotFoundException from '@src/exceptions/not-found-exception'

describe('exceptionHandlerMiddleware', async () => {
  let app: express.Application
  beforeEach(() => {
    app = express()
    app.use(express.json())
  })

  it.each([
    {
      error: new InternalServerErrorException('Internal Server Error'),
      expectedStatus: 500,
      expectedMessage: 'Internal Server Error',
    },
    {
      error: new Error('Unexpected error'),
      expectedStatus: 500,
      expectedMessage: 'An unexpected error occurred',
    },
    {
      error: new NotFoundException('Dummy error details'),
      expectedStatus: 400,
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
