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
  await Promise.all(
    tokens.map((token) => {
      if (token) {
        message.send({ token, ...options })
      }
    }),
  )
}
