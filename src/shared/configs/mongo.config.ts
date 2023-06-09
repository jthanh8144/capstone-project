import { MongoClient } from 'mongodb'
import { environment } from '../constants'

export default new MongoClient(
  `mongodb://${environment.mongo.user}:${environment.mongo.password}@${environment.mongo.host}:27017/?authMechanism=DEFAULT`,
)
