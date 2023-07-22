import { prisma } from '@lib/prisma'

export async function getLog() {
  const logs = await prisma.log.findMany({
    orderBy: {
      date_time: 'desc',
    },
  })

  return logs
}
