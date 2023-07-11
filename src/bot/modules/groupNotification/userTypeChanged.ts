import { prisma } from '@lib/prisma'
import { GroupNotification } from 'whatsapp-web.js'

export async function userTypeChanged(notification: GroupNotification) {
  notification.recipientIds.map(async (user) => {
    const formattedUser = user.replace('@c.us', '')
    const participantGroupType = await prisma.participantGroupType.findFirst({
      where: {
        participant: {
          p_id: formattedUser,
        },
        group: {
          g_id: notification.chatId,
        },
      },
    })

    if (participantGroupType) {
      await prisma.participantGroupType.update({
        where: {
          id: participantGroupType.id,
        },
        data: {
          tipo: participantGroupType.tipo === 'membro' ? 'admin' : 'membro',
        },
      })
    }
  })
}
