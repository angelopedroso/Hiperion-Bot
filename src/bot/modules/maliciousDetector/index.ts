import { Contact, GroupChat, MessageTypes } from 'whatsapp-web.js'
import { ZapType } from '@modules/zapConstructor'
import { db } from '@lib/auth/prisma-query'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

import { checkIfContentIsExplict } from '@api/sightengine'

import fs from 'fs-extra'
import path from 'path'

import { getRandomName } from '@utils/generateRandomName'
import { extractRandomFrame } from '@utils/getVideoFrames'

import { printError } from '@cli/terminal'
// import { uploadImage } from '@utils/uploadImage'

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
    // console.log('🚀 ~ file: index.ts:50 ~ error:', error)
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

    if (media) {
      const filePath = path.resolve(`assets/img/tmp/${getRandomName('.png')}`)
      await fs.writeFile(filePath, media.data, { encoding: 'base64' })

      try {
        const probability = await checkIfContentIsExplict(filePath)

        if (probability) {
          await handleMaliciousContent(group, user, message, media.data)
        }
      } catch (error: Error | any) {
        printError(
          'Malicious detection - handleMaliciousImage: ' + error.message,
        )
        // console.log(error)
      }
    }
  }
}

async function handleMaliciousVideo(
  group: GroupChat,
  user: Contact,
  message: ZapType['message'],
) {
  if (message?.hasMedia) {
    const media = await message.downloadMedia()

    if (media) {
      const videoData = Buffer.from(media.data, 'base64')

      const filePath = path.resolve(`assets/img/tmp/${getRandomName('.mp4')}`)
      const outputDir = path.resolve('assets/img/tmp/')
      let framePath = ''

      try {
        await fs.writeFile(filePath, videoData)

        framePath = await extractRandomFrame(filePath, outputDir)

        const probability = await checkIfContentIsExplict(framePath, 'video')

        if (probability) {
          const imageDataBuffer = fs.readFileSync(framePath)
          const imageDataBase64 = imageDataBuffer.toString('base64')

          await handleMaliciousContent(group, user, message, imageDataBase64)
        }
      } catch (error: Error | any) {
        // console.log('🚀 ~ file: index.ts:113 ~ error:', error)
        printError(
          'Malicious detection - handleMaliciousVideo: ' + error.message,
        )
      } finally {
        await fs.unlink(filePath)
        await fs.unlink(framePath)
      }
    }
  }
}

async function handleMaliciousContent(
  group: GroupChat,
  user: Contact,
  message: ZapType['message'],
  content: string,
) {
  try {
    // const imgUrl = await uploadImage(content)

    await Promise.all([
      group.removeParticipants([user.id._serialized]),
      message?.delete(true),
    ])

    await db.createBanLog({
      id: '',
      chat_name: group.name,
      user_name: user.pushname,
      user_phone: user.id.user,
      image: content,
      message: '',
      reason: 'malicious',
      date_time: new Date(new Date().toISOString()),
    })
  } catch (error: Error | any) {
    printError('Malicious detection - handleMaliciousContent: ' + error.message)
  }
}

export { maliciousDetector }
