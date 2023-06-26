import { ZapType } from '@modules/zapConstructor'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'
import { BOT_NAME } from '@utils/envs'

import { MessageTypes } from 'whatsapp-web.js'

async function sendSticker({ message, ...zap }: ZapType) {
  const chat = await zap.getChat()
  const validTypes = [MessageTypes.IMAGE, MessageTypes.VIDEO]

  if (message?.hasMedia && validTypes.includes(message.type)) {
    const media = await message.downloadMedia()

    await chat.sendMessage(media, {
      sendMediaAsSticker: true,
      stickerAuthor: BOT_NAME,
      stickerName: zap.translateMessage('fs', 'madeby', { name: BOT_NAME }),
    })

    return
  }

  if (message?.hasQuotedMsg) {
    const quotedMsg = await message.getQuotedMessage()

    if (quotedMsg.hasMedia && validTypes.includes(quotedMsg.type)) {
      const media = await quotedMsg.downloadMedia()

      chat.sendMessage(media, {
        sendMediaAsSticker: true,
        stickerAuthor: BOT_NAME,
        stickerName: zap.translateMessage('fs', 'madeby', { name: BOT_NAME }),
      })
    }
  }
}

async function sendAutoSticker(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  if (message?.body.includes('!fs')) return

  if (message?.hasMedia && message.type !== MessageTypes.STICKER) {
    if (groupInfo?.auto_sticker) {
      const chat = await zap.getChat()
      const media = await message.downloadMedia()

      await chat.sendMessage(media, {
        sendMediaAsSticker: true,
        stickerAuthor: BOT_NAME,
        stickerName: zap.translateMessage('fs', 'madeby', { name: BOT_NAME }),
      })
    }
  }
}

export { sendSticker, sendAutoSticker }
