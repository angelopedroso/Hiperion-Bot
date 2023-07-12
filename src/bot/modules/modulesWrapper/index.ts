import { ZapType } from '@modules/zapConstructor'
import { commandMap } from './commandMap'
import { LocaleFileName } from '@locales/@types/command.interface'
import { db } from '@lib/auth/prisma-query'

export async function registerModules(zap: ZapType) {
  if (zap.message?.body.startsWith('!')) {
    const { isGroup, name } = await zap.getChat()
    const { pushname } = await zap.getUser()
    const commandParts = zap.message.body.split(' ')
    const commandName = commandParts[0].replace('!', '').toLowerCase()
    const args = commandParts.slice(1)

    const commandInfo = commandMap.get(commandName)

    if (commandInfo) {
      const { handler, expectedArgs, fullArg } = commandInfo

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

      if (expectedArgs === 'any' || args.length === expectedArgs) {
        if (fullArg) {
          const arg = args.join(' ')
          await handler(zap, arg)
        } else {
          await handler(zap, ...args)
        }

        await db.createLog({
          command: commandName,
          user_name: pushname,
          is_group: isGroup,
          chat_name: isGroup ? name : null,
        })

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
