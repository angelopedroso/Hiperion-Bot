import { client } from '@config/startupConfig'
import { db } from '@lib/auth/prisma-query'
import { ZapConstructor } from '@modules/zapConstructor'
import { GroupChat, GroupNotification } from 'whatsapp-web.js'

export async function addNewUser(notification: GroupNotification) {
  const chat = (await notification.getChat()) as GroupChat
  const zap = ZapConstructor()
  const groupInfo = await db.getGroupInfo(chat.id._serialized)
  const isBotAdmin = await zap.isBotAdmin()

  Promise.all(
    notification.recipientIds.map(async (user) => {
      const { pushname, shortName } = await client.getContactById(user)
      const imageUrl = await client.getProfilePicUrl(user)

      const formattedUser = user.replace('@c.us', '')

      const blackListGroup = groupInfo?.black_list.find(
        (p) => p.p_id === formattedUser,
      )

      if (isBotAdmin && blackListGroup) {
        chat.removeParticipants([user])
        return
      }

      const answer = await db.addParticipantInGroup(
        {
          userId: formattedUser,
          pushname: pushname || shortName || 'Undefined',
          imageUrl,
        },
        chat.id._serialized,
      )

      if (isBotAdmin && answer === 'ban' && groupInfo?.one_group) {
        chat.removeParticipants([user])
        client.sendMessage(
          notification.chatId,
          zap.translateMessage('welcome', 'onegroup'),
        )
      }
    }),
  )
}
