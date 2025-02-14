import httpMocks from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import { UserRole } from '@src/middlewares/helper'
import authorizedFor from '@src/middlewares/permission-middleware'

describe('permissionMiddleware', () => {
  it('should return 403 status when requesting given user role not match', async () => {
    const request = httpMocks.createRequest({
      headers: {
        'X-User-Role': 'Invalid-Role',
      },
    })
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authorizedFor([UserRole.Contributor, UserRole.Viewer])(
      request,
      response,
      next
    )

    expect(response.statusCode).toBe(403)
    expect(next).not.toBeCalled()
  })

  it('should return 403 status when requesting given user role not exist', async () => {
    const request = httpMocks.createRequest()
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authorizedFor([UserRole.Contributor])(request, response, next)

    expect(response.statusCode).toBe(403)
    expect(next).not.toBeCalled()
  })

  it('should return 403 status when requesting given no expected role', async () => {
    const request = httpMocks.createRequest({
      headers: {
        'X-User-Role': 'Viewer',
      },
    })
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authorizedFor([])(request, response, next)

    expect(response.statusCode).toBe(403)
    expect(next).not.toBeCalled()
  })

  it('should call next when requesting given valid role', async () => {
    const request = httpMocks.createRequest({
      headers: {
        'X-User-Role': 'Viewer',
      },
    })
    const response = httpMocks.createResponse()
    const next = vi.fn()

    authorizedFor([UserRole.Viewer])(request, response, next)

    expect(next).toBeCalled()
  })
})
