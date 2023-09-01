import { MessageTypes } from 'whatsapp-web.js'

import { ZapType } from '@modules/zapConstructor'
import { db } from '@lib/auth/prisma-query'

import fs from 'fs-extra'
import path from 'path'

import { getRandomName } from '@utils/generateRandomName'
import { checkIfContentIsExplict } from '@api/sightengine'

import { printError } from '@cli/terminal'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

async function maliciousDetector(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  try {
    if (message?.type === MessageTypes.IMAGE && groupInfo?.anti_porn) {
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

      if (!isSenderAdmin) {
        const media = await message.downloadMedia()

        const filePath = path.resolve(`assets/img/tmp/${getRandomName('.png')}`)

        await fs.writeFile(filePath, media.data, { encoding: 'base64' })

        const probality = await checkIfContentIsExplict(filePath)

        if (probality) {
          await Promise.all([
            group.removeParticipants([user.id._serialized]),
            message.delete(true),
            db.createBanLog({
              id: '',
              chat_name: group.name,
              user_name: user.pushname,
              user_phone: user.id.user,
              image: media.data,
              message: '',
              reason: 'malicious',
              date_time: new Date(new Date().toISOString()),
            }),
          ])
        }
      }
    }
  } catch (error: Error | any) {
    printError('Malicious detection: ' + error.message)
  }
}

export { maliciousDetector }
