import { client, constants } from '@config/startupConfig'
import { Events, GroupChat, GroupNotification, Message } from 'whatsapp-web.js'
import qrCode from 'qrcode'

import { configDotenv } from 'dotenv'

import { createAllGroupsOnReady } from 'api/group/createAllGroupsOnReady'

import { ZapConstructor } from '@modules/zapConstructor'
import { linkDetector } from '@modules/linkDetector'
import { bemVindo } from '@modules/bemVindo'

import {
  printAuthenticated,
  printAuthenticationFailure,
  printHeader,
  printFooter,
  printQRCode,
} from 'cli/terminal'

let botReadyTimestamp: Date | null = null

configDotenv()

const start = () => {
  printHeader()

  client.on(Events.QR_RECEIVED, async (qr: string) => {
    const qrResult = await qrCode.toString(qr, {
      type: 'terminal',
      small: true,
    })
    printQRCode(qrResult)
  })

  client.on(Events.AUTHENTICATED, () => {
    printAuthenticated()
  })

  client.on(Events.AUTHENTICATION_FAILURE, () => {
    printAuthenticationFailure()
  })

  client.on(Events.READY, async () => {
    botReadyTimestamp = new Date()

    const groups = (await client.getChats()).filter(
      (g) => g.isGroup,
    ) as GroupChat[]

    await createAllGroupsOnReady(groups)

    printFooter()
  })

  client.on(Events.MESSAGE_RECEIVED, async (message: Message) => {
    if (message.from === constants.statusBroadcast) return
    if (message.timestamp !== null) {
      const messageTimestamp = new Date(message.timestamp * 1000)

      if (botReadyTimestamp === null) return

      if (messageTimestamp < botReadyTimestamp) return
    }

    const zap = ZapConstructor(client, message)

    await linkDetector(zap)
  })

  client.on(Events.GROUP_JOIN, async (notification: GroupNotification) => {
    await bemVindo(notification)
  })

  client.initialize()
}

start()

export { botReadyTimestamp }
