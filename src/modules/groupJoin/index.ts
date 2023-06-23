import { prisma } from '@lib/prisma'
import { bemVindo } from '@modules/bemVindo'
import { removeFromGroup } from '@modules/removeFromGroup'
import { ZapConstructor } from '@modules/zapConstructor'
import { BOT_NUM } from '@utils/envs'
import {
  GroupChat,
  GroupNotification,
  GroupNotificationTypes,
} from 'whatsapp-web.js'

export async function groupJoined(
  notification: GroupNotification,
  botTS: Date | null,
) {
  if (notification.timestamp !== null) {
    const messageTimestamp = new Date(notification.timestamp * 1000)

    if (botTS === null) return

    if (messageTimestamp < botTS) return
  }

  if (
    notification.recipientIds.includes(BOT_NUM) &&
    (notification.type === GroupNotificationTypes.ADD ||
      notification.type === GroupNotificationTypes.INVITE)
  ) {
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

  if (notification.type === GroupNotificationTypes.LEAVE) {
    await removeFromGroup(notification)
  }

  await bemVindo(notification)
}
