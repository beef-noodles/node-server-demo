import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest'
import gracefulShutdown from '@src/utils/graceful-shutdown'
import logger from '@src/utils/logger'
import prisma from '@src/utils/db-clients'

describe('GracefulShutdown', () => {
  let processOnSpy: MockInstance
  beforeEach(() => {
    vi.clearAllMocks()
    processOnSpy = vi.spyOn(process, 'on')
  })

  it('should register signal handlers', () => {
    const processOnSpy = vi.spyOn(process, 'on')

    gracefulShutdown.register()

    expect(processOnSpy).toHaveBeenCalledTimes(3)
    expect(processOnSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function))
    expect(processOnSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function))
    expect(processOnSpy).toHaveBeenCalledWith('exit', expect.any(Function))
  })

  it('should log and teardown correctly when signal is received', async () => {
    const loggerInfoSpy = vi.spyOn(logger, 'info')
    const prismaDisconnectSpy = vi
      .spyOn(prisma, '$disconnect')
      .mockResolvedValue()
    const processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((_code) => _code as never)

    gracefulShutdown.register()
    const signalHandler = processOnSpy.mock.calls[0]![1]
    await signalHandler('SIGINT')

    expect(loggerInfoSpy).toHaveBeenCalledWith('Exit Code SIGINT received')
    expect(loggerInfoSpy).toHaveBeenCalledWith('Start to tear down')
    expect(prismaDisconnectSpy).toHaveBeenCalledTimes(1)
    expect(loggerInfoSpy).toHaveBeenCalledWith('Successfully tear down')
    expect(processExitSpy).toHaveBeenCalledTimes(1)
  })

  it('should teardown without errors', async () => {
    const loggerInfoSpy = vi.spyOn(logger, 'info')
    const prismaDisconnectSpy = vi
      .spyOn(prisma, '$disconnect')
      .mockResolvedValue()

    await gracefulShutdown['tearDown']()

    expect(loggerInfoSpy).toHaveBeenCalledWith('Start to tear down')
    expect(prismaDisconnectSpy).toHaveBeenCalledTimes(1)
    expect(loggerInfoSpy).toHaveBeenCalledWith('Successfully tear down')
  })
})
