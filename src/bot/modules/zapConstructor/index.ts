import {
  Chat,
  Client,
  Contact,
  GroupChat,
  GroupParticipant,
  Message,
  MessageMedia,
} from 'whatsapp-web.js'

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
    group: GroupChat,
    participant: IParticipant[],
  ) {
    const groupPic = await client?.getProfilePicUrl(group.id._serialized)

    const existsGroup = await prisma.group.findUnique({
      where: {
        g_id: group.id._serialized,
      },
    })

    if (!existsGroup) {
      await prisma.group.create({
        data: {
          g_id: group.id._serialized,
          name: group.name,
          image_url: groupPic,
          anti_trava: {
            create: {},
          },
        },
      })
    }

    for (const p of participant) {
      await db.updateGroupOnReady(group.id._serialized, {
        id: '',
        p_id: p.p_id,
        name: p.name,
        image_url: p.imageUrl,
        group_black_list_ids: [],
        group_participant_ids: [],
      })

      await db.createParticipantGroupType(group.id._serialized, p.p_id, p.tipo)
    }
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

  async function getGroupInfo() {
    const chats = (await client?.getChats()) as GroupChat[]
    const groups = chats
      ?.filter((chat) => chat.isGroup)
      .map(async (group) => {
        const isAdmin = group.participants
          .filter((p) => p.isAdmin || p.isSuperAdmin)
          .some((admin) => admin.id._serialized === BOT_NUM + '@c.us')

        return {
          id: group.id._serialized,
          isAdmin,
        }
      })

    let groupInfo = null

    if (groups) {
      groupInfo = await Promise.all(
        groups.map(async (group) => {
          const resolvedGroup = await group

          return {
            groupId: resolvedGroup.id,
            isAdmin: resolvedGroup.isAdmin,
          }
        }),
      )
    }

    return groupInfo
  }

  async function updateGroupPicture(data: string, id: string) {
    const group = (await client?.getChatById(id)) as GroupChat

    if (!group) return

    const media = new MessageMedia('image/jpeg', data, 'picture.jpg')

    await group.setPicture(media)
  }

  async function updateGroupSubject(data: string, id: string) {
    const group = (await client?.getChatById(id)) as GroupChat

    if (!group) return

    Promise.all([
      group.setSubject(data),
      prisma.log.updateMany({
        where: {
          chat_name: group.name,
        },
        data: {
          chat_name: data,
        },
      }),
    ])
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
    getGroupInfo,
    updateGroupPicture,
    updateGroupSubject,
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
    group: GroupChat,
    participant: IParticipant[],
  ) => Promise<void>
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
  getGroupInfo: () => Promise<
    | {
        groupId: string
        isAdmin: boolean
      }[]
    | null
  >
  updateGroupPicture: (data: string, id: string) => Promise<void>
  updateGroupSubject: (data: string, id: string) => Promise<void>
  message?: Message
}
