import { client } from '@config/startupConfig'
import { db } from '@lib/auth/prisma-query'
import { ZapConstructor } from '@modules/zapConstructor'
import { GroupChat, GroupNotification } from 'whatsapp-web.js'

export async function addNewUser(notification: GroupNotification) {
  const chat = (await notification.getChat()) as GroupChat
  const zap = ZapConstructor()
  const groupInfo = await db.getGroupInfo(chat.id._serialized)

  notification.recipientIds.map(async (user) => {
    const formattedUser = user.replace('@c.us', '')

    const answer = await db.addParticipantInGroup(
      formattedUser,
      chat.id._serialized,
    )

    if (answer === 'ban' && groupInfo?.one_group) {
      chat.removeParticipants([user])
      client.sendMessage(
        notification.chatId,
        zap.translateMessage('welcome', 'onegroup'),
      )
    }
  })
}
