import { client } from '@config/startupConfig'
import {
  printAuthenticated,
  printAuthenticationFailure,
  printHeader,
  printFooter,
  printQRCode,
} from 'cli/terminal'
import constants from './src/constants'
import qrCode from 'qrcode'
import { Events, Message } from 'whatsapp-web.js'

const start = async () => {
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

  client.on(Events.READY, () => {
    printFooter()
  })

  client.on(Events.MESSAGE_RECEIVED, (message: Message) => {
    if (message.from === constants.statusBroadcast) return
  })

  client.initialize()
}

start()
