import { ParticipantType } from '@prisma/client'
import { printError } from 'cli/terminal'
import { prisma } from 'lib/prisma'
import { GroupChat } from 'whatsapp-web.js'

export async function createAllGroupsOnReady(groups: GroupChat[]) {
  try {
    const updates = []

    for (const group of groups) {
      const {
        id: { _serialized: groupId },
        participants,
      } = group

      const participantData = participants.map((participant) => ({
        p_id: participant.id.user,
        tipo: ParticipantType[
          participant.isAdmin || participant.isSuperAdmin ? 'admin' : 'membro'
        ],
      }))

      const allParticipants = await prisma.participant.findMany({
        select: {
          p_id: true,
          tipo: true,
        },
      })

      const existsGroup = await prisma.group.findUnique({
        where: { g_id: groupId },
        include: { participants: true },
      })

      const participantsToCreate = participantData.filter((p) => {
        return !allParticipants.includes(p)
      })

      if (existsGroup) {
        for (const p of participantsToCreate) {
          updates.push(
            prisma.group.update({
              where: { g_id: groupId },
              data: {
                participants: {
                  connect: {
                    p_id: p.p_id,
                  },
                },
              },
            }),
          )
        }
      } else {
        updates.push(
          prisma.group.create({
            data: {
              g_id: groupId,
              anti_trava: {
                create: {},
              },
            },
          }),
        )

        for (const p of participantsToCreate) {
          updates.push(
            prisma.group.update({
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
            }),
          )
        }
      }
    }

    await prisma.$transaction(updates)
  } catch (error: Error | any) {
    printError(error.message)
  }
}
