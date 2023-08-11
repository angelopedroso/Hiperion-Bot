import { GroupChat, GroupNotification } from 'whatsapp-web.js'
import { client } from '@config/startupConfig'

import { db } from '@lib/auth/prisma-query'

import { printError } from '@cli/terminal'
import { ZapConstructor } from '@modules/zapConstructor'
import i18next from 'i18next'

export async function bemVindo(notification: GroupNotification) {
  const chat = await client.getChatById(notification.chatId)
  const zap = ZapConstructor()

  if (chat.isGroup) {
    const groupChat = chat as GroupChat

    const groupInfo = await db.getGroupInfo(groupChat.id._serialized)

    if (groupInfo?.bem_vindo) {
      const postalCode = ['55', '351']
      const lang = i18next.language

      try {
        for (const user of notification.recipientIds) {
          const countryCode = await client.getCountryCode(user)

          const formattedUser = user.replace('@c.us', '')

          if (!postalCode.includes(countryCode) && i18next.language === 'pt') {
            await i18next.changeLanguage('en')

            await client.sendMessage(
              notification.chatId,
              zap.translateMessage('welcome', 'message', {
                user: formattedUser,
                group: chat.name,
              }),
              {
                mentions: [user],
              },
            )

            await i18next.changeLanguage(lang)

            return
          }

          await client.sendMessage(
            notification.chatId,
            zap.translateMessage('welcome', 'message', {
              user: formattedUser,
              group: chat.name,
            }),
            {
              mentions: [user],
            },
          )
        }
      } catch (error: Error | any) {
        printError(error)
      }
    }
  }
}
