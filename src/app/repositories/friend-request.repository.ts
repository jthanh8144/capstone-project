import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { FriendEnum, LIMIT_FRIEND_SELECTED } from '../../shared/constants'
import { UpdateFriendRequestDto } from '../dtos'
import { FriendRequest } from '../entities'

export class FriendRequestRepository extends Repository<FriendRequest> {
  constructor() {
    super(FriendRequest, dataSource.manager)
  }

  public getBy2UserId(userIdFirst: string, userIdSecond: string) {
    return this.createQueryBuilder('friendRequest')
      .where(
        '(friendRequest.requesterId = :userIdFirst AND friendRequest.receiverId = :userIdSecond)',
      )
      .orWhere(
        '(friendRequest.requesterId = :userIdSecond AND friendRequest.receiverId = :userIdFirst)',
      )
      .setParameters({ userIdFirst, userIdSecond })
      .getOne()
  }

  public getSendedFriendRequest(userId: string, offset = 1) {
    const limit = LIMIT_FRIEND_SELECTED
    const skip = limit * offset - limit
    return this.createQueryBuilder('friendRequest')
      .leftJoinAndSelect('friendRequest.receiver', 'receiver')
      .where('friendRequest.requesterId = :userId')
      .andWhere('friendRequest.status != :status')
      .setParameters({ userId, status: FriendEnum.accepted })
      .take(limit)
      .skip(skip)
      .getManyAndCount()
  }

  public getReceivedFriendRequest(userId: string, offset = 1) {
    const limit = LIMIT_FRIEND_SELECTED
    const skip = limit * offset - limit
    return this.createQueryBuilder('friendRequest')
      .leftJoinAndSelect('friendRequest.requester', 'requester')
      .where('friendRequest.receiverId = :userId')
      .andWhere('friendRequest.status != :status')
      .andWhere('friendRequest.status != :declined')
      .setParameters({
        userId,
        status: FriendEnum.accepted,
        declined: FriendEnum.declined,
      })
      .take(limit)
      .skip(skip)
      .getManyAndCount()
  }

  public async updateFriendRequest(id: string, data: UpdateFriendRequestDto) {
    await this.createQueryBuilder()
      .update(FriendRequest)
      .set({ ...data })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

  public async getFriendsListOfUser(userId: string, offset = 1, q?: string) {
    const limit = LIMIT_FRIEND_SELECTED
    const skip = limit * offset - limit
    const [friendRequests, total] = await this.createQueryBuilder(
      'friendRequest',
    )
      .leftJoinAndSelect('friendRequest.requester', 'requester')
      .leftJoinAndSelect('friendRequest.receiver', 'receiver')
      .leftJoinAndSelect('requester.signalStore', 'requestSignal')
      .leftJoinAndSelect('receiver.signalStore', 'receiverSignal')
      .where(
        '(friendRequest.requesterId = :userId OR friendRequest.receiverId = :userId)',
      )
      .andWhere('friendRequest.status = :status')
      .setParameters({ userId, status: FriendEnum.accepted })
      .orderBy('friendRequest.createdAt', 'ASC')
      .take(limit)
      .skip(skip)
      .getManyAndCount()
    const result = friendRequests.map((item) => {
      if (item.receiverId === userId) {
        return item.requester
      }
      if (item.requesterId === userId) {
        return item.receiver
      }
    })
    return {
      friends: q
        ? result.filter(
            (item) =>
              item.fullName.toUpperCase().includes(q.toUpperCase()) ||
              item.email.toUpperCase().includes(q.toUpperCase()),
          )
        : result,
      total,
    }
  }
}
