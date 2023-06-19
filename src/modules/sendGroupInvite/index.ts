import { ZapType } from '@modules/zapConstructor'

export async function sendGroupInviteLink({ message, ...zap }: ZapType) {
  if (message?.body.includes('link')) {
    const chatLink = await zap.getGroupLink()
    message.reply(`https://chat.whatsapp.com/${chatLink}`)
  }
}
