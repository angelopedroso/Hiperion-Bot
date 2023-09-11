import { ZapType } from '@modules/zapConstructor'
import { db } from '@lib/auth/prisma-query'
import { printError } from '@cli/terminal'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'
import { isProfane } from '@utils/profanity'

const profanityDetector = async (
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) => {
  try {
    const user = await zap.getUser()

    const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

    if (!isAdmin) {
      const chat = await zap.getChat()

      const msgProfanity = isProfane(message?.body)

      if (groupInfo?.anti_profane) {
        const isBotAdmin = await zap.isBotAdmin()

        if (!isBotAdmin) {
          await db.updateGroupExceptParticipants(chat.id._serialized, {
            anti_profane: false,
          })

          return
        }

        if (msgProfanity) {
          await message?.delete(true)
        }
      }
    }
  } catch (error: Error | any) {
    printError('Profanity Detector: ' + error.message)
  }
}

export { profanityDetector }
