import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { UserHeader, UserRole } from '@src/middlewares/helper'

const schema = z.object({
  name: z.string().min(1),
  role: z.nativeEnum(UserRole),
})

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    name: req.header(UserHeader.Name),
    role: req.header(UserHeader.Role),
  })
  if (result.success) {
    next()
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: '401 Unauthorized' })
  }
}

export default authMiddleware
