import { schedule } from 'node-cron'

import { MessageRepository } from '../../app/repositories'
import { logger } from './logger.provider'

class CronProvider {
  public initialize() {
    schedule('0 * * * *', this.run)
  }

  private async run() {
    try {
      const messageRepository = new MessageRepository()
      await messageRepository.removeMessagesAfter30Days()
    } catch (err: any) {
      logger.log(err)
    }
  }
}

export const cronProvider = new CronProvider()
