import logger from './logger'
import prisma from './db-clients'

class GracefulShutdown {
  signals: Array<string> = ['SIGINT', 'SIGTERM', 'exit']

  async register() {
    this.signals.forEach((signal: string) => {
      process.on(signal, async (code): Promise<never> => {
        logger.info(`Exit Code ${code} received`)
        await this.tearDown()
        process.exit()
      })
    })
  }

  private async tearDown() {
    logger.info('Start to tear down')
    await prisma.$disconnect()
    logger.info('Successfully tear down')
  }
}

const gracefulShutdown = new GracefulShutdown()
export default gracefulShutdown
