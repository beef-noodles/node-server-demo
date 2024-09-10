import { describe, expect, it } from 'vitest'
import { OrderType } from '@src/repositories/common'
import {
  createUserSchema,
  userSearchQuerySchema,
} from '@src/routers/schemas/user-schemas'

describe('user-schema', () => {
  describe('userSearchQuerySchema', () => {
    it('should return error result given limit is not a number and sort not a OrderType', () => {
      const invalidData = { limit: 'a', sort: 'sort' }

      const result = userSearchQuerySchema.safeParse(invalidData)

      expect(result.success).toBeFalsy()
      expect(result.error?.errors).toHaveLength(2)
      expect(result.error?.errors[0]).toMatchObject({
        message: 'Expected number, received nan',
        path: ['limit'],
      })

      expect(result.error?.errors[1]).toMatchObject({
        message: "Invalid enum value. Expected 'asc' | 'desc', received 'sort'",
        path: ['sort'],
      })
    })

    it('should return success result given valid data', () => {
      const validData = { limit: '10', sort: OrderType.Asc }

      const result = userSearchQuerySchema.safeParse(validData)

      expect(result.success).toBeTruthy()
      expect(result.data).toEqual({
        limit: 10,
        sort: OrderType.Asc,
      })
    })
  })

  describe('createUserSchema', () => {
    it('should return error result given not pass fields', () => {
      const invalidData = {}

      const result = createUserSchema.safeParse(invalidData)

      expect(result.success).toBeFalsy()
      expect(result.error?.errors).toHaveLength(2)
      expect(result.error?.errors[0]).toMatchObject({
        message: 'Required',
        path: ['name'],
      })
      expect(result.error?.errors[1]).toMatchObject({
        message: 'Required',
        path: ['email'],
      })
    })

    it.each([
      [{ name: 'name' }, ['email', 'Required']],
      [{ email: 'email@email.com' }, ['name', 'Required']],
    ])('should return error result given no %j', (invalidData, expected) => {
      const result = createUserSchema.safeParse(invalidData)

      expect(result.success).toBeFalsy()
      expect(result.error?.errors).toHaveLength(1)
      expect(result.error?.errors[0]).toMatchObject({
        message: expected[1],
        path: [expected[0]],
      })
    })

    it('should return success result given valid data', () => {
      const validData = { name: 'name', email: 'email@test.com' }

      const result = createUserSchema.safeParse(validData)

      expect(result.success).toBeTruthy()
      expect(result.data).toEqual(validData)
    })
  })
})
