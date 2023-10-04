import { db } from '@lib/auth/prisma-query'
import { redis } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function togglePrivateMode({ message, ...zap }: ZapType) {
  const isOwner = await zap.IsOwner()

  if (isOwner) {
    const groupInfo = await db.getBotInfo()

    await db.updateBotInfo({ private: !groupInfo?.private, id: '' })

    if (groupInfo?.private) {
      await message?.react('🟥')
    } else {
      await message?.react('🟩')
    }

    redis.del('bot-info')

    return
  }

  await message?.reply(zap.translateMessage('general', 'onlyowner'))
}
