import {
  AndroidConfig,
  ApnsConfig,
  Notification,
  getMessaging,
} from 'firebase-admin/messaging'

export const pushNotification = async (
  tokens: string[],
  options?: {
    data?: {
      [key: string]: string
    }
    android?: AndroidConfig
    apns?: ApnsConfig
    notification?: Notification
  },
) => {
  const message = getMessaging()
  switch (tokens.length) {
    case 0:
      break
    case 1:
      await message.send({ token: tokens[0], ...options })
      break
    default:
      await message.sendEachForMulticast({ tokens, ...options })
  }
}
