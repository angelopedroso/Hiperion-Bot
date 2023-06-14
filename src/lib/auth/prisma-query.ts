import { prisma } from 'lib/prisma'
import { prismaGroup, prismaParticipant } from '@typings/prismaQueryTypes'

export function PrismaQuery() {
  return {
    async createGroup(group: prismaGroup) {
      await prisma.group.create({
        data: {
          id: group.id,
          link_detector: group.linkDetector,
          bemvindo: group.bemvindo,
          porn_detector: group.pornDetector,
          trava_detector: {
            create: {
              status: group.travaDetector.status,
              max_characters: group.travaDetector.maxCharacters,
            },
          },
          participantes: {
            create: group.participantes?.map((participante) => ({
              id: participante.id,
              tipo: participante.tipo,
            })),
          },
          black_list: {
            create: group.blackList?.map((participante) => ({
              participante: { connect: { id: participante.participanteId } },
            })),
          },
        },
      })
    },

    async updateGroup(groupId: string, data: Partial<prismaGroup>) {
      const participantes = data.participantes
      delete data.participantes

      await prisma.group.update({
        where: {
          id: groupId,
        },
        data: {
          ...data,
          participantes: {
            set: participantes?.map((participante) => ({
              id: participante.id,
            })),
          },
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

    async createParticipant(participant: prismaParticipant) {
      await prisma.participant.create({
        data: {
          id: participant.id,
          tipo: participant.tipo,
        },
      })
    },

    async deleteParticipantsWhenGroupDeleted(groupId: string) {
      await prisma.participant.deleteMany({
        where: {
          group_id: groupId,
        },
      })
    },
  }
}
