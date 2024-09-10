import { User } from '@prisma/client'

export const mockUser = (
  id: string,
  name: string = 'name',
  email: string = 'test@test.com'
) =>
  ({
    id,
    name,
    email,
    createdAt: new Date(),
    updatedAt: new Date(),
  }) as User
