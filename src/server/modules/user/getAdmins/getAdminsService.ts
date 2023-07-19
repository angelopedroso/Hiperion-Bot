import { printError } from '@cli/terminal'
import { client } from '@config/startupConfig'
import { prisma, redis } from '@lib/prisma'
import { GetAdmin } from '@typings/prismaQueryTypes'

export async function getAdmins() {
  try {
    const cache = await redis.get('all-admins')

    if (cache) {
      return JSON.parse(cache) as GetAdmin[]
    }

    const allAdmins = await prisma.participant.findMany({
      where: {
        participant_group_type: {
          some: {
            tipo: 'admin',
          },
        },
      },
      include: {
        group_participant: true,
      },
    })

    const formattedNumbersPromise = allAdmins.map(async (user) => {
      return { p_id: await client.getFormattedNumber(user.p_id), id: user.id }
    })

    const formattedNumbers = await Promise.all(formattedNumbersPromise)

    await redis.set('all-admins', JSON.stringify(allAdmins), 'EX', 60 * 10)

    return allAdmins.map((user) => {
      return {
        id: user.id,
        p_id: formattedNumbers.find((p) => p.id === user.id)?.p_id,
        name: user.name,
        image_url: user.image_url,
        groups: user.group_participant,
      }
    })
  } catch (error: Error | any) {
    printError('Get Admins Service: ' + error.message)
  }
}
