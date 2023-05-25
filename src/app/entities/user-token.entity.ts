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

@Entity({ name: 'user_tokens' })
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  token: string

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

  @ManyToOne(() => User, (user) => user.userTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User
}
