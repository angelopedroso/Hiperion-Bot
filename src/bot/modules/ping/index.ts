import { ZapType } from '@modules/zapConstructor'

export async function sendPing({ message, ...zap }: ZapType) {
  const isOwner = await zap.IsOwner()

  if (isOwner) {
    await message?.reply('pong')
  }
}
