import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const userSearchQuerySchema = z.object({
  name: z.string().optional(),
  limit: z.coerce.number().positive().optional(),
  sort: z.nativeEnum(Prisma.SortOrder).optional(),
})

export const createUserSchema = z.object({
  name: z.string().min(1).max(10),
  email: z.string().email(),
})
