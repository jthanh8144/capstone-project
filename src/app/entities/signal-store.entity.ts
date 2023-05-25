import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { User } from '.'

@Entity({ name: 'signal_stores' })
export class SignalStore extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'registration_id' })
  registrationId: number

  @Column({
    type: 'text',
    name: 'ik_public_key',
  })
  ikPublicKey: string

  @Column({ name: 'spk_key_id' })
  spkKeyId: number

  @Column({
    type: 'text',
    name: 'spk_public_key',
  })
  spkPublicKey: string

  @Column({
    type: 'text',
    name: 'spk_signature',
  })
  spkSignature: string

  @Column({ name: 'pk_key_id' })
  pkKeyId: number

  @Column({
    type: 'text',
    name: 'pk_public_key',
  })
  pkPublicKey: string

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

  @OneToOne(() => User, (user) => user.signalStore, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User
}
