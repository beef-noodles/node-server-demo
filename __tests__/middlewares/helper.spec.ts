import request from 'supertest'
import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FIXTURE_ALLOWED_LOCALHOST } from '@test/fixtures'
import { applyConfig } from '@src/middlewares/helper'

describe('applyConfig', () => {
  it('should apply JSON and URL-encoded middleware', async () => {
    const app = express()
    applyConfig(app)
    app.post('/test', (req, res) => {
      res.json({ received: req.body })
    })

    const jsonResponse = await request(app)
      .post('/test')
      .send({ key: 'value' })
      .expect('Content-Type', /json/)
      .expect(200)

    expect(jsonResponse.body).toEqual({ received: { key: 'value' } })

    const urlEncodedResponse = await request(app)
      .post('/test')
      .send('key=value')
      .expect('Content-Type', /json/)
      .expect(200)

    expect(urlEncodedResponse.body).toEqual({ received: { key: 'value' } })
  })

  it('should disable the x-powered-by header', async () => {
    const app = express()
    applyConfig(app)

    app.get('/test', (_req, res) => {
      res.send('OK')
    })

    const response = await request(app).get('/test')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })

  describe('cors', () => {
    beforeEach(() => {
      vi.stubEnv(
        'ALLOW_LIST',
        JSON.stringify([FIXTURE_ALLOWED_LOCALHOST, 'https://example.com'])
      )
    })

    it('should be ok given the specific allowed origin', async () => {
      const app = express()
      applyConfig(app)
      app.get('/test', (_req, res) => {
        res.send('OK')
      })

      const response = await request(app)
        .get('/test')
        .set('Origin', FIXTURE_ALLOWED_LOCALHOST)
        .expect(200)

      expect(response.headers['access-control-allow-origin']).toBe(
        FIXTURE_ALLOWED_LOCALHOST
      )
    })

    it('should not be ok given the specific not-allowed origin', async () => {
      const app = express()
      applyConfig(app)
      app.get('/test', (_req, res) => {
        res.send('OK')
      })

      const response2 = await request(app)
        .get('/test')
        .set('Origin', 'http://notallowed.com')
        .expect(200)

      expect(response2.headers['access-control-allow-origin']).toBeUndefined()
    })
  })
})
