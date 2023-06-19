import { configDotenv } from 'dotenv'

import { client } from '@config/startupConfig'
import { Events, GroupChat, GroupNotification, Message } from 'whatsapp-web.js'
import qrCode from 'qrcode'

import { createAllGroupsOnReady } from '@api/group/createAllGroupsOnReady'

import { groupJoined } from '@modules/groupJoin'

import {
  printAuthenticated,
  printAuthenticationFailure,
  printHeader,
  printFooter,
  printQRCode,
} from 'cli/terminal'

import { existsSync } from 'fs'
import { messageGetter } from 'helpers/messageGetter'
import { cacheMiddleware } from '@lib/prisma'

cacheMiddleware()
configDotenv()

let botReadyTimestamp: Date | null = null

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
    messageGetter(message)
  })

  client.on(Events.GROUP_JOIN, async (notification: GroupNotification) => {
    await groupJoined(notification, botReadyTimestamp)
  })

  client.initialize()
}

if (!existsSync('.env')) {
  printHeader()
} else {
  start()
}

export { botReadyTimestamp }
