import { Prisma, User } from '@prisma/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { mockUser } from './fixtures'

import userRepository from '@src/repositories/user-repository'
import userService from '@src/services/user-service'

describe('user-service', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  const mockedUser1Id = '0191e665-88b9-75cf-8e98-a712ffb03c19'
  const mockedUser2Id = '0191e665-88b9-75cf-8e98-a712ffb03c29'
  const mockedUser3Id = '0191e665-88b9-75cf-8e98-a712ffb03c39'
  const mockedUser1 = mockUser(mockedUser1Id)
  const mockedUser2 = mockUser(mockedUser2Id)
  const mockedUser3 = mockUser(mockedUser3Id)
  describe('getAll', () => {
    it('should return 3 users given 3 mocked upload file info', async () => {
      vi.spyOn(userRepository, 'getAll').mockResolvedValue([
        mockedUser1,
        mockedUser2,
        mockedUser3,
      ])

      const result = await userService.getAll()

      expect(result.length).toEqual(3)
    })
  })

  describe('findUsersBy', () => {
    it('should return 1 upload sites when get all users given 1 user in the db', async () => {
      const findByNameSpy = vi.spyOn(userRepository, 'findByName')
      findByNameSpy.mockResolvedValueOnce([
        mockedUser1,
        mockedUser2,
        mockedUser3,
      ])

      const result = await userService.findUsersBy(
        'name',
        5,
        Prisma.SortOrder.desc
      )

      expect(result.length).toEqual(3)
      expect(result[0]?.id).toBe(mockedUser1Id)
      expect(result[0]?.name).toBe(mockedUser1.name)
      expect(result[0]?.email).toBe(mockedUser1.email)
      expect(findByNameSpy).toBeCalledWith('name', 5, Prisma.SortOrder.desc)
    })
  })

  describe('getUserDetail', () => {
    it('should get user details', async () => {
      const getByIdSpy = vi.spyOn(userRepository, 'getById')
      getByIdSpy.mockResolvedValueOnce(mockedUser1)

      const result = await userService.getUserDetail(mockedUser1Id)

      expect(result).toMatchObject(expect.objectContaining(mockedUser1))
      expect(getByIdSpy).toBeCalledWith(mockedUser1Id)
    })

    it('should throw exception', async () => {
      const getByIdSpy = vi.spyOn(userRepository, 'getById')
      getByIdSpy.mockResolvedValueOnce(null)

      await expect(async () => {
        await userService.getUserDetail(mockedUser1Id)
      }).rejects.toThrowError(
        `Failed to find the user details for id: ${mockedUser1Id}`
      )

      expect(getByIdSpy).toBeCalledWith(mockedUser1Id)
    })
  })

  describe('addUser', () => {
    it('should add 1 user into DB', async () => {
      const mockedAddUsername = 'test-add'
      const mockedAddUserEmail = 'test@add.com'
      const addSpy = vi.spyOn(userRepository, 'add')
      addSpy.mockResolvedValueOnce(
        mockUser('id', mockedAddUsername, mockedAddUserEmail)
      )

      const result = await userService.add(
        mockedAddUsername,
        mockedAddUserEmail
      )

      expect(result).toMatchObject(
        expect.objectContaining({
          name: mockedAddUsername,
          email: mockedAddUserEmail,
        } as User)
      )
      expect(addSpy).toBeCalledWith(mockedAddUsername, mockedAddUserEmail)
    })
  })

  describe('delete', () => {
    it('should delete 1 user', async () => {
      const deleteSpy = vi.spyOn(userRepository, 'delete')
      deleteSpy.mockResolvedValueOnce(mockedUser1)

      const result = await userService.delete(mockedUser1Id)

      expect(result).toMatchObject(expect.objectContaining(mockedUser1 as User))
      expect(deleteSpy).toBeCalledWith(mockedUser1Id)
    })
  })
})
