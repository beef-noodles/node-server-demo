import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import InternalServerErrorException from '../exceptions/internal-server-error-exception'

import NotFoundException from '@src/exceptions/not-found-exception'

const exceptionHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  next(err)
  if (err instanceof InternalServerErrorException) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message })
  }
  if (err instanceof NotFoundException) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'An unexpected error occurred' })
}

export default exceptionHandlerMiddleware
