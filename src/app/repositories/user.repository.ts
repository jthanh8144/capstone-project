import { UserConservation } from './../typings/repository'
import { Repository } from 'typeorm'

import dataSource from '../../shared/configs/data-source.config'
import {
  LIMIT_CONSERVATION_SELECTED,
  LIMIT_USER_SELECTED,
} from '../../shared/constants'
import { MessageRepository } from './message.repository'
import { User } from '../entities'
import { CreateUserDto } from '../dtos'

export class UserRepository extends Repository<User> {
  private messageRepository: MessageRepository
  constructor() {
    super(User, dataSource.manager)
    this.messageRepository = new MessageRepository()
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

  public async countTotalConservationsOfUser(userId: string) {
    const data = await this.createQueryBuilder('user')
      .select(['user.id'])
      .leftJoinAndSelect('user.participants', 'participants')
      .leftJoinAndSelect('participants.conservation', 'conservation')
      .leftJoinAndSelect(
        `(${this.messageRepository.getQueryLatestMessage()})`,
        'message',
        'message.message_conservation_id = conservation.id',
      )
      .leftJoinAndSelect(
        'conservation.participants',
        'participant',
        'conservation.id = participant.conservationId AND participant.userId != :userId',
      )
      .leftJoinAndSelect(
        'conservation.conservationSettings',
        'conservationSettings',
        'conservationSettings.conservationId = conservation.id AND conservationSettings.userId = :userId',
      )
      .where('user.id = :userId')
      .andWhere('conservationSettings.isRemoved = false')
      .orderBy('message.message_created_at', 'DESC')
      .setParameters({ userId })
      .getOne()
    return data?.participants?.length || 0
  }

  public getConservationsOfUser(
    userId: string,
    page = 1,
  ): Promise<UserConservation[]> {
    const limit = LIMIT_CONSERVATION_SELECTED
    const skip = limit * page - limit
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.participants', 'participants')
      .leftJoinAndSelect('participants.conservation', 'conservation')
      .leftJoinAndSelect(
        `(${this.messageRepository.getQueryLatestMessage()})`,
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
      .leftJoinAndSelect('partner.signalStore', 'signalStore')
      .where('user.id = :userId')
      .andWhere('conservationSettings.isRemoved = false')
      .orderBy('message.message_created_at', 'DESC')
      .setParameters({ userId })
      .limit(limit)
      .offset(skip)
      .getRawMany()
  }

  public getConservationWithUser(
    userId: string,
    partnerId: string,
  ): Promise<UserConservation> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.participants',
        'participants',
        'participants.userId = user.id',
      )
      .leftJoinAndSelect('participants.conservation', 'conservation')
      .leftJoinAndSelect(
        `(${this.messageRepository.getQueryLatestMessage()})`,
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
      .leftJoinAndSelect('partner.signalStore', 'signalStore')
      .where('user.id = :userId')
      .andWhere('conservationSettings.isRemoved = false')
      .andWhere('partner.id = :partnerId')
      .orderBy('message.message_created_at', 'DESC')
      .setParameters({ userId, partnerId })
      .getRawOne()
  }

  public searchUser(userId: string, q: string, page = 1) {
    const limit = LIMIT_USER_SELECTED
    const skip = limit * page - limit
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.signalStore', 'signalStore')
      .leftJoinAndSelect(
        'user.requestedFriendRequests',
        'requested',
        'user.id = requested.requesterId AND requested.receiverId = :userId',
      )
      .leftJoinAndSelect(
        'user.receivedFriendRequests',
        'received',
        'user.id = received.receiverId AND received.requesterId = :userId',
      )
      .where('(user.email ILIKE :q AND user.isActive = true)')
      .andWhere('user.id != :userId')
      .setParameters({ userId, q })
      .orderBy('user.email', 'ASC')
      .take(limit)
      .skip(skip)
      .getManyAndCount()
  }
}

// #region typing
type UpdateUserType = {
  isVerified?: boolean
  isActive?: boolean
  fullName?: string
  password?: string
  avatarUrl?: string
  isOnline?: boolean
}
// #endregion
