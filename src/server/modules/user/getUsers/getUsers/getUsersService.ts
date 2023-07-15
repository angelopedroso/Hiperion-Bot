import { prisma } from '@lib/prisma'

export async function getUsers(page = 1, size = 20) {
  const skip = (page - 1) * size
  const [allUsers, totalUsers] = await Promise.all([
    prisma.participant.findMany({
      include: {
        participant_group_type: true,
      },
      skip,
      take: size,
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.participant.count(),
  ])

  return {
    total: totalUsers,
    data: allUsers.map((user) => {
      return {
        id: user.id,
        p_id: user.p_id,
        name: user.name,
        image_url: user.image_url,
        type: user.participant_group_type,
      }
    }),
  }
}
