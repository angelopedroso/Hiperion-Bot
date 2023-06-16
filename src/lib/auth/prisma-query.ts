import { prisma } from 'lib/prisma'
import { CompleteGroup } from '@typings/prismaQueryTypes'
import { Participant } from '@prisma/client'

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
          tipo: participant.tipo,
        },
      })
    },

    async addParticipantInGroup(userId: string, groupId: string) {
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
                tipo: 'membro',
              },
            },
          },
        },
      })
    },
  }
}
