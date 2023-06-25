import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function banUser({ message, ...zap }: ZapType, userId: string) {
  const groupChat = await zap.getGroupChat()
  const isBotAdmin = await zap.isBotAdmin()

  if (groupChat.isGroup) {
    const groupId = groupChat.id._serialized
    const user = await zap.getUser()
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (!isBotAdmin) {
      await message?.reply(zap.translateMessage('general', 'botisnotadmin'))
      return
    }

    if (!isAdmin) {
      await message?.react('❌')
      return
    }

    if (message?.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage()
      const user = await quotedMsg.getContact()

      groupChat.removeParticipants([user.id._serialized])

      const allGroups = await db.getAllGroups()

      const blackList = db.addToBlacklist(groupId, user.id.user, allGroups)

      await prisma.$transaction(blackList)

      await message.react('😈')

      return
    }

    if (userId) {
      const user = userId.replace('@', '')
      const formattedUser = `${user}@c.us`

      groupChat.removeParticipants([formattedUser])

      const allGroups = await db.getAllGroups()

      const blackList = db.addToBlacklist(groupId, user, allGroups)

      await prisma.$transaction(blackList)

      await message?.react('😈')

      return
    }
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}

export async function addUser({ message, ...zap }: ZapType, userId: string) {
  const groupChat = await zap.getGroupChat()
  const isBotAdmin = await zap.isBotAdmin()

  if (groupChat.isGroup) {
    const user = await zap.getUser()
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (!isBotAdmin) {
      await message?.reply(zap.translateMessage('general', 'botisnotadmin'))
      return
    }

    if (!isAdmin) {
      await message?.react('❌')
      return
    }

    const formattedUser = userId.replace(/[^a-zA-Z0-9]/g, '') + '@c.us'

    await groupChat.addParticipants([formattedUser])
    await message?.react('👌🏼')

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}

export async function promoteUser(
  { message, ...zap }: ZapType,
  userId: string,
) {
  const groupChat = await zap.getGroupChat()
  const isBotAdmin = await zap.isBotAdmin()

  if (groupChat.isGroup) {
    const user = await zap.getUser()
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (!isBotAdmin) {
      await message?.reply(zap.translateMessage('general', 'botisnotadmin'))
      return
    }

    if (!isAdmin) {
      await message?.react('❌')
      return
    }

    if (message?.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage()
      const user = await quotedMsg.getContact()

      groupChat.promoteParticipants([user.id._serialized])

      await message.react('😇')

      return
    }

    if (userId) {
      const user = userId.replace('@', '')
      const formattedUser = `${user}@c.us`

      groupChat.promoteParticipants([formattedUser])

      await message?.react('😇')
    }

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}

export async function demoteUser({ message, ...zap }: ZapType, userId: string) {
  const groupChat = await zap.getGroupChat()
  const isBotAdmin = await zap.isBotAdmin()

  if (groupChat.isGroup) {
    const user = await zap.getUser()
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (!isBotAdmin) {
      await message?.reply(zap.translateMessage('general', 'botisnotadmin'))
      return
    }

    if (!isAdmin) {
      await message?.react('❌')
      return
    }

    if (message?.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage()
      const user = await quotedMsg.getContact()

      groupChat.demoteParticipants([user.id._serialized])

      await message.react('😇')

      return
    }

    if (userId) {
      const user = userId.replace('@', '')
      const formattedUser = `${user}@c.us`

      groupChat.demoteParticipants([formattedUser])

      await message?.react('😇')
    }

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
