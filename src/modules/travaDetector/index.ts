import { db } from '@lib/auth/prisma-query'
import { ZapType } from '@modules/zapConstructor'
import { MessageTypes } from 'whatsapp-web.js'

export async function travaDectetor({ message, ...zap }: ZapType) {
  const groupChat = await zap.getGroupChat()
  const groupId = groupChat.id._serialized

  const {
    id: { _serialized: userId },
  } = await zap.getUser()

  const isSenderAdmin = await zap.getUserIsAdmin(userId)

  if (message?.type !== MessageTypes.TEXT || isSenderAdmin) return

  const groupInfo = await db.getGroupInfo(groupId)

  if (groupInfo?.anti_trava?.status && groupInfo.anti_trava.max_characters) {
    const isBotAdmin = await zap.getBotAdmin()

    if (isBotAdmin) {
      if (
        message?.body &&
        message.body.length > groupInfo.anti_trava.max_characters
      ) {
        await Promise.all([
          message.delete(true),
          groupChat.removeParticipants([userId]),
        ])
      }
    } else {
      await db.updateGroupExceptParticipants(groupId, {
        antiTrava: {
          id: '',
          status: false,
          max_characters: groupInfo.anti_trava.max_characters,
        },
      })
    }
  }
}
