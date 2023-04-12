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
import { Conservation, User } from '.'

@Entity({ name: 'participants' })
export class Participant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'conservation_id' })
  conservationId: string

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

  @ManyToOne(() => Conservation, (conservation) => conservation.participants)
  @JoinColumn({ name: 'conservation_id' })
  conservation: Conservation

  @ManyToOne(() => User, (user) => user.participants)
  @JoinColumn({ name: 'user_id' })
  user: User
}
