import { prisma, redis } from 'lib/prisma'
import { CompleteGroup } from '@typings/prismaQueryTypes'
import { Participant, ParticipantType } from '@prisma/client'
import { printError } from 'cli/terminal'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

export function PrismaQuery() {
  return {
    async createGroup(group: Partial<CompleteGroup>) {
      await prisma.group.create({
        data: {
          g_id: group.g_id as string,
          anti_trava: {
            create: {},
          },
          participants: {
            connect: group.participants?.map((participant) => {
              return {
                p_id: participant.p_id,
              }
            }),
          },
        },
      })
    },

    async updateGroupExceptParticipants(
      groupId: string,
      data: Partial<CompleteGroup>,
    ) {
      await prisma.group.update({
        where: {
          g_id: groupId,
        },
        data: {
          ...data,
          participants: {},
        },
      })
    },

    async findGroupById(groupId: string) {
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
      })

      return group
    },

    async deleteGroup(groupId: string) {
      await prisma.group.delete({
        where: {
          id: groupId,
        },
      })
    },

    async findParticipantsByIds(participantIds: string[]) {
      const participants = await prisma.participant.findMany({
        where: {
          id: {
            in: participantIds,
          },
        },
      })

      return participants
    },

    async createParticipant(participant: Participant) {
      await prisma.participant.create({
        data: {
          p_id: participant.p_id,
        },
      })
    },

    async addParticipantInGroup(userId: string, groupId: string) {
      const existsParticipantInGroup = await prisma.participant.findUnique({
        where: {
          p_id: userId,
        },
        include: {
          group_participant: true,
        },
      })

      if (
        existsParticipantInGroup &&
        existsParticipantInGroup.group_participant.some(
          (group) => group.g_id === groupId,
        )
      )
        return 'ban'

      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          participants: {
            connectOrCreate: {
              where: {
                p_id: userId,
              },
              create: {
                p_id: userId,
              },
            },
          },
        },
      })

      const existsGroupType = await prisma.participantGroupType.findFirst({
        where: {
          group: {
            g_id: groupId,
          },
          participant: {
            p_id: userId,
          },
        },
      })

      if (!existsGroupType) {
        await this.createParticipantGroupType(groupId, userId, 'membro')
      }
    },

    async getParticipantsFromGroup(groupId: string) {
      const existingParticipants = await prisma.group.findUnique({
        where: {
          g_id: groupId,
        },
        select: {
          participants: true,
        },
      })

      return existingParticipants
    },

    async getParticipantsFromGroups(groupIds: string[]) {
      try {
        const participantsInGroups = await prisma.group.findMany({
          where: {
            g_id: {
              in: groupIds,
            },
          },
          include: {
            participants: true,
          },
        })
        const participantsInGroupsFormatted = participantsInGroups.map(
          (group) => ({
            groupId: group.g_id,
            participants: group.participants,
          }),
        )

        return participantsInGroupsFormatted
      } catch (error: Error | any) {
        printError(error)
        return []
      }
    },

    async getBlackListFromGroups(groupIds: string[]) {
      try {
        const groupBlackList = await prisma.group.findMany({
          where: {
            g_id: {
              in: groupIds,
            },
          },
          select: {
            black_list: true,
            g_id: true,
          },
        })

        const blackListFromGroupsFormatted = groupBlackList.map((group) => ({
          groupId: group.g_id,
          blackList: group.black_list,
        }))

        return blackListFromGroupsFormatted
      } catch (error: Error | any) {
        printError(error)
        return []
      }
    },

    removeParticipantsFromGroup(participantId: string, groupId: string) {
      return prisma.participant.update({
        where: {
          p_id: participantId,
        },
        data: {
          group_participant: {
            disconnect: {
              g_id: groupId,
            },
          },
        },
      })
    },

    async deleteParticipant(participantId: string) {
      await prisma.participant.delete({
        where: {
          p_id: participantId,
        },
      })
    },

    updateGroupOnReady(groupId: string, p: Participant) {
      return prisma.group.update({
        where: { g_id: groupId },
        data: {
          participants: {
            connectOrCreate: {
              where: {
                p_id: p.p_id,
              },
              create: {
                p_id: p.p_id,
              },
            },
          },
        },
      })
    },

    createParticipantGroupType(
      groupId: string,
      participantId: string,
      tipo: ParticipantType,
    ) {
      return prisma.participantGroupType.create({
        data: {
          tipo,
          group: {
            connect: {
              g_id: groupId,
            },
          },
          participant: {
            connect: {
              p_id: participantId,
            },
          },
        },
      })
    },

    async getGroupInfo(groupId: string) {
      try {
        const cache = await redis.get('group-info')

        if (cache) {
          return JSON.parse(cache) as groupInfoCache
        }

        const groupInfo = await prisma.group.findUnique({
          where: { g_id: groupId },
          select: {
            anti_link: true,
            anti_porn: true,
            bem_vindo: true,
            black_list: true,
            anti_trava: {
              select: {
                status: true,
                max_characters: true,
              },
            },
          },
        })

        await redis.set('group-info', JSON.stringify(groupInfo))
        await redis.expire('group-info', 60 * 3)

        return groupInfo
      } catch (error: Error | any) {
        printError('getGroupInfo Query: ' + error.message)
      }
    },
  }
}

export const db = PrismaQuery()
