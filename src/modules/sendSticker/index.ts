import { ZapType } from '@modules/zapConstructor'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'
import { MessageTypes } from 'whatsapp-web.js'

async function sendSticker({ message, ...zap }: ZapType) {
  if (message?.hasMedia && message.type !== MessageTypes.STICKER) {
    const chat = await zap.getChat()
    const media = await message.downloadMedia()

    await chat.sendMessage(media, {
      sendMediaAsSticker: true,
      stickerAuthor: 'Hiperion',
      stickerName: 'Feito por Hiperion',
    })
  }
}

async function sendAutoSticker(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  const groupChat = await zap.getGroupChat()

  if (!groupChat.isGroup) return

  if (groupInfo?.auto_sticker) {
    if (message?.hasMedia && message.type !== MessageTypes.STICKER) {
      const chat = await zap.getChat()
      const media = await message.downloadMedia()

      await chat.sendMessage(media, {
        sendMediaAsSticker: true,
        stickerAuthor: 'Hiperion',
        stickerName: 'Feito por Hiperion',
      })
    }
  }
}

export { sendSticker, sendAutoSticker }
