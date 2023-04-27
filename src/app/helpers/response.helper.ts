import { MessageTypeEnum } from '../../shared/constants'
import { UserConservation } from './../typings/repository'
import { ConservationSetting, Message, User } from '../entities'

export const handleUserConservations = (
  userConservations: UserConservation[],
  userId: string,
) => {
  const conservations: Array<{
    id: string
    user: User
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

    const latestMessage = new Message()
    latestMessage.id = userConservation['message_id']
    latestMessage.message = userConservation['message_message']
    latestMessage.messageType =
      MessageTypeEnum[userConservation['message_message_type']]
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
      latestMessage,
      setting,
    })
  }
  return conservations
}
