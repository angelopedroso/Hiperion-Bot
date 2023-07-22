import { db } from '@lib/auth/prisma-query'
import { ParticipantType } from '@prisma/client'
import { printError } from '@cli/terminal'
import { prisma } from '@lib/prisma'
import { GroupChat } from 'whatsapp-web.js'
import { client } from '@config/startupConfig'

export async function createAllGroupsOnReady(groups: GroupChat[]) {
  try {
    const updates = []

    const groupIds = groups.map((group) => group.id._serialized)
    const allParticipantsGroups = await db.getParticipantsFromGroups(groupIds)
    const existingParticipantGroupTypes =
      await db.getParticipantsTypeFromGroups(groupIds)

    for (const group of groups) {
      const {
        id: { _serialized: groupId },
        participants,
      } = group

      const participantData = Promise.all(
        participants.map(async (participant) => {
          const contact = await client.getContactById(
            participant.id._serialized,
          )

          return {
            p_id: participant.id.user,
            tipo: ParticipantType[
              participant.isAdmin || participant.isSuperAdmin
                ? 'admin'
                : 'membro'
            ],
            name: contact.pushname || contact.shortName || 'Undefined',
            imageUrl: await client.getProfilePicUrl(participant.id._serialized),
          }
        }),
      )

      const currentParticipants = (await participantData).map(
        (participant) => participant.p_id,
      )

      const participantsInGroup = allParticipantsGroups.find(
        (group) => group.groupId === groupId,
      )

      const removedParticipants = participantsInGroup?.participants.filter(
        (participant) => !currentParticipants.includes(participant.p_id),
      )

      const participantsToCreate = (await participantData).filter(
        (participant) => {
          if (participantsInGroup?.participants.length) {
            return !participantsInGroup.participants.some(
              (existingParticipant) =>
                existingParticipant.p_id === participant.p_id,
            )
          }

          return participant
        },
      )

      if (removedParticipants?.length) {
        Promise.all(
          removedParticipants.map(async ({ p_id: participantId }) => {
            await db.removeParticipantsFromGroup(participantId, groupId)
          }),
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
        const existsGroupType = existingParticipantGroupTypes.some(
          (pgt) => pgt.groupId === groupId && pgt.participantId === p.p_id,
        )

        updates.push(
          db.updateGroupOnReady(groupId, {
            id: '',
            p_id: p.p_id,
            name: p.name || 'Undefined',
            image_url: p.imageUrl,
          }),
        )

        if (!existsGroupType) {
          updates.push(db.createParticipantGroupType(groupId, p.p_id, p.tipo))
        }
      }
    }

    await prisma.$transaction(updates)
  } catch (error: Error | any) {
    printError(error)
  }
}
