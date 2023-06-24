import { ZapType } from '@modules/zapConstructor'
import { commandMap } from './commandMap'

export async function registerModules(zap: ZapType) {
  if (zap.message?.body.startsWith('!')) {
    const commandParts = zap.message.body.split(' ')
    const commandName = commandParts[0].replace('!', '')
    const args = commandParts.slice(1)

    const commandInfo = commandMap.get(commandName)

    if (commandInfo) {
      const { handler, expectedArgs } = commandInfo

      if (args.includes('help')) {
        if (
          zap.translateMessage(`${commandName}.help`) === `${commandName}.help`
        ) {
          return
        }

        await zap.message.reply(zap.translateMessage(`${commandName}.help`))

        return
      }

      if (expectedArgs === 'any' || args.length === expectedArgs) {
        await handler(zap, ...args)
        return
      }

      await zap.message.reply(
        zap.translateMessage('wrongcommand', { command: commandName }),
      )
    }
  }
}
