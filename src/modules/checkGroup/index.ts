import { linkDetector } from '@modules/linkDetector'
import { maliciousDetector } from '@modules/maliciousDetector'
import { travaDectetor } from '@modules/travaDetector'
import { ZapType } from '@modules/zapConstructor'

export async function checkGroupFeatures(zap: ZapType) {
  const chat = await zap.getChat()

  if (chat.isGroup) {
    await linkDetector(zap)
    await maliciousDetector(zap)
    await travaDectetor(zap)
  }
}
