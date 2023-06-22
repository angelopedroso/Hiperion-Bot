import { ZapType } from '@modules/zapConstructor'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'
import { NOME_BOT } from '@utils/envs'
import { MessageTypes } from 'whatsapp-web.js'

async function sendSticker({ message, ...zap }: ZapType) {
  if (message?.hasMedia && message.type !== MessageTypes.STICKER) {
    const chat = await zap.getChat()
    const media = await message.downloadMedia()

    await chat.sendMessage(media, {
      sendMediaAsSticker: true,
      stickerAuthor: NOME_BOT,
      stickerName: `Feito por ${NOME_BOT}`,
    })
  }
}

async function sendAutoSticker(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  const groupChat = await zap.getGroupChat()

  if (!groupChat.isGroup) return

  if (message?.hasMedia && message.type !== MessageTypes.STICKER) {
    if (groupInfo?.auto_sticker) {
      const chat = await zap.getChat()
      const media = await message.downloadMedia()

      await chat.sendMessage(media, {
        sendMediaAsSticker: true,
        stickerAuthor: NOME_BOT,
        stickerName: `Feito por ${NOME_BOT}`,
      })
    }
  }
}

export { sendSticker, sendAutoSticker }
