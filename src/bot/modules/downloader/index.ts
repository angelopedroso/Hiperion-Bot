import { socialMediaDownloader } from '@api/downloader'
import { ZapType } from '@modules/zapConstructor'
import { isUrl } from '@utils/globalVariable'
import { MessageMedia } from 'whatsapp-web.js'
import ytsr, { Item } from 'ytsr'

type Video = Item & {
  url: string
}

export async function mediaDownloader(
  { message, ...zap }: ZapType,
  args: string,
) {
  const chat = await zap.getChat()
  const argsArray = args.split(' ')

  let url: string
  let isAudio: boolean

  if (argsArray.length >= 2) {
    url = argsArray.slice(0, -1).join(' ')
    isAudio = argsArray.slice(-1).join('') === 'audio'
  } else {
    url = argsArray[0]
    isAudio = false
  }

  if (message?.hasQuotedMsg) {
    const quotedMsg = await message.getQuotedMessage()
    url = quotedMsg.body
  }

  try {
    const params = {
      url,
      isAudioOnly: isAudio,
      aFormat: 'mp3',
    }

    let downloadMedia

    message?.react('🔄')

    if (!isUrl.test(url)) {
      const { items } = await ytsr(url, { limit: 1 })
      const { url: videoUrl } = items[0] as Video

      if (videoUrl) {
        params.url = videoUrl
        params.isAudioOnly = true

        downloadMedia = await socialMediaDownloader(params, true)
      }
    } else {
      downloadMedia = await socialMediaDownloader(params, isAudio)
    }

    if (
      downloadMedia?.type === 'errorAxios' ||
      downloadMedia?.type === 'errorSize'
    ) {
      message?.react('❌')
      message?.reply(zap.translateMessage('dload', downloadMedia.type))
      return
    }

    if (downloadMedia) {
      if (downloadMedia.type === 'picker') {
        downloadMedia.media.forEach(async (url: Promise<MessageMedia>) => {
          const media = await url
          chat.sendMessage(media)
        })

        message?.react('🥳')

        return
      }

      message?.react('🥳')
      chat.sendMessage(downloadMedia.media)
    }
  } catch (error: Error | any) {
    message?.react('❌')
    await message?.reply(zap.translateMessage('dload', 'errorAxios'))
  }
}
