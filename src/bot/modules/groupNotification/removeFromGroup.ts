import { db } from '@lib/auth/prisma-query'
import { GroupNotification } from 'whatsapp-web.js'

export async function removeFromGroup(notification: GroupNotification) {
  Promise.all(
    notification.recipientIds.map(async (user) => {
      const formattedUser = user.replace('@c.us', '')

      await db.removeParticipantsFromGroup(formattedUser, notification.chatId)
    }),
  )
}
