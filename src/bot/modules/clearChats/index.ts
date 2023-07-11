import { ZapType } from '@modules/zapConstructor'
import { printError } from '@cli/terminal'

export async function clearAllChats({ message, ...zap }: ZapType) {
  const isOwner = await zap.IsOwner()

  if (!isOwner) return message?.react('❌')

  try {
    await zap.clearAllChats()
    message?.react('👌🏼')
  } catch (error: Error | any) {
    printError(error)
    message?.react('⛔')
  }
}
