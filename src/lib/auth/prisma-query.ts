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
      const existsParticipantInGroup =
        await prisma.participant.findUniqueOrThrow({
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
        return

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
                tipo: p.tipo,
              },
            },
          },
        },
      })
    },

    async getGroupInfo(groupId: string) {
      const groupInfo = await prisma.group.findUniqueOrThrow({
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

      return groupInfo
    },
  }
}

export const db = PrismaQuery()
