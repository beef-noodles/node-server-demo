import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { StatusCodes } from 'http-status-codes'
import healthRouter, { HealthStatus } from '@src/routers/health-router'
import { mockApp } from './helper'
import { Application } from 'express'

describe('GET /health', () => {
  const app: Application = mockApp('/', healthRouter)

  it('should be a health app', async () => {
    const response = await request(app)
      .get('/health')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(StatusCodes.OK)
    expect(response.body.status).toEqual(HealthStatus.Running)
    expect(response.body.dateTime).not.toBeNull()
  })
})
