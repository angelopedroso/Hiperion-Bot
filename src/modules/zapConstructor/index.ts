import { Participant } from '@prisma/client'
import { prisma } from 'lib/prisma'
import { Chat, Client, Contact, GroupChat, Message } from 'whatsapp-web.js'

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

  async function getExistsUserInDB(userId: string) {
    const existsUser = await prisma.participant.findUnique({
      where: {
        id: userId,
      },
    })

    return existsUser
  }

  return {
    getChat,
    getGroupChat,
    getUser,
    getUserIsAdmin,
    getExistsUserInDB,
    message,
  }
}

export type ZapType = {
  getChat: () => Promise<Chat>
  getGroupChat: () => Promise<GroupChat>
  getUser: () => Promise<Contact>
  getUserIsAdmin: (userId: string) => Promise<boolean>
  getExistsUserInDB: (userId: string) => Promise<Participant | null>
  message?: Message
}
