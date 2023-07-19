import {
  Chat,
  Client,
  Contact,
  GroupChat,
  GroupParticipant,
  Message,
} from 'whatsapp-web.js'

import { Group, ParticipantGroupType, Prisma } from '@prisma/client'

import { db } from '@lib/auth/prisma-query'
import { prisma } from '@lib/prisma'

import { IParticipant } from '@typings/participant.interface'

import i18next from 'i18next'

import { BOT_NUM, OWNER_NUM } from '@utils/envs'

import {
  LocaleAttributeName,
  LocaleFileName,
  TranslationVariables,
} from '@locales/@types/command.interface'

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

  async function isBotAdmin() {
    const user = await getUserIsAdmin(BOT_NUM + '@c.us')

    return user
  }

  async function IsOwner() {
    const user = await getUser()

    return user.id.user === OWNER_NUM
  }

  function getAllParticipantsFormattedByParticipantSchema(
    participants: GroupParticipant[],
  ) {
    return Promise.all(
      participants.map(async (p) => {
        const contact = await client?.getContactById(p.id._serialized)
        const image = await client?.getProfilePicUrl(p.id._serialized)

        return {
          id: '',
          p_id: p.id.user,
          tipo: p.isAdmin || p.isSuperAdmin ? 'admin' : 'membro',
          name: contact?.pushname || 'Undefined',
          imageUrl: image,
        } as IParticipant
      }),
    )
  }

  async function createGroupOnBotJoin(
    groupId: string,
    participant: IParticipant[],
  ) {
    const querys = []

    const existsGroup = await prisma.group.findUnique({
      where: {
        g_id: groupId,
      },
    })

    if (!existsGroup) {
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
    }

    for (const p of participant) {
      querys.push(
        db.updateGroupOnReady(groupId, {
          id: '',
          p_id: p.p_id,
          name: p.name,
          image_url: p.imageUrl,
        }),
      )
      querys.push(db.createParticipantGroupType(groupId, p.p_id, p.tipo))
    }

    return querys
  }

  async function getGroupLink() {
    const groupChat = await getGroupChat()
    return await groupChat.getInviteCode()
  }

  function translateMessage<T extends LocaleFileName>(
    cmd: T,
    name: LocaleAttributeName<T>,
    variables?: TranslationVariables,
  ): string {
    const { t } = i18next

    return t(`${cmd}:${name}`, variables)
  }

  async function clearAllChats() {
    const chats = await client?.getChats()

    if (chats) {
      chats.map(async (chat) => await chat.clearMessages())
    }
  }

  async function getGroupPictures() {
    const chats = (await client?.getChats()) as GroupChat[]
    const groups = chats
      ?.filter((chat) => chat.isGroup)
      .map(async (group) => {
        const inviteCode = await group.getInviteCode()

        return {
          id: group.id._serialized,
          name: group.name,
          inviteCode: `https://chat.whatsapp.com/${inviteCode}`,
        }
      })

    let groupPictures = null

    if (groups) {
      groupPictures = await Promise.all(
        groups.map(async (group) => {
          const resolvedGroup = await group
          const picUrl = await client?.getProfilePicUrl(resolvedGroup.id)
          return {
            groupId: resolvedGroup.id,
            name: resolvedGroup.name,
            image_url: picUrl,
            inviteCode: resolvedGroup.inviteCode,
          }
        }),
      )
    }

    return groupPictures
  }

  return {
    getChat,
    getGroupChat,
    getUser,
    getUserIsAdmin,
    isBotAdmin,
    createGroupOnBotJoin,
    clearAllChats,
    getAllParticipantsFormattedByParticipantSchema,
    getGroupLink,
    translateMessage,
    IsOwner,
    getGroupPictures,
    message,
  }
}

export type ZapType = {
  getChat: () => Promise<Chat>
  getGroupChat: () => Promise<GroupChat>
  getUser: () => Promise<Contact>
  getUserIsAdmin: (userId: string) => Promise<boolean>
  isBotAdmin: () => Promise<boolean>
  createGroupOnBotJoin: (
    groupId: string,
    participant: IParticipant[],
  ) => Promise<
    | (
        | Prisma.Prisma__GroupClient<Group, never>
        | Prisma.Prisma__ParticipantGroupTypeClient<ParticipantGroupType, never>
      )[]
  >
  getAllParticipantsFormattedByParticipantSchema: (
    participants: GroupParticipant[],
  ) => Promise<IParticipant[]>
  getGroupLink: () => Promise<string>
  translateMessage: <T extends LocaleFileName>(
    cmd: T,
    name: LocaleAttributeName<T>,
    variables?: TranslationVariables,
  ) => string
  IsOwner: () => Promise<boolean>
  clearAllChats: () => Promise<void>
  getGroupPictures: () => Promise<
    | {
        groupId: string
        name: string
        image_url: string | undefined
        inviteCode: string
      }[]
    | null
  >
  message?: Message
}
