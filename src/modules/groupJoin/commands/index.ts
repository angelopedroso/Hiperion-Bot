import { client } from '@config/startupConfig'
import { ZapType } from '@modules/zapConstructor'

export async function joinNewGroup(
  { message, ...zap }: ZapType,
  groupInvite: string,
) {
  const isOwner = await zap.IsOwner()
  const formattedGropInvite = groupInvite.split('com/')[1]

  try {
    if (isOwner) {
      await message?.react('👌🏼')
      await client.acceptInvite(formattedGropInvite)
    }
  } catch (error) {
    await message?.reply(zap.translateMessage('acceptInvite', 'error'))
  }
}
