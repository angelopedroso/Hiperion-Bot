import { db } from '@lib/auth/prisma-query'
import { linkDetector } from '@modules/linkDetector'
import { maliciousDetector } from '@modules/maliciousDetector'
import { autoGroupInviteLink } from '@modules/groupInvite'
import { sendAutoSticker } from '@modules/sticker'
import { travaDectetor } from '@modules/travaDetector'
import { ZapType } from '@modules/zapConstructor'
import { printError } from '@cli/terminal'

export async function checkGroupFeatures(zap: ZapType) {
  const chat = await zap.getChat()

  try {
    if (chat.isGroup) {
      const groupInfo = await db.getGroupInfo(chat.id._serialized)

      Promise.all([
        linkDetector(zap, groupInfo, chat),
        maliciousDetector(zap, groupInfo),
        travaDectetor(zap, groupInfo),
        sendAutoSticker(zap, groupInfo),
        autoGroupInviteLink(zap, groupInfo),
      ])
    }
  } catch (error: PromiseRejectedResult | any) {
    printError(error)
  }
}
