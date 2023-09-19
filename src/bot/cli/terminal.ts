import { intro, note, outro, spinner, log } from '@clack/prompts'
import color from 'picocolors'

const s = spinner()

export const printHeader = async () => {
  intro(color.bgGreen(color.white(' Whatsapp HIPERION ')))
  note('A Whatsapp bot to manage groups.')

  s.start('Starting')
}

export const printQRCode = (qr: string) => {
  s.stop('Client is ready!')
  note(qr, 'Scan the QR code below to login to Whatsapp Web.')
  s.start('Waiting for QR code to be scanned')
}

export const printAuthenticated = () => {
  s.stop('Session started!')
  log.success('Opened session')
  s.start('Checking if exists all groups in database')
}

export const printAuthenticationFailure = () => {
  s.stop('Authentication failed!')
}

export const printFooter = () => {
  s.stop('Loaded!')
  outro('Whatsapp HIPERION is ready to use. 🎉')
}

export const printLog = (info: any) => {
  log.info(color.bgGreen(color.white('Info: ')) + info)
}

export const printError = (error: string) => {
  log.error(color.bgRed(color.white('An error occurred: ')) + error)
}

export const printDisconnect = (reason: string) => {
  log.warn(color.bgYellow(color.white('Disconnected: ')) + reason)
}
