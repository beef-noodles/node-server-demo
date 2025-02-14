import { Prisma, User } from '@prisma/client'

import NotFoundException from '@src/exceptions/not-found-exception'
import userRepository from '@src/repositories/user-repository'
import logger from '@src/utils/logger'
class UserService {
  async getAll() {
    return await userRepository.getAll()
  }

  async findUsersBy(
    name: string,
    limit: number,
    orderType: Prisma.SortOrder
  ): Promise<User[]> {
    logger.info(
      `Start to get the users_limit: ${limit}, orderType: ${orderType}`
    )
    const userList = await userRepository.findByName(name, limit, orderType)
    logger.info(
      `Successfully get ${userList.length} users_name: ${name}, limit: ${limit}, orderType: ${orderType}`
    )
    return userList
  }

  async getUserDetail(id: string): Promise<User> {
    logger.info(`Start to get user details_id: ${id}`)
    const userInfo = await userRepository.getById(id)
    if (!userInfo) {
      throw new NotFoundException(
        `Failed to find the user details for id: ${id}`
      )
    }
    logger.info(`Successfully get the user details_id: ${id}`)
    return userInfo
  }

  async add(name: string, email: string): Promise<User> {
    return await userRepository.add(name, email)
  }
  async delete(id: string) {
    return await userRepository.delete(id)
  }
}

const userService = new UserService()
export default userService
