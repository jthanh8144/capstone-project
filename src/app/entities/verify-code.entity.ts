import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm'

@Entity({ name: 'verify_codes' })
@Index(['email', 'code'])
export class VerifyCode extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  email: string

  @Column()
  code: string

  @Column({ name: 'is_used', default: false })
  isUsed: boolean

  @Column({ name: 'expired_time', type: 'timestamp' })
  expiredTime: Date

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
}
