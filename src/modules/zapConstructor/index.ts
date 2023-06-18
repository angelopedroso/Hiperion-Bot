import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'
import { Group, Participant, Prisma } from '@prisma/client'
import {
  Chat,
  Client,
  Contact,
  GroupChat,
  GroupParticipant,
  Message,
} from 'whatsapp-web.js'

export function ZapConstructor(client?: Client, message?: Message) {
  async function getChat() {
    if (!message) throw Error('Message not initialized')
    return await message?.getChat()
  }

  async function getGroupChat() {
    if (!message) throw Error('Message not initialized')
    return (await message?.getChat()) as GroupChat
  }

  async function getUser() {
    if (!message) throw Error('Message not initialized')
    return await message.getContact()
  }

  async function getUserIsAdmin(userId: string) {
    const groupChat = await getGroupChat()

    return groupChat.participants
      .filter((p) => p.isAdmin || p.isSuperAdmin)
      .some((admin) => admin.id._serialized === userId)
  }

  async function getBotAdmin() {
    const user = await getUserIsAdmin(process.env.NUMERO_BOT + '@c.us')

    return user
  }

  function getAllParticipantsFormattedByParticipantSchema(
    participants: GroupParticipant[],
  ) {
    return participants.map((p: any) => {
      return {
        id: '',
        p_id: p.id._serialized,
        tipo: p.isAdmin || p.isSuperAdmin ? 'admin' : 'membro',
      }
    }) as Participant[]
  }

  function createGroupOnBotJoin(groupId: string, participant: Participant[]) {
    const querys = []
    querys.push(
      prisma.group.create({
        data: {
          g_id: groupId,
          anti_trava: {
            create: {},
          },
        },
      }),
    )

    for (const p of participant) {
      querys.push(
        db.updateGroupOnReady(groupId, {
          id: '',
          p_id: p.p_id,
        }),
      )
    }

    return querys
  }

  return {
    getChat,
    getGroupChat,
    getUser,
    getUserIsAdmin,
    getBotAdmin,
    createGroupOnBotJoin,
    getAllParticipantsFormattedByParticipantSchema,
    message,
  }
}

export type ZapType = {
  getChat: () => Promise<Chat>
  getGroupChat: () => Promise<GroupChat>
  getUser: () => Promise<Contact>
  getUserIsAdmin: (userId: string) => Promise<boolean>
  getBotAdmin: () => Promise<boolean>
  createGroupOnBotJoin: (
    groupId: string,
    participant: Participant[],
  ) => Prisma.Prisma__GroupClient<Group, never>[]
  getAllParticipantsFormattedByParticipantSchema: (
    participants: GroupParticipant[],
  ) => Participant[]
  message?: Message
}
