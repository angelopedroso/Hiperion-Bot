import { ZapType } from '@modules/zapConstructor'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

export async function sendGroupInviteLink(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  if (groupInfo?.auto_invite_link) {
    if (message?.body.includes('link')) {
      const chatLink = await zap.getGroupLink()
      message.reply(`https://chat.whatsapp.com/${chatLink}`)
    }
  }
}
