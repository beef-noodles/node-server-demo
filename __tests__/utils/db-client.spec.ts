import { PrismaClient } from '@prisma/client'
import { describe, it, expect } from 'vitest'

import prisma from '@src/utils/db-clients'

describe('db-client', () => {
  it('should be a Prisam instance', () => {
    expect(prisma instanceof PrismaClient).toBeTruthy()
  })
})
