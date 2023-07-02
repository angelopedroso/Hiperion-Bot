import { convertToMp3, convertToMp4 } from '@utils/convertStreamToReadableFile'
import axios from 'axios'
import { MessageMedia } from 'whatsapp-web.js'

type Params = {
  url: string
  isAudioOnly: boolean
  aFormat: string
}

export async function socialMediaDownloader(params: Params, isAudio: boolean) {
  let media
  const { data } = await axios.post(
    'http://localhost:9000/api/json',
    JSON.stringify(params),
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
}
