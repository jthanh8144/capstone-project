import dataSource from '../configs/data-source.config'

class DatabaseProvider {
  public async initialize() {
    await dataSource.initialize()
  }

  public async close() {
    await dataSource.destroy()
  }
}

export const databaseProvider = new DatabaseProvider()
