import { describe, it, expect, vi, afterEach } from 'vitest'

import { loggerFactory } from '@src/utils/logger'

describe('loggerFactory', () => {
  afterEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  it('should configure dotenv with correct path', () => {
    vi.stubEnv('NODE_ENV', 'prod')

    const logger = loggerFactory()

    expect(logger.level).toEqual({
      colour: 'green',
      level: 20000,
      levelStr: 'INFO',
    })
  })

  it('should load correct log level given no logLevel in env', () => {
    vi.stubEnv('LOG_LEVEL', '')

    const logger = loggerFactory()

    expect(logger.level).toEqual({
      colour: 'green',
      level: 20000,
      levelStr: 'INFO',
    })
  })
})
