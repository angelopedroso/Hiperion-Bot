import { ZapType } from '@modules/zapConstructor'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

export async function sendGroupInviteLink({ message, ...zap }: ZapType) {
  const chatLink = await zap.getGroupLink()
  await message?.reply(`https://chat.whatsapp.com/${chatLink}`)
}

export async function autoGroupInviteLink(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  if (groupInfo?.auto_invite_link && !message?.body.includes('!link')) {
    if (message?.body.includes('link')) {
      const chatLink = await zap.getGroupLink()
      await message.reply(`https://chat.whatsapp.com/${chatLink}`)
    }
  }
}
