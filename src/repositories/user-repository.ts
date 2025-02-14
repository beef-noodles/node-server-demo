import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { v7 as uuidV7 } from 'uuid'

import prisma from '@src/utils/db-clients'
class UserRepository {
  async add(name: string, email: string) {
    return await prisma.user.create({
      data: {
        id: uuidV7(),
        name,
        email,
        createdAt: dayjs().toDate(),
      },
    })
  }

  async findByName(name: string, limit: number = 10, order: Prisma.SortOrder) {
    return await prisma.user.findMany({
      take: limit,
      where: {
        name: {
          contains: name,
        },
      },
      orderBy: {
        createdAt: order,
      },
    })
  }
  async getAll() {
    return await prisma.user.findMany()
  }

  async getById(id: string) {
    return await prisma.user.findFirst({
      where: {
        id,
      },
    })
  }

  async delete(id: string) {
    return await prisma.user.delete({
      where: {
        id,
      },
    })
  }
}

const userRepository = new UserRepository()

export default userRepository
