import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { UserHeader, UserRole } from '@src/middlewares/helper'

const authorizedFor = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const roleFromHeader = req.header(UserHeader.Role)
    const isAuthorized = roles.some((e) => e === roleFromHeader)
    if (isAuthorized) {
      next()
    } else {
      res.status(StatusCodes.FORBIDDEN).json({ message: '403 Forbidden' })
    }
  }
}

export default authorizedFor
