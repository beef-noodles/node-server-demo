import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { UnknownKeysParam, z, ZodError } from 'zod'

export enum ValidateType {
  Body = 'body',
  Params = 'params',
  Query = 'query',
}

export function validateData(
  schemas: Partial<{
    [key in ValidateType]: z.ZodObject<z.ZodRawShape, UnknownKeysParam>
  }>
) {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    for (const [key, schema] of Object.entries(schemas)) {
      try {
        schema.parse((req as never)[key])
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessages = error.errors.map((issue) => ({
            message: `${key}.${issue.path.join('.')} is ${issue.message}`,
          }))
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: 'Invalid data', details: errorMessages })
        } else {
          return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal Server Error' })
        }
      }
    }
    next()
  }
}
