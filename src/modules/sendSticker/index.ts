import { ZapType } from '@modules/zapConstructor'
import { MessageTypes } from 'whatsapp-web.js'

export async function sendSticker({ message, ...zap }: ZapType) {
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
