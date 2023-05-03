import { UserConservation } from './../typings/repository'
import { Repository } from 'typeorm'

import dataSource from '../../shared/configs/data-source.config'
import { MessageRepository } from './message.repository'
import { User } from '../entities'
import { CreateUserDto } from '../dtos'

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, dataSource.manager)
  }

  public getUserByEmail(email: string) {
    return this.findOne({ where: { email } })
  }

  public createUser(data: CreateUserDto) {
    return this.save(this.create(data))
  }

  public async updateUser(id: string, data: UpdateUserType) {
    await this.createQueryBuilder()
      .update(User)
      .set({ ...data })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

  public getUserIncludePassword(email: string) {
    return this.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'isActive'],
    })
  }

  public getConservationsOfUser(userId: string): Promise<UserConservation[]> {
    const messageRepository = new MessageRepository()
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.participants', 'participants')
      .leftJoinAndSelect('participants.conservation', 'conservation')
      .leftJoinAndSelect(
        `(${messageRepository.getQueryLatestMessage()})`,
        'message',
        'message.message_conservation_id = conservation.id',
      )
      .leftJoinAndSelect(
        'conservation.participants',
        'participant',
        'conservation.id = participant.conservationId AND participant.userId != :userId',
      )
      .leftJoinAndSelect('participant.user', 'partner')
      .leftJoinAndSelect(
        'conservation.conservationSettings',
        'conservationSettings',
        'conservationSettings.conservationId = conservation.id AND conservationSettings.userId = :userId',
      )
      .where('user.id = :userId')
      .andWhere('conservationSettings.isRemoved = false')
      .orderBy('message.message_created_at', 'DESC')
      .setParameters({ userId })
      .getRawMany()
  }
}

// #region typing
type UpdateUserType = {
  isVerified?: boolean
  isActive?: boolean
  fullName?: string
  password?: string
  avatarUrl?: string
}
// #endregion
