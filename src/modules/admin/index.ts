import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function banUser({ message, ...zap }: ZapType, userId: string) {
  const groupChat = await zap.getGroupChat()

  if (groupChat.isGroup) {
    const groupId = groupChat.id._serialized

    if (message?.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage()
      const user = await quotedMsg.getContact()

      groupChat.removeParticipants([user.id._serialized])

      const allGroups = await db.getAllGroups()

      const blackList = db.addToBlacklist(groupId, user.id.user, allGroups)

      prisma.$transaction(blackList)

      await message.react('😈')

      return
    }

    if (userId) {
      const user = userId.replace('@', '')
      const formattedUser = `${user}@c.us`

      groupChat.removeParticipants([formattedUser])

      const allGroups = await db.getAllGroups()

      const blackList = db.addToBlacklist(groupId, user, allGroups)

      prisma.$transaction(blackList)

      await message?.react('😈')
    }

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
