import { client } from '@config/startupConfig'
import { AppError } from '@server/errors/index'
import { GroupChat } from 'whatsapp-web.js'

export interface RemoveParticipantFromGroupServiceProps {
  users: string[]
  group: string
}

export async function removeParticipantFromGroupService({
  users,
  group,
}: RemoveParticipantFromGroupServiceProps) {
  const groupChat = (await client.getChatById(group)) as GroupChat

  if (!group) {
    throw new AppError('Group not found!')
  }

  try {
    await groupChat.removeParticipants(users)
  } catch (error) {
    throw new AppError('Participant(s) not found!')
  }
}
