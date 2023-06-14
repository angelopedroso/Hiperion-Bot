import { ZapType } from '@modules/zapConstructor'
import { isUrl, socialMediaRegex } from '@utils/globalVariable'

const linkDetector = async ({ message, ...zap }: ZapType) => {
  const chat = await zap.getChat()

  if (!chat.isGroup) return

  const user = await zap.getUser()

  const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

  if (isUrl.test(message.body) && !isAdmin) {
    const msgs = await chat.fetchMessages({ limit: 1, fromMe: false })

    const invalidLinks = msgs
      .map((msg) => msg.links.filter((l) => !socialMediaRegex.test(l.link)))
      .filter((links) => links.length > 0)
      .flat()

    if (invalidLinks.length !== 0) {
      message.reply('alo')
      message.delete(true)
    }
  }
}

export { linkDetector }
