import Queue, { QueueOptions } from 'bull'
import { environment } from '../constants'

const { redis, workerName } = environment

const queueConfig: QueueOptions = {
  redis: {
    host: redis.host,
    port: redis.port,
    password: redis.password,
  },
}

const eventQueue = new Queue(workerName.event, queueConfig)
const mailQueue = new Queue(workerName.mail, queueConfig)

export { eventQueue, mailQueue }
