import { client } from '@config/startupConfig'
import { ZapType } from '@modules/zapConstructor'

export async function joinNewGroup(
  { message, ...zap }: ZapType,
  groupInvite: string,
) {
  const isOwner = await zap.IsOwner()

  try {
    if (isOwner) {
      await client.acceptInvite(groupInvite)
    }
  } catch (error) {
    await message?.reply(zap.translateMessage('acceptInvite', 'error'))
  }
}
