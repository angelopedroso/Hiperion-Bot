import path from 'path'
import { Client, LocalAuth } from 'whatsapp-web.js'

interface IConstants {
  // WhatsApp status broadcast
  statusBroadcast: string

  // WhatsApp session storage
  sessionPath: string
}

const constants: IConstants = {
  statusBroadcast: 'status@broadcast',
  sessionPath: './',
}

const localePath = path.join(__dirname, '..', '/locales/{{lng}}/{{ns}}.json') // build

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: undefined,
    dataPath: constants.sessionPath,
  }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/google-chrome', // Docker, replace it if you dont use docker
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--aggressive-cache-discard',
      '--disable-cache',
      '--disable-application-cache',
      '--disable-offline-load-stale-cache',
      '--disk-cache-size=0',
    ],
  },
})

export { constants, client, localePath }
