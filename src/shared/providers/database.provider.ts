import dataSource from '../configs/data-source.config'
import { logger } from './logger.provider'

class DatabaseProvider {
  public async initialize() {
    try {
      await dataSource.initialize()
    } catch (err) {
      logger.error('Connect database fail')
    }
  }

  public async close() {
    await dataSource.destroy()
  }
}

export const databaseProvider = new DatabaseProvider()
