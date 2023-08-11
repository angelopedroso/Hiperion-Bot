import { prisma, redis } from '@lib/prisma'
import { BotSettings } from '@prisma/client'
import { AppError } from 'server/errors'

export async function updateBotInfoService({
  id,
  private: privateChat,
}: BotSettings) {
  const existsBot = await prisma.botSettings.findFirst({})

  if (!existsBot) {
    throw new AppError('Bot not found!')
  }

  const botUpdated = await prisma.botSettings.update({
    where: {
      id,
    },
    data: {
      private: privateChat,
    },
  })

  await redis.del('bot-info')

  return botUpdated
}
