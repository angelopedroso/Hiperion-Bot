import { GroupChat, GroupNotification } from 'whatsapp-web.js'
import { client } from '@config/startupConfig'

import { db } from '@lib/auth/prisma-query'

import { printError } from 'cli/terminal'
import { ZapConstructor } from '@modules/zapConstructor'

export async function bemVindo(notification: GroupNotification) {
  const chat = await client.getChatById(notification.chatId)
  const zap = ZapConstructor()

  if (chat.isGroup) {
    const groupChat = chat as GroupChat

    const groupInfo = await db.getGroupInfo(groupChat.id._serialized)

    if (groupInfo?.bem_vindo) {
      try {
        for (const user of notification.recipientIds) {
          const userId = await client.getContactById(user)

          const formattedUser = user.replace('@c.us', '')

          await client.sendMessage(
            notification.chatId,
            zap.translateMessage('bemvindo.message', {
              user: formattedUser,
              group: chat.name,
            }),
            {
              mentions: [userId],
            },
          )
        }
      } catch (error: Error | any) {
        printError(error)
      }
    }
  }
}
