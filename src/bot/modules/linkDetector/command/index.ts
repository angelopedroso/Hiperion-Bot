import { db } from '@lib/auth/prisma-query'
import { redis } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function toggleLinkDetector({ message, ...zap }: ZapType) {
  const chat = await zap.getGroupChat()
  const user = await zap.getUser()

  const isBotAdmin = await zap.isBotAdmin()
  const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

  if (!isBotAdmin) {
    message?.reply(zap.translateMessage('general', 'botisnotadmin'))
    return
  }

  if (!isAdmin) return

  if (chat.isGroup) {
    const groupId = chat.id._serialized
    const groupInfo = await db.getGroupInfo(groupId)

    await db.updateGroupExceptParticipants(groupId, {
      anti_link: !groupInfo?.anti_link,
    })

    if (groupInfo?.anti_link) {
      await message?.react('🟥')
    } else {
      await message?.react('🟩')
    }

    redis.del(`group-info:${groupId}`)

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
