import { describe, expect, it, vi } from 'vitest'
import { mockApp } from '@test/routers/helper'
import request from 'supertest'
import { StatusCodes } from 'http-status-codes'
import { mockedUUID1 } from '@test/fixtures'
import userService from '@src/services/user-service'
import userRouter from '@src/routers/user-router'
import { UserHeader, UserRole } from '@src/middlewares/helper'
import { mockUser } from '@test/services/fixtures'

describe('user router', () => {
  const app = mockApp('/', userRouter)

  describe('GET /users', () => {
    it('should return all sites when get', async () => {
      const mockedUser = mockUser(mockedUUID1)
      vi.spyOn(userService, 'findUsersBy').mockResolvedValue([mockedUser])

      const response = await request(app)
        .get('/users')
        .set(UserHeader.Role, UserRole.Viewer)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toMatchObject(
        expect.objectContaining({
          id: mockedUser.id,
          name: mockedUser.name,
          email: mockedUser.email,
        })
      )
    })
  })

  describe('GET /users/:id', () => {
    it('should return all sites when get', async () => {
      const mockedUser = mockUser(mockedUUID1)
      vi.spyOn(userService, 'getUserDetail').mockResolvedValue(mockedUser)

      const response = await request(app)
        .get(`/users/${mockedUUID1}`)
        .set(UserHeader.Role, UserRole.Contributor)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchObject(
        expect.objectContaining({
          id: mockedUser.id,
          name: mockedUser.name,
          email: mockedUser.email,
        })
      )
    })
  })

  describe('DELETE /users/:id', () => {
    it('should return all sites when get', async () => {
      const mockedUser = mockUser(mockedUUID1)
      const deleteSpy = vi.spyOn(userService, 'delete')
      deleteSpy.mockResolvedValue(mockedUser)

      const response = await request(app)
        .delete(`/users/${mockedUUID1}`)
        .set(UserHeader.Role, UserRole.Contributor)

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.body).toMatchObject(
        expect.objectContaining({
          id: mockedUser.id,
          name: mockedUser.name,
          email: mockedUser.email,
        })
      )
      expect(deleteSpy).toBeCalledWith(mockedUUID1)
    })
  })

  describe('POST /users', () => {
    it('should add 1 user when create', async () => {
      const mockedUser = mockUser(mockedUUID1)
      const addSpy = vi.spyOn(userService, 'add')
      addSpy.mockResolvedValue(mockedUser)

      const response = await request(app)
        .post(`/users`)
        .send({
          name: 'name',
          email: 'test@email.com',
        })
        .set(UserHeader.Role, UserRole.Contributor)

      expect(response.status).toEqual(StatusCodes.CREATED)
      expect(response.body).toMatchObject(
        expect.objectContaining({
          id: mockedUser.id,
          name: mockedUser.name,
          email: mockedUser.email,
        })
      )
      expect(addSpy).toBeCalledWith('name', 'test@email.com')
    })
  })
})
