import { describe, expect, it, vi } from 'vitest'
import httpMocks from 'node-mocks-http'
import authMiddleware from '@src/middlewares/auth-middleware'

describe('authMiddleware', () => {
  it('should return 401 status when requesting given user name not exist in headers', async () => {
    const request = httpMocks.createRequest({
      headers: {
        'X-User-Role': 'Contributor',
      },
    })
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authMiddleware(request, response, next)

    expect(response.statusCode).toBe(401)
    expect(next).not.toBeCalled()
  })

  it('should return 401 status when requesting given user role not exist in headers', async () => {
    const request = httpMocks.createRequest({
      headers: {
        'X-User-Name': 'Dummy-Name',
      },
    })
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authMiddleware(request, response, next)

    expect(response.statusCode).toBe(401)
    expect(next).not.toBeCalled()
  })

  it('should return 401 status when requesting given user role invalid', async () => {
    const request = httpMocks.createRequest({
      headers: {
        'X-User-Name': 'Dummy-Name',
        'X-User-Role': 'Invalid-Role',
      },
    })
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authMiddleware(request, response, next)

    expect(response.statusCode).toBe(401)
    expect(next).not.toBeCalled()
  })

  it('should call next when requesting given valid headers', async () => {
    const request = httpMocks.createRequest({
      headers: {
        'X-User-Name': 'Dummy-Name',
        'X-User-Role': 'Viewer',
      },
    })
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authMiddleware(request, response, next)

    expect(next).toBeCalled()
  })
})
