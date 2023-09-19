import { Contact, GroupChat, MessageTypes } from 'whatsapp-web.js'
import { ZapType } from '@modules/zapConstructor'
import { db } from '@lib/auth/prisma-query'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

import { checkIfContentIsExplict } from '@api/sightengine'

import fs from 'fs-extra'
import path from 'path'

import { getRandomName } from '@utils/generateRandomName'
import { resizeImage } from '@utils/reduceBase64Size'
import {
  calculateFrameTimes,
  extractFrames,
  getVideoDuration,
} from '@utils/getVideoFrames'

import { printError } from '@cli/terminal'

async function maliciousDetector(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  try {
    if (groupInfo?.anti_porn) {
      const group = await zap.getGroupChat()
      const user = await zap.getUser()
      const isBotAdmin = await zap.isBotAdmin()
      const isSenderAdmin = await zap.getUserIsAdmin(user.id._serialized)

      if (!isBotAdmin) {
        await db.updateGroupExceptParticipants(group.id._serialized, {
          anti_porn: false,
        })
        return
      }

      if (isSenderAdmin) return

      if (message?.type === MessageTypes.IMAGE) {
        await handleMaliciousImage(group, user, message)
      }

      if (message?.type === MessageTypes.VIDEO) {
        await handleMaliciousVideo(group, user, message)
      }
    }
  } catch (error: Error | any) {
    printError('Malicious detection: ' + error.message)
  }
}

async function handleMaliciousImage(
  group: GroupChat,
  user: Contact,
  message: ZapType['message'],
) {
  if (message) {
    const media = await message.downloadMedia()
    const filePath = path.resolve(`assets/img/tmp/${getRandomName('.png')}`)
    await fs.writeFile(filePath, media.data, { encoding: 'base64' })

    const probability = await checkIfContentIsExplict(filePath)

    if (probability) {
      await handleMaliciousContent(
        group,
        user,
        message,
        media.mimetype,
        media.data,
      )
    }
  }
}

async function handleMaliciousVideo(
  group: GroupChat,
  user: Contact,
  message: ZapType['message'],
) {
  if (message) {
    const media = await message.downloadMedia()
    const videoData = Buffer.from(media.data, 'base64')

    const filePath = path.resolve(`assets/img/tmp/${getRandomName('.mp4')}`)
    const outputDir = path.resolve('assets/img/tmp/')

    try {
      await fs.writeFile(filePath, videoData)

      const duration = await getVideoDuration(filePath)
      const frameTimes = calculateFrameTimes(duration)
      const framePaths = await extractFrames(filePath, outputDir, frameTimes)

      const probabilities = await Promise.all(
        framePaths.map(async (framePath) => ({
          status: await checkIfContentIsExplict(framePath),
          path: framePath,
        })),
      )

      const isMalicious = probabilities.find((frame) => frame.status)

      if (isMalicious) {
        const imageDataBuffer = fs.readFileSync(isMalicious.path)
        const imageDataBase64 = imageDataBuffer.toString('base64')

        await handleMaliciousContent(
          group,
          user,
          message,
          'image/jpeg',
          imageDataBase64,
        )
      }
    } catch (error: Error | any) {
      printError('Malicious detection - handleMaliciousVideo: ' + error.message)
    } finally {
      await fs.unlink(filePath)
    }
  }
}

async function handleMaliciousContent(
  group: GroupChat,
  user: Contact,
  message: ZapType['message'],
  mimetype: string,
  content: string,
) {
  const resizedImage = await resizeImage(`data:${mimetype};base64,${content}`)
  const sliceIndex = resizedImage.indexOf('base64,')

  await Promise.all([
    group.removeParticipants([user.id._serialized]),
    message?.delete(true),
  ])

  await db.createBanLog({
    id: '',
    chat_name: group.name,
    user_name: user.pushname,
    user_phone: user.id.user,
    image: resizedImage.slice(0, sliceIndex),
    message: '',
    reason: 'malicious',
    date_time: new Date(new Date().toISOString()),
  })
}

export { maliciousDetector }
