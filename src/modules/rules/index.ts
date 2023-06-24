import { ZapType } from '@modules/zapConstructor'

export async function sendRules({ message, ...zap }: ZapType) {
  const chat = await zap.getGroupChat()

  if (chat.isGroup) {
    await message?.reply(chat.description)
    return
  }

  await message?.reply(zap.translateMessage('notgrouperror'))
}
