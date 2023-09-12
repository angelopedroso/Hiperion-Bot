import { openai } from '@lib/openai'
import fs from 'fs-extra'
import { convertOggToMp3 } from './convertFile'
import { MessageMedia } from 'whatsapp-web.js'

export interface TranscriptionProps {
  media: MessageMedia
  path: string
}

export async function transcription({ path, media }: TranscriptionProps) {
  const { filesize, data: mediaData } = media
  const limitSize = 16 * 1000 * 1000 // 16mb

  if (filesize && filesize > limitSize) return ''

  try {
    await fs.writeFile(path, mediaData, { encoding: 'base64' })

    const file = await convertOggToMp3(path)

    const { data } = await openai.createTranscription(
      fs.createReadStream(file) as any,
      'whisper-1',
    )

    await fs.unlink(file)

    return data.text
  } catch (error) {
    return ''
  }
}
