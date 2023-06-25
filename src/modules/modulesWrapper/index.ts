import { ZapType } from '@modules/zapConstructor'
import { commandMap } from './commandMap'
import { LocaleFileName } from '@locales/@types/command.interface'

export async function registerModules(zap: ZapType) {
  if (zap.message?.body.startsWith('!')) {
    const commandParts = zap.message.body.split(' ')
    const commandName = commandParts[0].replace('!', '')
    const args = commandParts.slice(1)

    const commandInfo = commandMap.get(commandName)

    if (commandInfo) {
      const { handler, expectedArgs, phoneArg } = commandInfo

      if (args.includes('help')) {
        if (
          zap.translateMessage(commandName as LocaleFileName, 'help') ===
          `${commandName}:help`
        ) {
          return
        }

        await zap.message.reply(
          zap.translateMessage(commandName as LocaleFileName, 'help'),
        )

        return
      }

      if (phoneArg) {
        const phone = args.join(' ')
        await handler(zap, phone)
        return
      }

      if (expectedArgs === 'any' || args.length === expectedArgs) {
        await handler(zap, ...args)
        return
      }

      await zap.message.reply(
        zap.translateMessage('wrongcmd', 'wrongcommand', {
          command: commandName,
        }),
      )
    }
  }
}
