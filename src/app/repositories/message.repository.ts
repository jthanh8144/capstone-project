import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { LIMIT_CHAT_SELECTED } from '../../shared/constants'
import { Message } from '../entities'

export class MessageRepository extends Repository<Message> {
  constructor() {
    super(Message, dataSource.manager)
  }

  public getQueryLatestMessage() {
    return this.createQueryBuilder('message')
      .distinctOn(['message.conservationId'])
      .orderBy('message.conservationId')
      .addOrderBy('message.createdAt', 'DESC')
      .getQuery()
  }

  public getMessagesOfConservation(conservationId: string, offset = 1) {
    const limit = LIMIT_CHAT_SELECTED
    const skip = limit * offset - limit
    return this.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.conservationId = :conservationId')
      .select([
        'message.id',
        'message.message',
        'message.messageType',
        'message.encryptType',
        'message.isRemoved',
        'message.conservationId',
        'message.createdAt',
        'sender.id',
        'sender.avatarUrl',
      ])
      .setParameters({ conservationId })
      .orderBy('message.createdAt', 'DESC')
      .take(limit)
      .skip(skip)
      .getManyAndCount()
  }
}
