import { ZapType } from '@modules/zapConstructor'
import { OWNER_NUM } from '@utils/envs'

export async function shutDownBot({ message, ...zap }: ZapType) {
  const user = await zap.getUser()

  if (user.id.user === OWNER_NUM) {
    await message?.react('😴')
    process.exit(0)
  }
}
