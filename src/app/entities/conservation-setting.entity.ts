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

@Entity({ name: 'conservation_settings' })
@Index(['userId', 'conservationId'], { unique: true })
export class ConservationSetting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'is_muted', default: false })
  isMuted: boolean

  @Column({ name: 'is_removed', default: false })
  isRemoved: boolean

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean

  @Column({ name: 'auto_remove_after', default: 30 })
  autoRemoveAfter: number

  @Column({ name: 'user_id' })
  userId: string

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

  @ManyToOne(() => User, (user) => user.conservationSettings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(
    () => Conservation,
    (conservation) => conservation.conservationSettings,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'conservation_id' })
  conservation: Conservation
}
