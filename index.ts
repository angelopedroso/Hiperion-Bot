import { client, constants } from '@config/startupConfig'
import {
  printAuthenticated,
  printAuthenticationFailure,
  printHeader,
  printFooter,
  printQRCode,
} from 'cli/terminal'
import qrCode from 'qrcode'
import { Events, GroupChat, Message } from 'whatsapp-web.js'
import { linkDetector } from '@modules/linkDetector'
import { ZapConstructor } from '@modules/zapConstructor'
import { PrismaQuery } from 'lib/auth/prisma-query'
import { createAllGroupsOnReady } from 'api/group/createAllGroupsOnReady'

let botReadyTimestamp: Date | null = null
const db = PrismaQuery()

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

    const groups = (await client.getChats()).filter((g) => g.isGroup)

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

  client.on(Events.GROUP_JOIN, async (message: Message) => {
    const chat = (await message.getChat()) as GroupChat

    await db.createGroup({
      id: message.id.remote,
      participantes: chat.participants.map((participant) => {
        return {
          id: participant.id.user,
          tipo:
            participant.isAdmin || participant.isSuperAdmin
              ? 'admin'
              : 'membro',
        }
      }),
      bemvindo: false,
      linkDetector: false,
      pornDetector: false,
      travaDetector: { status: false, maxCharacters: 0 },
      blackList: [],
    })
  })

  client.initialize()
}

start()

export { botReadyTimestamp }
