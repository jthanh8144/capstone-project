import { eventQueue, mailQueue } from '../../../shared/configs/worker.config'
import { EventData, MailData } from '../../typings'

export const addEventJob = async (data: EventData) => {
  await eventQueue.add(data)
}

export const addMailJob = async (data: MailData) => {
  await mailQueue.add(data)
}
