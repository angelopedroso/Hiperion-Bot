import { db } from '@lib/auth/prisma-query'
import { linkDetector } from '@modules/linkDetector'
import { maliciousDetector } from '@modules/maliciousDetector'
import { autoGroupInviteLink } from '@modules/groupInvite'
import { sendAutoSticker } from '@modules/sticker'
import { travaDectetor } from '@modules/travaDetector'
import { ZapType } from '@modules/zapConstructor'

export async function checkGroupFeatures(zap: ZapType) {
  const chat = await zap.getChat()

  if (chat.isGroup) {
    const groupInfo = await db.getGroupInfo(chat.id._serialized)

    await linkDetector(zap, groupInfo)
    await maliciousDetector(zap, groupInfo)
    await travaDectetor(zap, groupInfo)
    await sendAutoSticker(zap, groupInfo)
    await autoGroupInviteLink(zap, groupInfo)
  }
}
