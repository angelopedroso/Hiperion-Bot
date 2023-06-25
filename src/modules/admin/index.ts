import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function banUser({ message, ...zap }: ZapType, userId: string) {
  const groupChat = await zap.getGroupChat()

  if (groupChat.isGroup) {
    const groupId = groupChat.id._serialized
    const user = await zap.getUser()
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (isAdmin) {
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
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}

export async function addUser({ message, ...zap }: ZapType, userId: string) {
  const groupChat = await zap.getGroupChat()

  if (groupChat.isGroup) {
    const user = await zap.getUser()
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (isAdmin) {
      const formattedUser = userId.replace(/[^a-zA-Z0-9]/g, '') + '@c.us'

      await groupChat.addParticipants([formattedUser])
      await message?.reply('👌🏼')
    }

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
