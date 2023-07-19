import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'
import { BOT_NUM } from '@utils/envs'

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

      const inGroup = groupChat.participants.find(
        (t) => t.id._serialized === user.id._serialized,
      )

      if (inGroup) {
        groupChat.removeParticipants([user.id._serialized])
      }

      const allGroups = await db.getAllGroups()

      const blackList = db.addToBlacklist(groupId, user.id.user, allGroups)

      await prisma.$transaction(blackList)

      message.react('😈')

      return
    }

    if (userId) {
      const user = userId.replace('@', '')
      const formattedUser = `${user}@c.us`

      const inGroup = groupChat.participants.find(
        (t) => t.id._serialized === formattedUser,
      )

      if (inGroup) {
        groupChat.removeParticipants([formattedUser])
      }

      const allGroups = await db.getAllGroups()

      const blackList = db.addToBlacklist(groupId, user, allGroups)

      await prisma.$transaction(blackList)

      message?.react('😈')

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
      message?.reply(zap.translateMessage('general', 'botisnotadmin'))
      return
    }

    if (!isAdmin) {
      message?.react('❌')
      return
    }

    const formattedUser = userId.replace(/[^a-zA-Z0-9]/g, '') + '@c.us'

    const alreadyJoined = groupChat.participants.find(
      (t) => t.id._serialized === formattedUser,
    )

    if (alreadyJoined) {
      message?.react('❌')
      return
    }

    try {
      await groupChat.addParticipants([formattedUser])
      message?.react('👌🏼')
    } catch (error) {
      message?.react('⚠')
    }

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

    if (!isAdmin || user.id.user === BOT_NUM) {
      await message?.react('❌')
      return
    }

    if (message?.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage()
      const user = await quotedMsg.getContact()
      const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

      if (isAdmin) {
        await message?.react('❌')
        return
      }

      groupChat.promoteParticipants([user.id._serialized])

      await message.react('😇')

      return
    }

    if (userId) {
      const user = userId.replace('@', '')
      const formattedUser = `${user}@c.us`
      const isAdmin = await zap.getUserIsAdmin(formattedUser)

      if (isAdmin || user === BOT_NUM) {
        await message?.react('❌')
        return
      }

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
      const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

      if (!isAdmin || user.id.user === BOT_NUM) {
        await message?.react('❌')
        return
      }

      groupChat.demoteParticipants([user.id._serialized])

      await message.react('😇')

      return
    }

    if (userId) {
      const user = userId.replace('@', '')
      const formattedUser = `${user}@c.us`
      const isAdmin = await zap.getUserIsAdmin(formattedUser)

      if (!isAdmin || user === BOT_NUM) {
        await message?.react('❌')
        return
      }

      groupChat.demoteParticipants([formattedUser])

      await message?.react('😇')
    }

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
