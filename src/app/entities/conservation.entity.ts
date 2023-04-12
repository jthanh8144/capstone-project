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
  OneToMany,
} from 'typeorm'
import { User, Participant, ConservationSetting } from '.'
import { ConservationEnum } from '../../shared/constants'

@Entity({ name: 'conservations' })
export class Conservation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'creator_id' })
  creatorId: string

  @Column({ type: 'enum', enum: ConservationEnum })
  type: ConservationEnum

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

  @ManyToOne(() => User, (user) => user.conservations)
  @JoinColumn({ name: 'creator_id' })
  creator: User

  @OneToMany(() => Participant, (participant) => participant.conservation)
  participants: Participant[]

  @OneToMany(
    () => ConservationSetting,
    (conservationSetting) => conservationSetting.conservation,
  )
  conservationSettings: ConservationSetting[]
}
