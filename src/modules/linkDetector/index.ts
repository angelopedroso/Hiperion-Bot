import { ZapType } from '@modules/zapConstructor'
import { isUrl, socialMediaRegex } from '@utils/globalVariable'
import { db } from '@lib/auth/prisma-query'
import { printError } from 'cli/terminal'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

const linkDetector = async (
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) => {
  try {
    const user = await zap.getUser()

    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (isUrl.test(message!.body) && !isAdmin) {
      const chat = await zap.getChat()

      if (groupInfo?.anti_link) {
        const isBotAdmin = await zap.isBotAdmin()

        if (!isBotAdmin) {
          await db.updateGroupExceptParticipants(chat.id._serialized, {
            anti_link: false,
          })

          return
        }

        const groupChat = await zap.getGroupChat()
        const msgs = await chat.fetchMessages({ limit: 1, fromMe: false })

        const invalidLinks = msgs
          .map((msg) => msg.links.filter((l) => !socialMediaRegex.test(l.link)))
          .filter((links) => links.length > 0)
          .flat()

        if (invalidLinks.length !== 0) {
          groupChat.removeParticipants([user.id._serialized])
          message?.delete(true)
        }
      }
    }
  } catch (error: Error | any) {
    printError('Link Detector: ' + error.message)
  }
}

export { linkDetector }
