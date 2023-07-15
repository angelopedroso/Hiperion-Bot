import { ZapType } from '@modules/zapConstructor'
import { groupInfoCache } from '@typings/cache/groupInfo.interface'

export async function sendGroupInviteLink({ message, ...zap }: ZapType) {
  const botIsAdmin = await zap.isBotAdmin()

  if (!botIsAdmin) {
    message?.reply(zap.translateMessage('general', 'botisnotadmin'))
    return
  }

  const chatLink = await zap.getGroupLink()
  message?.reply(`https://chat.whatsapp.com/${chatLink}`)
}

export async function autoGroupInviteLink(
  { message, ...zap }: ZapType,
  groupInfo: groupInfoCache | null | undefined,
) {
  const botIsAdmin = await zap.isBotAdmin()

  const messageBody = message?.body.toLowerCase()

  if (!botIsAdmin) {
    message?.reply(zap.translateMessage('general', 'botisnotadmin'))
    return
  }

  if (groupInfo?.auto_invite_link && !messageBody?.includes('!link')) {
    if (messageBody?.includes('link')) {
      const chatLink = await zap.getGroupLink()
      message?.reply(`https://chat.whatsapp.com/${chatLink}`)
    }
  }
}
