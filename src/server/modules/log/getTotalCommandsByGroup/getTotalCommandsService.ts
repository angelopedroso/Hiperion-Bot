import { prisma } from '@lib/prisma'

export async function getTotalCommandsService() {
  const log = await prisma.log.groupBy({
    by: ['groupId'],
    where: {
      is_group: true,
    },
    _count: {
      command: true,
    },
  })

  return log
}
