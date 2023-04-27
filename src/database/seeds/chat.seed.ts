import 'dotenv/config'

import { databaseProvider } from '../../shared/providers/database.provider'
import { ConservationEnum, MessageTypeEnum } from '../../shared/constants'
import {
  ConservationRepository,
  ConservationSettingRepository,
  MessageRepository,
  ParticipantRepository,
} from '../../app/repositories'
;(async () => {
  await databaseProvider.initialize()
  const conservationRepository = new ConservationRepository()
  const participantRepository = new ParticipantRepository()
  const messageRepository = new MessageRepository()
  const conservationSettingRepository = new ConservationSettingRepository()

  const userId1 = 'a0f0b95a-eea5-4804-8f0a-4924d1362c6b' // thanhvo618
  const userId2 = '42284235-1214-4a6f-ad75-234850368043' // thanh.vo
  const conservation = await conservationRepository.save(
    conservationRepository.create({
      creatorId: userId1,
      type: ConservationEnum.secret,
    }),
  )
  await conservationSettingRepository.save([
    conservationSettingRepository.create({ conservation, userId: userId1 }),
    conservationSettingRepository.create({ conservation, userId: userId2 }),
  ])
  await participantRepository.save([
    participantRepository.create({
      conservationId: conservation.id,
      userId: userId1,
    }),
    participantRepository.create({
      conservationId: conservation.id,
      userId: userId2,
    }),
  ])
  await messageRepository.save([
    messageRepository.create({
      message: 'hello',
      messageType: MessageTypeEnum.text,
      senderId: userId1,
      conservation,
    }),
    messageRepository.create({
      message: 'hi',
      messageType: MessageTypeEnum.text,
      senderId: userId2,
      conservation,
    }),
    messageRepository.create({
      message: 'tao la thanh',
      messageType: MessageTypeEnum.text,
      senderId: userId1,
      conservation,
    }),
    messageRepository.create({
      message: 'may la ai',
      messageType: MessageTypeEnum.text,
      senderId: userId1,
      conservation,
    }),
    messageRepository.create({
      message: 'tao la may😀',
      messageType: MessageTypeEnum.text,
      senderId: userId2,
      conservation,
    }),
  ])
  await databaseProvider.close()
})()
