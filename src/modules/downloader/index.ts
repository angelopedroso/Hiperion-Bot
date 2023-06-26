import { socialMediaDownloader } from '@api/downloader'
import { ZapType } from '@modules/zapConstructor'

export async function mediaDownloader(
  { message, ...zap }: ZapType,
  url: string,
  isAudio?: string,
) {
  const chat = await zap.getChat()

  try {
    const params = {
      url,
      isAudioOnly: !!isAudio,
      aFormat: 'ogg',
    }

    message?.react('🔄')

    const downloadMedia = await socialMediaDownloader(params, isAudio)

    if (downloadMedia === 'errorNotFound') {
      message?.reply(zap.translateMessage('dload', 'error'))
      return
    }

    chat.sendMessage(downloadMedia)
  } catch (error: Error | any) {
    await message?.reply(zap.translateMessage('dload', 'errorAxios'))
  }
}
