import { db } from '@lib/auth/prisma-query'
import { ZapType } from '@modules/zapConstructor'

export async function leaveGroup({ message, ...zap }: ZapType) {
  const isOwner = await zap.IsOwner()
  const groupChat = await zap.getGroupChat()

  if (isOwner) {
    if (groupChat.isGroup) {
      Promise.all([
        message?.react('👋🏼'),
        groupChat.leave(),
        db.deleteGroup(groupChat.id._serialized),
      ])

      return
    }

    await message?.reply(zap.translateMessage('notgroup', 'error'))
  }
}
