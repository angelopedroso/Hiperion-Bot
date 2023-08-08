import { db } from '@lib/auth/prisma-query'
import { ZapType } from '@modules/zapConstructor'

export async function sendBotStatus({ message, ...zap }: ZapType) {
  const isOwner = await zap.IsOwner()

  if (isOwner) {
    const botInfo = await db.getBotInfo()

    const config = {
      private: botInfo?.private ? '🟩' : '🟥',
    }

    await message?.reply(zap.translateMessage('botinfo', 'info', config))
  }
}
