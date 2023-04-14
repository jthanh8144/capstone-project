import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm'
import {
  Conservation,
  ConservationSetting,
  FriendRequest,
  Message,
  Participant,
  UserToken,
  VerifyRequest,
} from '.'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column({ name: 'full_name', nullable: true })
  fullName: string

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean

  @Column({ name: 'is_active', default: true })
  isActive: boolean

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date

  @DeleteDateColumn({
    name: 'deleted_at',
  })
  deletedAt: Date

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.requester)
  requestedFriendRequests: FriendRequest[]

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[]

  @OneToMany(() => Conservation, (conservation) => conservation.creator)
  conservations: Conservation[]

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Participant[]

  @OneToMany(
    () => ConservationSetting,
    (conservationSetting) => conservationSetting.user,
  )
  conservationSettings: ConservationSetting[]

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[]

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  userTokens: UserToken[]

  @OneToMany(() => VerifyRequest, (verifyRequest) => verifyRequest.user)
  verifyRequests: VerifyRequest[]
}
