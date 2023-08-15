import { db } from '@lib/auth/prisma-query'
import { redis } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function toggleAutoInvite({ message, ...zap }: ZapType) {
  const chat = await zap.getGroupChat()
  const user = await zap.getUser()

  if (chat.isGroup) {
    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)
    const isBotAdmin = await zap.isBotAdmin()

    if (!isAdmin) return

    if (!isBotAdmin) {
      message?.reply(zap.translateMessage('general', 'botisnotadmin'))
      return
    }

    const groupId = chat.id._serialized
    const groupInfo = await db.getGroupInfo(groupId)

    await db.updateGroupExceptParticipants(groupId, {
      auto_invite_link: !groupInfo?.auto_invite_link,
    })

    if (groupInfo?.auto_invite_link) {
      await message?.react('🟥')
    } else {
      await message?.react('🟩')
    }

    redis.del(`group-info:${groupId}`)

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
