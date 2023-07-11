import { db } from '@lib/auth/prisma-query'
import { prisma, redis } from '@lib/prisma'
import { ZapType } from '@modules/zapConstructor'

export async function toggleTravaDetector(
  { message, ...zap }: ZapType,
  max?: string,
) {
  const chat = await zap.getGroupChat()
  const user = await zap.getUser()

  const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

  if (!isAdmin) return

  if (chat.isGroup) {
    const groupId = chat.id._serialized
    const groupInfo = await db.getGroupInfo(groupId)

    if (max && parseInt(max)) {
      await prisma.group.update({
        where: {
          g_id: groupId,
        },
        data: {
          anti_trava: {
            update: {
              status: !groupInfo?.anti_trava?.status,
              max_characters: +max,
            },
          },
        },
      })
    } else {
      if (groupInfo?.anti_trava) {
        await prisma.group.update({
          where: {
            g_id: groupId,
          },
          data: {
            anti_trava: {
              update: {
                status: !groupInfo.anti_trava.status,
                max_characters: groupInfo.anti_trava.max_characters,
              },
            },
          },
        })
      }
    }

    if (groupInfo?.anti_trava?.status) {
      await message?.react('🟥')
    } else {
      await message?.react('🟩')
    }

    redis.del(`group-info:${groupId}`)

    return
  }

  await message?.reply(zap.translateMessage('notgroup', 'error'))
}
