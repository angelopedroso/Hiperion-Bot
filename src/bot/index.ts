import { configDotenv } from 'dotenv'

import { client, localePath, paths } from '@config/startupConfig'
import {
  Events,
  GroupChat,
  GroupNotification,
  Message,
  WAState,
} from 'whatsapp-web.js'
import qrCode from 'qrcode'

import { createAllGroupsOnReady } from '@api/group/createAllGroupsOnReady'

import { removeFromGroup } from '@modules/groupNotification/removeFromGroup'
import { userTypeChanged } from '@modules/groupNotification/userTypeChanged'
import { groupJoined } from '@modules/groupJoin'

import { LANGUAGE } from '@utils/envs'

import {
  printAuthenticated,
  printAuthenticationFailure,
  printHeader,
  printFooter,
  printQRCode,
  printDisconnect,
} from '@cli/terminal'

import { messageGetter } from '@helpers/messageGetter'
import { cacheMiddleware } from '@lib/prisma'
import { checkBlackListOnInit } from '@api/group/checkBlackListOnInit'

import i18next from 'i18next'
import FsBackend, { FsBackendOptions } from 'i18next-fs-backend'

cacheMiddleware()
configDotenv()

let botReadyTimestamp: Date | null = null

i18next.use(FsBackend).init<FsBackendOptions>({
  fallbackLng: LANGUAGE,
  lng: LANGUAGE,
  supportedLngs: ['en', 'pt'],
  backend: {
    loadPath: localePath,
  },
  ns: paths,
})

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

    Promise.all([createAllGroupsOnReady(groups), checkBlackListOnInit(groups)])

    printFooter()
  })

  client.on(Events.MESSAGE_RECEIVED, async (message: Message) => {
    messageGetter(message)
  })

  client.on(Events.GROUP_JOIN, async (notification: GroupNotification) => {
    await groupJoined(notification, botReadyTimestamp)
  })

  client.on(Events.GROUP_LEAVE, async (notification: GroupNotification) => {
    await removeFromGroup(notification)
  })

  client.on(
    Events.GROUP_ADMIN_CHANGED,
    async (notification: GroupNotification) => {
      await userTypeChanged(notification)
    },
  )

  client.on(Events.DISCONNECTED, (reason: WAState) => {
    printDisconnect(reason)
  })

  client.initialize()
}

export { botReadyTimestamp, start }
