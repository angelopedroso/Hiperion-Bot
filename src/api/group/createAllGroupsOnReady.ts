import { db } from '@lib/auth/prisma-query'
import { Participant, ParticipantType, Prisma } from '@prisma/client'
import { printError } from 'cli/terminal'
import { prisma } from 'lib/prisma'
import { GroupChat } from 'whatsapp-web.js'

export async function createAllGroupsOnReady(groups: GroupChat[]) {
  try {
    const updates = []
    let removeParticipantsPromises: Prisma.Prisma__ParticipantClient<
      Participant,
      never
    >[] = []

    const groupIds = groups.map((group) => group.id._serialized)
    const allParticipantsGroups = await db.getParticipantsFromGroups(groupIds)

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

      const currentParticipants = participantData.map(
        (participant) => participant.p_id,
      )

      const participantsInGroup = allParticipantsGroups.find(
        (group) => group.groupId === groupId,
      )

      const removedParticipants = participantsInGroup?.participants.filter(
        (participant) => !currentParticipants.includes(participant.p_id),
      )

      const participantsToCreate = participantData.filter((participant) => {
        return (
          !participantsInGroup ||
          participantsInGroup?.participants.some(
            (existingParticipant) =>
              existingParticipant.p_id !== participant.p_id,
          )
        )
      })

      if (removedParticipants?.length) {
        removeParticipantsPromises = removedParticipants.map(
          ({ p_id: participantId }) => {
            return db.removeParticipantsFromGroup(participantId, groupId)
          },
        )
      }

      const existsGroup = await prisma.group.findUnique({
        where: { g_id: groupId },
        include: { participants: true },
      })

      if (!existsGroup) {
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
      }

      for (const p of participantsToCreate) {
        const existsGroupType = await prisma.participantGroupType.findFirst({
          where: {
            participant: {
              p_id: p.p_id,
            },
            group: {
              g_id: groupId,
            },
          },
        })

        updates.push(
          db.updateGroupOnReady(groupId, {
            id: '',
            p_id: p.p_id,
          }),
        )

        if (!existsGroupType) {
          updates.push(db.createParticipantGroupType(groupId, p.p_id, p.tipo))
        }
      }
    }

    await prisma.$transaction([...updates, ...removeParticipantsPromises])
  } catch (error: Error | any) {
    printError(error)
  }
}
