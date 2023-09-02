import { ZapType } from '@modules/zapConstructor'
import { db } from '@lib/auth/prisma-query'
import { printError } from '@cli/terminal'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'
import { isSocialMediaLink } from '@utils/ifExistsLink'
import LinkifyIt from 'linkify-it'
import { Chat } from 'whatsapp-web.js'

const linkDetector = async (
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
  chat: Chat,
) => {
  try {
    const user = await zap.getUser()
    const linkify = LinkifyIt()

    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (linkify.test(message!.body) && !isAdmin) {
      const chat = await zap.getChat()

      if (groupInfo?.anti_link) {
        const isBotAdmin = await zap.isBotAdmin()
        const groupChat = await zap.getGroupChat()
        const msgs = await chat.fetchMessages({ limit: 1, fromMe: false })

        if (!isBotAdmin) {
          await db.updateGroupExceptParticipants(chat.id._serialized, {
            anti_link: false,
          })

          return
        }

        if (message?.body.includes('wa.me/settings')) {
          groupChat.removeParticipants([user.id._serialized])
          message?.delete(true)
          return
        }

        const invalidLinks = msgs
          .map((msg) => msg.links.filter((l) => !isSocialMediaLink(l.link)))
          .filter((links) => links.length > 0)
          .flat()

        if (invalidLinks.length !== 0) {
          await Promise.all([
            groupChat.removeParticipants([user.id._serialized]),
            message?.delete(true),
          ])

          await db.createBanLog({
            id: '',
            chat_name: chat.name,
            user_name: user.pushname,
            user_phone: user.id.user,
            image: '',
            message: message!.body,
            reason: 'link',
            date_time: new Date(new Date().toISOString()),
          })
        }
      }
    }
  } catch (error: Error | any) {
    printError('Link Detector: ' + error.message)
  }
}

export { linkDetector }
