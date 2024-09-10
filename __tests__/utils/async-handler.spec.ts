import { describe, it, expect, vi } from 'vitest'
import express, { Request, Response, NextFunction } from 'express'
import asyncHandler from '@src/utils/async-handler'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'

describe('asyncHandler', () => {
  const mockedURL = '/test'
  it('should handle successful async function', async () => {
    const mockFn = vi.fn(async (_req: Request, res: Response) => {
      res.status(StatusCodes.OK).json({ message: 'Success' })
    })
    const app = express()
    app.get(mockedURL, asyncHandler(mockFn))

    const res = await request(app).get(mockedURL)

    expect(res.status).toBe(StatusCodes.OK)
    expect(res.body.message).toBe('Success')
  })

  it('should throws an error given handling failed', async () => {
    const mockFn = vi.fn(async () => {
      throw new Error('Test error')
    })
    const errorHandler = vi.fn(
      (
        err: { message: string },
        _req: Request,
        res: Response,
        _next: NextFunction
      ) => {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: err.message })
      }
    )
    const app = express()
    app.get(mockedURL, asyncHandler(mockFn))
    app.use(errorHandler)

    const res = await request(app).get(mockedURL)

    expect(res.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(res.body.error).toBe('Test error')
    expect(errorHandler).toHaveBeenCalled()
  })

  it('should pass request, response, and next to the async function', async () => {
    const mockFn = vi.fn(
      async (req: Request, res: Response, _next: NextFunction) => {
        res.status(StatusCodes.OK).json({ path: req.path })
      }
    )
    const app = express()
    app.get(mockedURL, asyncHandler(mockFn))

    const res = await request(app).get(mockedURL)

    expect(mockFn).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything()
    )
    expect(res.body.path).toBe(mockedURL)
  })
})
