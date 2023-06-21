import {
  intro,
  note,
  outro,
  spinner,
  log,
  text,
  group,
  cancel,
} from '@clack/prompts'
import { createEnvFile } from 'helpers/createEnv'
import { existsSync } from 'fs'
import color from 'picocolors'

const s = spinner()

export const printHeader = async () => {
  intro(color.bgGreen(color.white(' Whatsapp HIPERION ')))
  note('A Whatsapp bot to manage groups.')

  if (!existsSync('.env')) {
    const groupInfo = await group(
      {
        owner: () =>
          text({
            message: "Please, provide the owner's number (not is bot number).",
            validate(value) {
              if (value.length === 0) return `Number is required!`
            },
          }),
        bot: () =>
          text({
            message: "Please, provide the bot's number.",
            validate(value) {
              if (value.length === 0) return `Number is required!`
            },
          }),
      },
      {
        onCancel: () => {
          cancel('Operation cancelled.')
          process.exit(0)
        },
      },
    )
    log.success('Creating .env file')

    await createEnvFile(groupInfo)
    return
  }

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
