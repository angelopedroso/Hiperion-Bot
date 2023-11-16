import { printError } from '@cli/terminal'
import { convertToMp3, convertToMp4 } from '@utils/convertFile'
import axios, { AxiosError } from 'axios'
import { MessageMedia } from 'whatsapp-web.js'

type Params = {
  url: string
  isAudioOnly: boolean
  aFormat: string
}

export async function socialMediaDownloader(
  { url, isAudioOnly, aFormat }: Params,
  isAudio: boolean,
) {
  let media

  const vQuality = 1080
  const formattedUrl = encodeURIComponent(url)

  const requestBody = {
    url: formattedUrl,
    vQuality: `${vQuality}`,
    isAudioOnly,
    aFormat: `${aFormat}`,
  }

  try {
    const { data } = await axios.post(
      'https://co.wuk.sh/api/json',
      JSON.stringify(requestBody),
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )

    if (data.status === 'error') {
      return { type: 'errorAxios', media: null }
    }

    if (data.status === 'stream') {
      if (isAudio) {
        media = await convertToMp3(data.url)
      } else {
        media = await convertToMp4(data.url)
      }
    }

    if (data.status === 'redirect' || data.status === 'success') {
      media = await MessageMedia.fromUrl(data.url)
    }

    if (data.status === 'picker') {
      return {
        type: 'picker',
        media: data.picker.map(
          async (p: { url: string }) => await MessageMedia.fromUrl(p.url),
        ),
      }
    }

    if (media?.filesize && media.filesize >= 16 * 1000 * 1000) {
      return { type: 'errorSize', media: null }
    }

    return {
      type: 'success',
      media,
    }
  } catch (error: any) {
    if (error instanceof AxiosError) {
      printError('Downloader Error: ' + error.message)
      return
    }

    printError(error.message as any)
  }
}
