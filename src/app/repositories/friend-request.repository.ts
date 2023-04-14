import { Repository } from 'typeorm'
import dataSource from '../../shared/configs/data-source.config'
import { FriendEnum } from '../../shared/constants'
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

  public getSendedFriendRequest(userId: string) {
    return this.createQueryBuilder('friendRequest')
      .where('friendRequest.requesterId = :userId')
      .andWhere('friendRequest.status != :status')
      .setParameters({ userId, status: FriendEnum.accepted })
      .getMany()
  }

  public getReceivedFriendRequest(userId: string) {
    return this.createQueryBuilder('friendRequest')
      .where('friendRequest.receiverId = :userId')
      .andWhere('friendRequest.status != :status')
      .setParameters({ userId, status: FriendEnum.accepted })
      .getMany()
  }

  public async updateFriendRequest(id: string, data: UpdateFriendRequestDto) {
    await this.createQueryBuilder()
      .update(FriendRequest)
      .set({ ...data })
      .where('id = :id')
      .setParameters({ id })
      .execute()
  }

  public async getFriendsListOfUser(userId: string) {
    const friendRequests = await this.createQueryBuilder('friendRequest')
      .leftJoinAndSelect('friendRequest.requester', 'requester')
      .leftJoinAndSelect('friendRequest.receiver', 'receiver')
      .where(
        '(friendRequest.requesterId = :userId OR friendRequest.receiverId = :userId)',
      )
      .andWhere('friendRequest.status = :status')
      .setParameters({ userId, status: FriendEnum.accepted })
      .getMany()
    return friendRequests.map((item) => {
      if (item.receiverId === userId) {
        return item.requester
      }
      if (item.requesterId === userId) {
        return item.receiver
      }
    })
  }
}
