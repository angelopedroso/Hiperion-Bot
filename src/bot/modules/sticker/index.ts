import { ZapType } from '@modules/zapConstructor'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'
import { BOT_NAME } from '@utils/envs'

import { MessageTypes } from 'whatsapp-web.js'

type isViewOnce = {
  isViewOnce: boolean
}

const validTypes = [MessageTypes.IMAGE, MessageTypes.VIDEO]

async function sendSticker({ message, ...zap }: ZapType) {
  const chat = await zap.getChat()

  try {
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

      if (!quotedMsg.hasMedia) {
        message.react('⚠')
        return
      }

      if (validTypes.includes(quotedMsg.type)) {
        const media = await quotedMsg.downloadMedia()

        await chat.sendMessage(media, {
          sendMediaAsSticker: true,
          stickerAuthor: BOT_NAME,
          stickerName: zap.translateMessage('fs', 'madeby', { name: BOT_NAME }),
        })
      }
    }
  } catch (error: Error | any) {
    message?.react('⚠')
  }
}

async function sendAutoSticker(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  const { isViewOnce } = message?.rawData as isViewOnce

  if (message?.body.includes('!fs') || isViewOnce) return

  try {
    if (message?.hasMedia && validTypes.includes(message.type)) {
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
  } catch (error: Error | any) {
    message?.react('⚠')
  }
}

export { sendSticker, sendAutoSticker }
