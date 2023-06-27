import { socialMediaDownloader } from '@api/downloader'
import { ZapType } from '@modules/zapConstructor'
import { isUrl } from '@utils/globalVariable'
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

  if (argsArray.length <= 1) {
    url = argsArray[0]
    isAudio = false
  } else {
    url = argsArray.slice(0, -1).join(' ')
    isAudio = argsArray.slice(-1).join('') === 'audio'
  }

  try {
    const params = {
      url,
      isAudioOnly: isAudio,
      aFormat: 'ogg',
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

    if (downloadMedia === 'errorAxios' || downloadMedia === 'errorSize') {
      message?.react('❌')
      message?.reply(zap.translateMessage('dload', downloadMedia))
      return
    }

    if (downloadMedia) {
      message?.react('🥳')
      chat.sendMessage(downloadMedia)
    }
  } catch (error: Error | any) {
    message?.react('❌')
    await message?.reply(zap.translateMessage('dload', 'errorAxios'))
  }
}
