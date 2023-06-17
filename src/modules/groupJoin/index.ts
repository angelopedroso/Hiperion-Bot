import { prisma } from '@lib/prisma'
import { bemVindo } from '@modules/bemVindo'
import { ZapConstructor } from '@modules/zapConstructor'
import { GroupChat, GroupNotification } from 'whatsapp-web.js'

export async function groupJoined(
  notification: GroupNotification,
  botTS: Date | null,
) {
  if (notification.timestamp !== null) {
    const messageTimestamp = new Date(notification.timestamp * 1000)

    if (botTS === null) return

    if (messageTimestamp < botTS) return
  }

  await bemVindo(notification)

  if (notification.recipientIds.includes(process.env.NUMERO_BOT || '')) {
    const group = (await notification.getChat()) as GroupChat

    const participants =
      ZapConstructor().getAllParticipantsFormattedByParticipantSchema(
        group.participants,
      )

    const create = ZapConstructor().createGroupOnBotJoin(
      notification.chatId,
      participants,
    )

    await prisma.$transaction(create)
  }
}
