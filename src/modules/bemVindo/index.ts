import { client } from '@config/startupConfig'
import { printError } from 'cli/terminal'
import { PrismaQuery } from 'lib/auth/prisma-query'
import { GroupNotification } from 'whatsapp-web.js'

export async function bemVindo(notification: GroupNotification) {
  const db = PrismaQuery()

  const chat = await client.getChatById(notification.chatId)

  if (chat.isGroup) {
    try {
      for (const user of notification.recipientIds) {
        const userId = await client.getContactById(user)

        const formattedUser = user.replace('@c.us', '')

        await client.sendMessage(
          notification.chatId,
          `Bem vindo(a) @${formattedUser} ao grupo *${chat.name}*, leia as regras digitando *!regras* 😉`,
          {
            mentions: [userId],
          },
        )

        await db.addParticipantInGroup(formattedUser, chat.id._serialized)
      }
    } catch (error: Error | any) {
      printError(error.message)
    }
  }
}
