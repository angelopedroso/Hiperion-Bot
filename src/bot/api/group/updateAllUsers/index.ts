import { db } from '@lib/auth/prisma-query'
import { ParticipantType } from '@prisma/client'
import { printError } from '@cli/terminal'
import { GroupChat } from 'whatsapp-web.js'
import { client } from '@config/startupConfig'

export async function updateAllUsers(groups: GroupChat[]) {
  try {
    const groupIds = groups.map((group) => group.id._serialized)
    const allParticipantsGroups = await db.getParticipantsFromGroups(groupIds)

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

      const participantsInGroup = allParticipantsGroups.find(
        (group) => group.groupId === groupId,
      )

      const groupParticipants = (await participantData).filter(
        (participant) => {
          return participantsInGroup?.participants.some(
            (existingParticipant) =>
              existingParticipant.p_id === participant.p_id,
          )
        },
      )

      for (const p of groupParticipants) {
        await db.updateParticipants({
          id: '',
          p_id: p.p_id,
          name: p.name || 'Undefined',
          image_url: p.imageUrl,
          group_black_list_ids: [],
          group_participant_ids: [],
        })
      }
    }
  } catch (error: Error | any) {
    printError(error)
  }
}
