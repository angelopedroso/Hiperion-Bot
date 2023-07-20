import { prisma } from '@lib/prisma'

export async function getTotalCommandsService() {
  const log = await prisma.log.groupBy({
    by: ['groupId', 'chat_name'],
    where: {
      is_group: true,
    },
    _count: {
      command: true,
    },
  })

  return log
}
