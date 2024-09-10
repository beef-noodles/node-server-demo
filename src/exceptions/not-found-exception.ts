import logger from '../utils/logger'

export default class NotFoundException extends Error {
  constructor(message: string) {
    super(message)
    logger.error(message)
  }
}
