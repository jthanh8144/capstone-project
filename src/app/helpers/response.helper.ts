import { MessageEncryptTypeEnum, MessageTypeEnum } from '../../shared/constants'
import { UserConservation } from './../typings/repository'
import { ConservationSetting, Message, SignalStore, User } from '../entities'

export const handleUserConservations = (
  userConservations: UserConservation[],
  userId: string,
) => {
  const conservations: Array<{
    id: string
    user: User
    signal: SignalStore
    latestMessage: Message
    setting: ConservationSetting
  }> = []
  for (const userConservation of userConservations) {
    const user = new User()
    user.id = userConservation['partner_id']
    user.email = userConservation['partner_email']
    user.fullName = userConservation['partner_full_name']
    user.avatarUrl = userConservation['partner_avatar_url']
    user.isVerified = userConservation['partner_is_verified']
    user.isActive = userConservation['partner_is_active']

    const signal = new SignalStore()
    signal.registrationId = userConservation['signalStores_registration_id']
    signal.ikPublicKey = userConservation['signalStores_ik_public_key']
    signal.spkKeyId = userConservation['signalStores_spk_key_id']
    signal.spkPublicKey = userConservation['signalStores_spk_public_key']
    signal.spkSignature = userConservation['signalStores_spk_signature']
    signal.pkKeyId = userConservation['signalStores_pk_key_id']
    signal.pkPublicKey = userConservation['signalStores_pk_public_key']

    const latestMessage = new Message()
    latestMessage.id = userConservation['message_id']
    latestMessage.message = userConservation['message_message']
    latestMessage.messageType =
      MessageTypeEnum[userConservation['message_message_type']]
    latestMessage.encryptType =
      MessageEncryptTypeEnum[
        MessageEncryptTypeEnum[userConservation['message_encrypt_type']]
      ]
    latestMessage.isRemoved = userConservation['message_is_removed']
    latestMessage.createdAt = userConservation['message_created_at']
    latestMessage.sender = new User()
    latestMessage.sender.id = userConservation['message_sender_id']
    if (userConservation['message_sender_id'] !== userId) {
      latestMessage.sender.fullName = userConservation['partner_full_name']
    }

    const setting = new ConservationSetting()
    setting.isMuted = userConservation['conservationSettings_is_muted']
    setting.isRemoved = userConservation['conservationSettings_is_removed']
    setting.isArchived = userConservation['conservationSettings_is_archived']
    setting.autoRemoveAfter =
      userConservation['conservationSettings_auto_remove_after']
    conservations.push({
      id: userConservation['conservation_id'],
      user,
      signal,
      latestMessage,
      setting,
    })
  }
  return conservations
}
