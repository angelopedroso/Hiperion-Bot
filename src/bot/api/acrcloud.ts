import { ACRCloudResponse } from '@typings/acr.interface'
import { convertOggToMp3 } from '@utils/convertFile'
import { localPath } from '@utils/globalVariable'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs-extra'
import { MessageMedia } from 'whatsapp-web.js'
import crypto from 'crypto'

interface acr {
  host: string
  accessKey: string
  accessSecret: string
}

class Acrcloud {
  private host: string
  private access_key: string
  private access_secret: string
  private dataType = 'audio'
  private endpoint = '/v1/identify'
  private secure = true
  private signature_version = '1'

  constructor(config: acr) {
    const { host, accessKey, accessSecret } = config

    this.host = host
    this.access_key = accessKey
    this.access_secret = accessSecret
  }

  private buildStringToSign(
    method: string,
    uri: string,
    accessKey: string,
    dataType: string,
    signatureVersion: string,
    timestamp: number,
  ) {
    return [method, uri, accessKey, dataType, signatureVersion, timestamp].join(
      '\n',
    )
  }

  private sign(string: string, accessSecret: string): string {
    return crypto
      .createHmac('sha1', accessSecret)
      .update(Buffer.from(string, 'utf-8'))
      .digest()
      .toString('base64')
  }

  private async identify(file: Buffer) {
    const currentDate = new Date()
    const timestamp = currentDate.getTime() / 1000

    const stringToSign = this.buildStringToSign(
      'POST',
      this.endpoint,
      this.access_key,
      this.dataType,
      this.signature_version,
      timestamp,
    )

    const signature = this.sign(stringToSign, this.access_secret)

    const form = new FormData()

    form.append('sample', file)
    form.append('access_key', this.access_key)
    form.append('data_type', this.dataType)
    form.append('signature_version', this.signature_version)
    form.append('signature', signature)
    form.append('sample_bytes', 2)
    form.append('timestamp', timestamp)

    const { data } = await axios({
      url: `https://${this.host}${this.endpoint}`,
      method: 'POST',
      data: form,
    })

    return data as ACRCloudResponse
  }

  async recognize(media: MessageMedia) {
    let audioPath = ''

    if (media.mimetype === 'video/mp4') {
      const path = localPath('audio', 'mp4')

      await fs.writeFile(path, media.data, { encoding: 'base64' })

      audioPath = await convertOggToMp3(path)
    } else {
      const path = localPath('audio', 'mp3')

      await fs.writeFile(path, media.data, { encoding: 'base64' })

      audioPath = path
    }
    const fileBuffer = await fs.readFile(audioPath)

    await fs.unlink(audioPath)

    const {
      metadata: { music },
    } = await this.identify(fileBuffer)

    return {
      artist: music[0]?.artists
        .reduce((acc, cur) => acc + cur.name + ', ', '')
        .slice(0, -2),
      title: music[0]?.title,
      label: music[0]?.label,
      link: music[0].external_metadata.youtube?.vid,
    }
  }
}

export { Acrcloud }
