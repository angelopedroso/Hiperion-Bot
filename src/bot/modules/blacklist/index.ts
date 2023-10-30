import { db } from '@lib/auth/prisma-query'
import { prisma, redis } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'
import { printError } from '@cli/terminal'

export async function addUserInBlackList(
  { message, ...zap }: ZapType,
  userId: string,
) {
  const groupChat = await zap.getGroupChat()

  if (groupChat.isGroup) {
    const user = await zap.getUser()
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (isAdmin) {
      const formattedUser = userId.replace(/[^a-zA-Z0-9]/g, '')

      try {
        const allGroups = await db.getAllGroups()

        const res = await db.addToBlacklist(
          groupChat.id._serialized,
          formattedUser,
          allGroups,
        )

        if (res) {
          await groupChat.removeParticipants([formattedUser])
        }

        message?.react('👌🏼')
      } catch (error: Event | any) {
        await message?.reply(zap.translateMessage('bl', 'error'))
        printError(error.message)
      }
    }

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}

export async function removeUserFromBlackList(
  { message, ...zap }: ZapType,
  userId: string,
) {
  const groupChat = await zap.getGroupChat()

  try {
    if (groupChat.isGroup) {
      const user = await zap.getUser()
      const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

      if (isAdmin) {
        const formattedUser = userId.replace(/[^a-zA-Z0-9]/g, '')

        await db.removeFromBlacklist(groupChat.id._serialized, formattedUser)

        redis.del(`group-info:${groupChat.id._serialized}`)

        message?.react('👌🏼')
      }

      return
    }

    await message?.reply(zap.translateMessage('notgroup', 'error'))
  } catch (error: Event | any) {
    await message?.reply(zap.translateMessage('bl', 'errorR'))
    printError(error.message)
  }
}

export async function removeUserFromAllBlackList(
  { message, ...zap }: ZapType,
  userId: string,
) {
  const groupChat = await zap.getGroupChat()

  try {
    if (groupChat.isGroup) {
      const user = await zap.getUser()
      const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

      if (isAdmin) {
        const formattedUser = userId.replace(/[^a-zA-Z0-9]/g, '')

        const allGroups = await db.getAllGroups()

        const query = db.removeFromAllBlacklist(
          groupChat.id._serialized,
          formattedUser,
          allGroups,
        )

        await prisma.$transaction(query)

        redis.del(`group-info:${groupChat.id._serialized}`)

        message?.react('👌🏼')
      }

      return
    }

    await message?.reply(zap.translateMessage('notgroup', 'error'))
  } catch (error: Event | any) {
    await message?.reply(zap.translateMessage('bl', 'errorR'))
    printError(error.message)
  }
}
