import {
  FriendEnum,
  MessageEncryptTypeEnum,
  MessageTypeEnum,
} from '../../shared/constants'
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
    signal.registrationId = userConservation['signalStore_registration_id']
    signal.ikPublicKey = userConservation['signalStore_ik_public_key']
    signal.spkKeyId = userConservation['signalStore_spk_key_id']
    signal.spkPublicKey = userConservation['signalStore_spk_public_key']
    signal.spkSignature = userConservation['signalStore_spk_signature']
    signal.pkKeyId = userConservation['signalStore_pk_key_id']
    signal.pkPublicKey = userConservation['signalStore_pk_public_key']

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

export const handleConservationWith = (
  userConservation: UserConservation,
  userId: string,
) => {
  let conservationId: string | null = null
  let user: User | null = null
  let signal: SignalStore | null = null
  let latestMessage: Message | null = null
  let setting: ConservationSetting | null = null
  if (userConservation['partner_id']) {
    conservationId = userConservation['conservation_id']

    user = new User()
    user.id = userConservation['partner_id']
    user.email = userConservation['partner_email']
    user.fullName = userConservation['partner_full_name']
    user.avatarUrl = userConservation['partner_avatar_url']
    user.isVerified = userConservation['partner_is_verified']
    user.isActive = userConservation['partner_is_active']

    signal = new SignalStore()
    signal.registrationId = userConservation['signalStore_registration_id']
    signal.ikPublicKey = userConservation['signalStore_ik_public_key']
    signal.spkKeyId = userConservation['signalStore_spk_key_id']
    signal.spkPublicKey = userConservation['signalStore_spk_public_key']
    signal.spkSignature = userConservation['signalStore_spk_signature']
    signal.pkKeyId = userConservation['signalStore_pk_key_id']
    signal.pkPublicKey = userConservation['signalStore_pk_public_key']

    latestMessage = new Message()
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

    setting = new ConservationSetting()
    setting.isMuted = userConservation['conservationSettings_is_muted']
    setting.isRemoved = userConservation['conservationSettings_is_removed']
    setting.isArchived = userConservation['conservationSettings_is_archived']
    setting.autoRemoveAfter =
      userConservation['conservationSettings_auto_remove_after']
  }
  return {
    id: conservationId,
    user,
    signal,
    latestMessage,
    setting,
  }
}

export const handleSearchUsers = (users: User[]) => {
  return users.map((user) => {
    user['friendStatus'] = 'NONE'
    if (
      (user.requestedFriendRequests.length &&
        user.requestedFriendRequests[0].status === FriendEnum.accepted) ||
      (user.receivedFriendRequests.length &&
        user.receivedFriendRequests[0].status === FriendEnum.accepted)
    ) {
      user['friendStatus'] = 'ADDED'
    } else if (
      user.requestedFriendRequests.length &&
      user.requestedFriendRequests[0].status === FriendEnum.pending
    ) {
      user['friendRequestId'] = user.requestedFriendRequests[0].id
      user['friendStatus'] = 'RECEIVER_PENDING'
    } else if (
      user.receivedFriendRequests.length &&
      user.receivedFriendRequests[0].status === FriendEnum.pending
    ) {
      user['friendRequestId'] = user.receivedFriendRequests[0].id
      user['friendStatus'] = 'REQUESTER_PENDING'
    } else if (
      user.receivedFriendRequests.length &&
      user.receivedFriendRequests[0].status === FriendEnum.declined
    ) {
      user['friendStatus'] = 'DECLINED'
    }
    delete user.requestedFriendRequests
    delete user.receivedFriendRequests
    return user
  })
}
