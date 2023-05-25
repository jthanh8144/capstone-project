import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm'
import { User } from '.'
import { FriendEnum } from '../../shared/constants'

@Entity({ name: 'friend_requests' })
@Index(['requesterId', 'receiverId'], { unique: true })
export class FriendRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: FriendEnum })
  status: FriendEnum

  @Column({ name: 'requester_id' })
  requesterId: string

  @Column({ name: 'receiver_id' })
  receiverId: string

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

  @ManyToOne(() => User, (user) => user.requestedFriendRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requester_id' })
  requester: User

  @ManyToOne(() => User, (user) => user.receivedFriendRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: User
}
