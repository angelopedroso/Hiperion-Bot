import { ZapType } from '@modules/zapConstructor'
import { OWNER_NUM } from '@utils/envs'

export async function sendPing({ message, ...zap }: ZapType) {
  const user = await zap.getUser()

  if (user.id.user === OWNER_NUM) {
    await message?.reply('pong')
  }
}
