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
  const { data } = await axios.post('https://donlod.hop.sh/api/json', params, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (data.status === 'error') {
    return 'errorNotFound'
  }

  if (data.status === 'stream') {
    let media

    if (isAudio) {
      media = await convertToMp3(data.url)
    } else {
      media = await convertToMp4(data.url)
    }

    return media
  }

  const media = await MessageMedia.fromUrl(data.url)

  return media
}
