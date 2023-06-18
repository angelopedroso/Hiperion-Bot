import { GroupChat, GroupNotification } from 'whatsapp-web.js'
import { client } from '@config/startupConfig'

import { PrismaQuery } from '@lib/auth/prisma-query'

import { printError } from 'cli/terminal'

export async function bemVindo(notification: GroupNotification) {
  const db = PrismaQuery()

  const chat = await client.getChatById(notification.chatId)

  if (chat.isGroup) {
    const groupChat = chat as GroupChat

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

        const answer = await db.addParticipantInGroup(
          formattedUser,
          chat.id._serialized,
        )

        if (answer === 'ban') {
          groupChat.removeParticipants([user])
          client.sendMessage(
            notification.chatId,
            'Só é permitido estar em um grupo.',
          )
        }
      }
    } catch (error: Error | any) {
      printError(error)
    }
  }
}
