import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'
import { printError } from 'cli/terminal'

export async function addUserInBlackList(
  { message, ...zap }: ZapType,
  userId: string,
) {
  const groupChat = await zap.getGroupChat()

  try {
    if (groupChat.isGroup) {
      const user = await zap.getUser()
      const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

      if (isAdmin) {
        const formattedUser = userId.replace(/[^a-zA-Z0-9]/g, '') + '@c.us'

        const allGroups = await db.getAllGroups()

        const query = db.addToBlacklist(
          groupChat.id._serialized,
          formattedUser,
          allGroups,
        )

        await prisma.$transaction(query)
      }

      return
    }

    await message?.reply(zap.translateMessage('notgroup', 'error'))
  } catch (error: Event | any) {
    await message?.reply(zap.translateMessage('bl', 'error'))
    printError(error.message)
  }
}
