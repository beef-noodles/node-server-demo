import { resolve } from 'path'

import { Prisma, PrismaClient } from '@prisma/client'
import { StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  onTestFinished,
  vi,
} from 'vitest'

import { databaseContainer } from '@test/fixtures'

let database: StartedPostgreSqlContainer
let prismaClient: PrismaClient

vi.mock('@src/utils/db-clients', () => ({
  default: prismaClient,
}))

beforeAll(async () => {
  database = await databaseContainer([
    resolve(__dirname, 'fixtures', 'init-user-table.sql'),
  ])

  prismaClient = new PrismaClient({
    datasourceUrl: database.getConnectionUri(),
  })
  await prismaClient.$connect()
}, 300_000)

afterAll(async () => {
  await prismaClient.$disconnect()
  await database.stop()
})

describe('userRepository', () => {
  const existingUserId = '0191e5c4-c515-791b-8c82-b32a194f0317'

  describe('findByName', () => {
    it('should get 1 user given user name is test', async () => {
      const { default: userRepository } = await import(
        '@src/repositories/user-repository'
      )

      const userList = await userRepository.findByName(
        'test',
        10,
        Prisma.SortOrder.desc
      )

      expect(userList).toHaveLength(1)
    })
  })
  describe('getAll', () => {
    it('should get 2 user when get all users', async () => {
      const { default: userRepository } = await import(
        '@src/repositories/user-repository'
      )

      const userList = await userRepository.getAll()

      expect(userList).toHaveLength(2)
    })
  })

  describe('getById', () => {
    it('should get 1 user given user name id', async () => {
      const { default: userRepository } = await import(
        '@src/repositories/user-repository'
      )

      const user = await userRepository.getById(existingUserId)

      expect(user).toMatchObject(
        expect.objectContaining({
          name: 'test',
          id: existingUserId,
          email: 'test@test.com',
        })
      )
    })
  })

  describe('add', () => {
    it('should add 1 user into db given mocked user name and email', async () => {
      const { default: userRepository } = await import(
        '@src/repositories/user-repository'
      )

      const addedUser = await userRepository.add('add 1', 'add@test.com')

      expect(addedUser).toMatchObject(
        expect.objectContaining({
          name: 'add 1',
          email: 'add@test.com',
        })
      )

      onTestFinished(async () => {
        await prismaClient.user.delete({ where: { id: addedUser.id } })
      })
    })
  })

  describe('delete', () => {
    it('should delete 1 user given existing user id', async () => {
      const { default: userRepository } = await import(
        '@src/repositories/user-repository'
      )

      const addedUser = await userRepository.delete(existingUserId)

      expect(addedUser).toMatchObject(
        expect.objectContaining({
          id: existingUserId,
          name: 'test',
          email: 'test@test.com',
        })
      )
    })
  })
})
