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

const paths = [
  'about',
  'acceptInvite',
  'add',
  'ban',
  'bl',
  'demote',
  'dload',
  'fs',
  'general',
  'groupinfo',
  'notgroup',
  'promote',
  'td',
  'totext',
  'welcome',
  'wrongcmd',
]

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: undefined,
    dataPath: constants.sessionPath,
  }),
  puppeteer: {
    headless: true,
    executablePath:
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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

export { constants, client, paths }
