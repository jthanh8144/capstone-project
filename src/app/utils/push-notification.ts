import { getMessaging } from 'firebase-admin/messaging'

export const pushNotification = async (
  tokens: string[],
  notification: { title: string; body?: string; imageUrl?: string },
) => {
  const message = getMessaging()
  await Promise.all(
    tokens.map((token) => {
      if (token) {
        message.send({ notification, token })
      }
    }),
  )
}
