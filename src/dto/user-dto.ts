import { User } from '@prisma/client'

import DTOMapper from '@src/dto/interface'

export interface UserResponse {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date | null
}

class UserMapper implements DTOMapper<unknown, User, UserResponse> {
  mapToResponse = (entity: User): UserResponse => ({
    id: entity.id,
    name: entity.name!,
    email: entity.email,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  })
}

const userMapper = new UserMapper()
export default userMapper
