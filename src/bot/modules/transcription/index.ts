import { ZapType } from '@modules/zapConstructor'
import { MessageTypes } from 'whatsapp-web.js'
import { printError } from '@cli/terminal'
import { localPath } from '@utils/globalVariable'
import { transcription } from '@utils/transcriptionFunction'

export async function transcriptionAudio({ message, ...zap }: ZapType) {
  const isOwner = await zap.IsOwner()

  if (!isOwner) {
    message?.reply(zap.translateMessage('general', 'onlyowner'))
    return
  }

  try {
    if (message?.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage()
      const path = localPath('audio', 'ogg')

      message.react('🔄')

      if (quotedMsg.hasMedia && quotedMsg.type === MessageTypes.VOICE) {
        const media = await quotedMsg.downloadMedia()

        const messageTranscripted = await transcription({ media, path })

        message?.react('🥳')
        message.reply(messageTranscripted)
        return
      }

      message.react('⚠')
    }
  } catch (error: Error | any) {
    printError(error)
    message?.react('❌')
  }
}
