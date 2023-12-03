import fs from 'fs-extra'
import ffmpeg from 'fluent-ffmpeg'
import { MessageMedia } from 'whatsapp-web.js'
import path from 'path'
import { getRandomName } from './generateRandomName'

export function convertToMp3(url: string): Promise<MessageMedia> {
  const filePath = path.resolve(`assets/audio/tmp/${getRandomName('.mp3')}`)

  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .save(filePath)
      .on('end', function () {
        const media = MessageMedia.fromFilePath(filePath)
        fs.unlinkSync(filePath)
        resolve(media)
      })
      .on('error', function (err) {
        reject(err)
      })
  })
}

export function convertToMp4(url: string): Promise<MessageMedia> {
  const filePath = path.resolve(`assets/audio/tmp/${getRandomName('.mp4')}`)

  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .save(filePath)
      .on('end', () => {
        const media = MessageMedia.fromFilePath(filePath)
        fs.unlinkSync(filePath)
        resolve(media)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}

export function convertOggToMp3(url: string): Promise<string> {
  const filePath = path.resolve(`assets/audio/tmp/${getRandomName('.mp3')}`)

  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .toFormat('mp3')
      .on('end', function () {
        fs.unlink(url)
        resolve(filePath)
      })
      .on('error', function (err) {
        reject(err)
      })
      .save(filePath)
  })
}

export async function makeSticker(media: MessageMedia): Promise<MessageMedia> {
  let filePath = ''
  let outputPath = ''
  let videoType = ''

  if (media.mimetype.includes('image')) {
    filePath = path.resolve(`assets/img/tmp/${getRandomName('.jpeg')}`)
    outputPath = path.resolve(`assets/img/tmp/${getRandomName('.jpeg')}`)
  } else {
    filePath = path.resolve(`assets/audio/tmp/${getRandomName('.mp4')}`)
    outputPath = path.resolve(`assets/audio/tmp/${getRandomName('.webp')}`)
    videoType = media.mimetype.split('/')[1]
  }

  fs.writeFileSync(filePath, Buffer.from(media.data, 'base64'))

  return await new Promise((resolve, reject) => {
    if (media.mimetype === 'video/mp4') {
      ffmpeg(filePath)
        .inputFormat(videoType)
        .on('error', reject)
        .on('end', async () => {
          await fs.unlink(filePath)
          const media = MessageMedia.fromFilePath(outputPath)
          await fs.unlink(outputPath)

          resolve(media)
        })
        .addOutputOptions([
          '-vcodec',
          'libwebp',
          '-vf',
          "scale=212:212,format=rgba,pad=212:212:'(212-iw)/2':'(212-ih)/2':'#00000000',setsar=1,fps=10",
          '-loop',
          '0',
          '-ss',
          '00:00:00.0',
          '-t',
          '00:00:05.0',
          '-preset',
          'default',
          '-an',
          '-vsync',
          '0',
          '-s',
          '212:212',
        ])
        .toFormat('webp')
        .save(outputPath)
    }

    if (media.mimetype.includes('image')) {
      ffmpeg(filePath)
        .size('512x512')
        .on('end', () => {
          fs.unlinkSync(filePath)
          const media = MessageMedia.fromFilePath(outputPath)
          fs.unlinkSync(outputPath)
          resolve(media)
        })
        .on('error', (err) => {
          reject(err)
        })
        .save(outputPath)
    }
  })
}
