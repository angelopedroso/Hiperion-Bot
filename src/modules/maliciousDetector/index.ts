import { MessageTypes } from 'whatsapp-web.js'

import { ZapType } from '@modules/zapConstructor'
import { db } from '@lib/auth/prisma-query'

import fs from 'fs'
import path from 'path'

import { getRandomName } from '@utils/generateRandomName'
import { checkIfContentIsExplict } from './util'

import { printError } from 'cli/terminal'

async function maliciousDetector({ message, ...zap }: ZapType) {
  try {
    if (message?.type === MessageTypes.IMAGE) {
      const group = await zap.getGroupChat()

      const user = await zap.getUser()

      const groupInfo = await db.getGroupInfo(group.id._serialized)

      if (groupInfo?.anti_porn) {
        const isBotAdmin = await zap.getBotAdmin()

        const isSenderAdmin = await zap.getUserIsAdmin(message.from)

        if (!isBotAdmin) {
          await db.updateGroupExceptParticipants(group.id._serialized, {
            anti_porn: false,
          })
        }

        if (!isSenderAdmin) {
          const media = await message.downloadMedia()

          const filePath = path.resolve(
            `assets/img/tmp/${getRandomName('.png')}`,
          )

          fs.writeFileSync(filePath, media.data, { encoding: 'base64' })

          const probality = await checkIfContentIsExplict(filePath)

          if (probality) {
            await Promise.all([
              group.removeParticipants([user.id._serialized]),
              message.delete(true),
            ])
          }
        }
      }
    }
  } catch (error: Error | any) {
    printError('Malicious detection: ' + error.message)
  }
}

export { maliciousDetector }
