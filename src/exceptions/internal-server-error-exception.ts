import logger from '../utils/logger'

export default class InternalServerErrorException extends Error {
  constructor(message: string) {
    super(message)
    logger.error(message)
  }
}
