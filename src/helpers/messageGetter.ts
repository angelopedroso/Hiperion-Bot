import { Message } from 'whatsapp-web.js'
import { client, constants } from '@config/startupConfig'

import { checkGroupFeatures } from '@modules/checkGroup'
import { ZapConstructor } from '@modules/zapConstructor'

import { botReadyTimestamp } from '../..'

export async function messageGetter(message: Message) {
  if (message.from === constants.statusBroadcast) return
  if (message.timestamp !== null) {
    const messageTimestamp = new Date(message.timestamp * 1000)

    if (botReadyTimestamp === null) return

    if (messageTimestamp < botReadyTimestamp) return
  }

  const zap = ZapConstructor(client, message)

  checkGroupFeatures(zap)

  if (message.body === 'off') {
    process.exit(0)
  }
}
