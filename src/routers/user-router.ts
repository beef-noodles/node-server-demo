import { Prisma } from '@prisma/client'
import { Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import { get, toNumber } from 'lodash'

import { createUserSchema, userSearchQuerySchema } from './schemas/user-schemas'

import userMapper, { UserResponse } from '@src/dto/user-dto'
import { UserRole } from '@src/middlewares/helper'
import authorizedFor from '@src/middlewares/permission-middleware'
import { validateData } from '@src/middlewares/validation-middleware'
import userService from '@src/services/user-service'
import asyncHandler from '@src/utils/async-handler'
import logger from '@src/utils/logger'

const userRouter: Router = Router()

userRouter.get(
  '/users',
  authorizedFor([UserRole.Viewer, UserRole.Contributor]),
  validateData({ query: userSearchQuerySchema }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const name = get(req.query, 'name') ?? ''
    const limit = toNumber(get(req.query, 'name', 10))
    const order =
      (get(req.query, 'order') as Prisma.SortOrder) ?? Prisma.SortOrder.desc
    logger.info('Start to get users')
    const userList = await userService.findUsersBy(
      name.toString(),
      limit,
      order
    )
    const response = userList.map<UserResponse>(userMapper.mapToResponse)
    logger.info('Successfully get users')
    res.json(response)
  })
)

userRouter.get(
  '/users/:id',
  authorizedFor([UserRole.Viewer, UserRole.Contributor]),
  validateData({ query: userSearchQuerySchema }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id']!
    logger.info('Start to get users')
    const user = await userService.getUserDetail(id)
    const response = userMapper.mapToResponse(user)
    logger.info('Successfully get users ')
    res.json(response)
  })
)

userRouter.delete(
  '/users/:id',
  authorizedFor([UserRole.Contributor]),
  validateData({ query: userSearchQuerySchema }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params['id']!
    logger.info('Start to get users')
    const user = await userService.delete(id)
    const response = userMapper.mapToResponse(user)
    logger.info('Successfully get users ')
    res.json(response)
  })
)

userRouter.post(
  '/users',
  authorizedFor([UserRole.Contributor]),
  validateData({ body: createUserSchema }),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const name = get(req.body, 'name')
    const email = get(req.body, 'email')
    logger.info(`Start to create a user`)
    const createdUser = await userService.add(name, email)
    const userResponse = userMapper.mapToResponse(createdUser)
    logger.info(`Successfully created user_id: ${createdUser.id}`)
    res.status(StatusCodes.CREATED).json(userResponse)
  })
)

export default userRouter
