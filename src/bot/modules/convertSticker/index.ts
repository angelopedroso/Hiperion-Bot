import { ZapType } from '@modules/zapConstructor'
import { MessageTypes } from 'whatsapp-web.js'

export async function convertStickerToImg({ message, ...zap }: ZapType) {
  if (message?.hasQuotedMsg) {
    const chat = await zap.getChat()
    const quotedMsg = await message.getQuotedMessage()

    if (!quotedMsg.hasMedia) {
      message.react('⚠')
      return
    }

    if (quotedMsg.type === MessageTypes.STICKER) {
      const media = await quotedMsg.downloadMedia()

      await chat.sendMessage(media)
    }
  }
}
