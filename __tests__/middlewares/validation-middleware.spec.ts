import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { z } from 'zod'

import { validateData } from '@src/middlewares/validation-middleware'

import { mockedUUID1 } from '@test/fixtures'

describe('validateData middleware', () => {
  const mockRequest = (body: unknown): Partial<Request> => ({ body })
  const mockResponse = () => {
    const res: Partial<Response> = {}
    res.status = vi.fn().mockReturnValue(res)
    res.json = vi.fn().mockReturnValue(res)
    return res
  }
  let mockNext: NextFunction

  beforeEach(() => {
    mockNext = vi.fn()
  })
  describe('body', () => {
    it('should call next given validation passes', () => {
      const schema = z.object({
        name: z.string(),
      })

      const req = mockRequest({ name: 'John Doe' }) as Request
      const res = mockResponse() as Response

      validateData({ body: schema })(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledOnce()
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    it('should return 400 status and error message given validation fails', () => {
      const schema = z.object({
        name: z.string(),
      })
      const req = mockRequest({ name: 123 }) as Request
      const res = mockResponse() as Response

      validateData({ body: schema })(req, res, mockNext)

      expect(mockNext).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [{ message: 'name is Expected string, received number' }],
      })
    })

    it('should return 500 status given an unknown error occurs', () => {
      const schema = z.object({
        name: z.string(),
      })
      vi.spyOn(schema, 'parse').mockImplementation(() => {
        throw new Error('Unknown error')
      })
      const req = mockRequest({ name: 'John Doe' }) as Request
      const res = mockResponse() as Response

      validateData({ body: schema })(req, res, mockNext)

      expect(mockNext).not.toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal Server Error',
      })
    })
  })

  describe('query', () => {
    const schema = z.object({
      limit: z.number().int().positive().optional(),
      sort: z.enum(['aes', 'desc']).optional(),
    })
    it('should be a good validation', () => {
      const req = {
        query: {
          limit: 30,
          sort: 'aes',
        },
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ query: schema })(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledOnce()
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    it('should be a bad request given not supported sort type', () => {
      const req = {
        query: {
          limit: 30,
          sort: 'Not supported sort type',
        },
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ query: schema })(req, res, mockNext)

      expect(mockNext).not.toHaveBeenCalledOnce()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [
          {
            message: `sort is Invalid enum value. Expected 'aes' | 'desc', received 'Not supported sort type'`,
          },
        ],
      })
    })

    it('should be a bad request given non-positive limit', () => {
      const req = {
        query: {
          limit: -30,
          sort: 'aes',
        },
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ query: schema })(req, res, mockNext)

      expect(mockNext).not.toHaveBeenCalledOnce()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [{ message: 'limit is Number must be greater than 0' }],
      })
    })

    it('should be a good request given no query values', () => {
      const req = {
        query: {},
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ query: schema })(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledOnce()
      expect(res.status).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })
  })
  describe('params', () => {
    const schema = z.object({
      id: z.string().uuid({ message: 'Invalid UUID' }),
      type: z.enum(['csv', 'excl']),
    })

    it('should be ok given valid params', () => {
      const req = {
        params: {
          id: mockedUUID1,
          type: 'csv',
        },
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ params: schema })(req, res, mockNext)

      expect(mockNext).toHaveBeenCalledOnce()
    })

    it('should be a bad request given not a uuid', () => {
      const req = {
        params: {
          id: 'not a uuid',
          type: 'csv',
        },
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ params: schema })(req, res, mockNext)

      expect(mockNext).not.toHaveBeenCalledOnce()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [{ message: 'id is Invalid UUID' }],
      })
    })

    it('should be a bad request given not allowed enum value', () => {
      const req = {
        params: {
          id: mockedUUID1,
          type: 'not in the enum',
        },
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ params: schema })(req, res, mockNext)

      expect(mockNext).not.toHaveBeenCalledOnce()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [
          {
            message: `type is Invalid enum value. Expected 'csv' | 'excl', received 'not in the enum'`,
          },
        ],
      })
    })

    it('should be a bad request given no query values', () => {
      const req = {
        params: {},
      } as unknown as Request
      const res = mockResponse() as Response

      validateData({ params: schema })(req, res, mockNext)

      expect(mockNext).not.toHaveBeenCalledOnce()
      expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid data',
        details: [
          {
            message: 'id is Required',
          },
          {
            message: 'type is Required',
          },
        ],
      })
    })
  })
})
