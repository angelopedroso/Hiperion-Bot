import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'
import { GroupNotification } from 'whatsapp-web.js'

export async function removeFromGroup(notification: GroupNotification) {
  const query: any[] = []

  notification.recipientIds.map(async (user) => {
    const formattedUser = user.replace('@c.us', '')
    query.push(
      db.removeParticipantsFromGroup(formattedUser, notification.chatId),
    )
  })
  prisma.$transaction(query)
}
