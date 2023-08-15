import { db } from '@lib/auth/prisma-query'
import { redis } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function toggleMaliciousDetector({ message, ...zap }: ZapType) {
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
      anti_porn: !groupInfo?.anti_porn,
    })

    if (groupInfo?.anti_porn) {
      await message?.react('🟥')
    } else {
      await message?.react('🟩')
    }

    redis.del(`group-info:${groupId}`)

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
