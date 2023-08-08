import { db } from '@lib/auth/prisma-query'
import { redis } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'
import { OWNER_NUM } from '@utils/envs'

export async function togglePrivateMode({ message, ...zap }: ZapType) {
  const user = await zap.getUser()

  if (OWNER_NUM === user.id.user) {
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

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
