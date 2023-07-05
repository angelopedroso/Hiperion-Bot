import { ZapType } from '@modules/zapConstructor'
import { MessageTypes } from 'whatsapp-web.js'
import fs from 'fs-extra'
import { openai } from '@lib/openai'
import { convertOggToMp3 } from '@utils/convertFile'
import { printError } from 'cli/terminal'
import { localPath } from '@utils/globalVariable'

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

        await fs.writeFile(path, media.data, { encoding: 'base64' })

        const file = await convertOggToMp3(path)

        const { data } = await openai.createTranscription(
          fs.createReadStream(file) as any,
          'whisper-1',
        )

        await fs.unlink(file)
        message?.react('🥳')
        message.reply(data.text)
        return
      }

      message.react('⚠')
    }
  } catch (error: Error | any) {
    printError(error)
    message?.react('❌')
  }
}
