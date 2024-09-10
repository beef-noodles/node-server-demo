import { OrderType } from '@src/repositories/common'
import { z } from 'zod'

export const userSearchQuerySchema = z.object({
  name: z.string().optional(),
  limit: z.coerce.number().positive().optional(),
  sort: z.nativeEnum(OrderType).optional(),
})

export const createUserSchema = z.object({
  name: z.string().min(1).max(10),
  email: z.string().email(),
})
