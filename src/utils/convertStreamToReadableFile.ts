import fs from 'fs-extra'
import ffmpeg from 'fluent-ffmpeg'
import { MessageMedia } from 'whatsapp-web.js'
import path from 'path'
import { getRandomName } from './generateRandomName'

export function convertToMp3(url: string): Promise<MessageMedia> {
  const filePath = path.resolve(`assets/audio/tmp/${getRandomName('.mp3')}`)

  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .toFormat('mp3')
      .save(filePath)
      .on('end', function () {
        const media = MessageMedia.fromFilePath(filePath)
        fs.unlinkSync(filePath)
        resolve(media)
      })
      .on('error', function (err) {
        console.error('MP3: ' + err)
        reject(err)
      })
  })
}

export function convertToMp4(url: string): Promise<MessageMedia> {
  const filePath = path.resolve(`assets/audio/tmp/${getRandomName('.mp4')}`)

  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .toFormat('mp4')
      .save(filePath)
      .on('end', () => {
        const media = MessageMedia.fromFilePath(filePath)
        fs.unlinkSync(filePath)
        resolve(media)
      })
      .on('error', (err) => {
        console.error('MP4: ' + err)
        reject(err)
      })
  })
}
