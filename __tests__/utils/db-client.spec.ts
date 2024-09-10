import { describe, it, expect } from 'vitest'
import prisma from '@src/utils/db-clients'
import { PrismaClient } from '@prisma/client'

describe('db-client', () => {
  it('should be a Prisam instance', () => {
    expect(prisma instanceof PrismaClient).toBeTruthy()
  })
})
