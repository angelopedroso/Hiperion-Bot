import { convertToMp3, convertToMp4 } from '@utils/convertStreamToReadableFile'
import axios from 'axios'
import { MessageMedia } from 'whatsapp-web.js'

type Params = {
  url: string
  isAudioOnly: boolean
  aFormat: string
}

export async function socialMediaDownloader(
  params: Params,
  isAudio: string | undefined,
) {
  let media
  const { data } = await axios.post('https://donlod.hop.sh/api/json', params, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (data.status === 'error') {
    return 'errorAxios'
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

  if (media?.filesize && media.filesize >= 16 * 1000 * 1000) {
    return 'errorSize'
  }

  return media
}
