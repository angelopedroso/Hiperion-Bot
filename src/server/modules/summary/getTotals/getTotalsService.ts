import { prisma } from '@lib/prisma'

export async function getTotalsService() {
  const totalGroups = await prisma.group.count()
  const totalBlacklist = await prisma.participant.count({
    where: {
      group_black_list: {
        some: {},
      },
    },
  })
  const totalParticipants = await prisma.participant.count()
  const totalLogs = await prisma.log.count()

  return {
    totalGroups,
    totalBlacklist,
    totalParticipants,
    totalLogs,
  }
}
