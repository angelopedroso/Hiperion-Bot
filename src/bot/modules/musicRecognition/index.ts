import { ZapType } from '@modules/zapConstructor'
import { MessageTypes } from 'whatsapp-web.js'

import { ACR_HOST, ACR_KEY, ACR_SECRET_KEY } from '@utils/envs'

import { Acrcloud } from '@api/acrcloud'
import { printError } from '@cli/terminal'

export async function recognizeMusic({ message, ...zap }: ZapType) {
  const types = [MessageTypes.AUDIO, MessageTypes.VIDEO, MessageTypes.VOICE]

  const acr = new Acrcloud({
    host: ACR_HOST,
    accessKey: ACR_KEY,
    accessSecret: ACR_SECRET_KEY,
  })

  message?.react('🔄')

  try {
    if (message?.hasMedia && types.includes(message.type)) {
      const media = await message.downloadMedia()

      const res = await acr.recognize(media)

      message.reply(
        zap.translateMessage('recognize', 'message', {
          label: res.label,
          artists: res.artist,
          title: res.title,
        }),
      )

      message.react('🥳')

      return
    }

    if (message?.hasQuotedMsg) {
      const quotedMsg = await message.getQuotedMessage()

      if (quotedMsg?.hasMedia && types.includes(quotedMsg.type)) {
        const media = await quotedMsg.downloadMedia()

        const res = await acr.recognize(media)

        message.reply(
          zap.translateMessage('recognize', 'message', {
            label: res.label,
            artists: res.artist,
            title: res.title,
            url: res.link,
          }),
        )

        message.react('🥳')
      }
    }
  } catch (error: Error | any) {
    message?.react('❌')
    printError(error)
  }
}
