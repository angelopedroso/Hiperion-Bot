import { db } from '@lib/auth/prisma-query'
import { ParticipantType } from '@prisma/client'
import { printError } from '@cli/terminal'
import { prisma } from '@lib/prisma'
import { GroupChat } from 'whatsapp-web.js'
import { client } from '@config/startupConfig'

export async function createAllGroupsOnReady(groups: GroupChat[]) {
  try {
    const groupIds = groups.map((group) => group.id._serialized)
    const allParticipantsGroups = await db.getParticipantsFromGroups(groupIds)
    const existingParticipantGroupTypes =
      await db.getParticipantsTypeFromGroups(groupIds)

    for (const group of groups) {
      const {
        id: { _serialized: groupId },
        participants,
        name,
      } = group

      const groupPicture = await client.getProfilePicUrl(groupId)

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
        await prisma.group.create({
          data: {
            g_id: groupId,
            name,
            image_url: groupPicture,
            anti_trava: {
              create: {},
            },
          },
        })
      }

      if (
        existsGroup?.image_url !== groupPicture ||
        existsGroup?.name !== name
      ) {
        await prisma.group.update({
          where: {
            g_id: groupId,
          },
          data: {
            name,
            image_url: groupPicture,
          },
        })
      }

      for (const p of participantsToCreate) {
        const existsGroupType = existingParticipantGroupTypes.some(
          (pgt) => pgt.groupId === groupId && pgt.participantId === p.p_id,
        )

        await db.updateGroupOnReady(groupId, {
          id: '',
          p_id: p.p_id,
          name: p.name || 'Undefined',
          image_url: p.imageUrl,
          group_black_list_ids: [],
          group_participant_ids: [],
        })

        if (!existsGroupType) {
          await db.createParticipantGroupType(groupId, p.p_id, p.tipo)
        }
      }
    }
  } catch (error: Error | any) {
    printError(error)
  }
}
