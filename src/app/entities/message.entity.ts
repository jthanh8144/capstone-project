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
import { User, Conservation } from '.'
import { MessageTypeEnum } from '../../shared/constants'

@Entity({ name: 'messages' })
@Index(['senderId', 'conservationId'])
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  message: string

  @Column({ name: 'message_type', type: 'enum', enum: MessageTypeEnum })
  messageType: MessageTypeEnum

  @Column({ name: 'is_removed', default: false })
  isRemoved: boolean

  @Column({ name: 'sender_id' })
  senderId: string

  @Column({ name: 'conservation_id' })
  conservationId: string

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

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'sender_id' })
  sender: User

  @ManyToOne(
    () => Conservation,
    (conservation) => conservation.conservationSettings,
  )
  @JoinColumn({ name: 'conservation_id' })
  conservation: Conservation
}
