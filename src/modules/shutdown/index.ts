import { ZapType } from '@modules/zapConstructor'

export async function shutDownBot({ message, ...zap }: ZapType) {
  const isOwner = await zap.IsOwner()

  if (isOwner) {
    await message?.react('😴')
    process.exit(0)
  }
}
