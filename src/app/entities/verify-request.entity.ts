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
} from 'typeorm'
import { User } from '.'
import { VerifyRequestStatusEnum } from '../../shared/constants'

@Entity({ name: 'verify_requests' })
export class VerifyRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: VerifyRequestStatusEnum })
  status: VerifyRequestStatusEnum

  @Column({ name: 'expired_time', type: 'timestamp' })
  expiredTime: Date

  @Column({ name: 'user_id' })
  userId: string

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

  @ManyToOne(() => User, (user) => user.verifyRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User
}
