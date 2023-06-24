import { db } from '@lib/auth/prisma-query'
import { ZapType } from '@modules/zapConstructor'

export async function sendGroupStatus({ message, ...zap }: ZapType) {
  const chat = await zap.getChat()
  const user = await zap.getUser()

  const isAdmin = await zap.getUserIsAdmin(user.id._serialized)

  if (!isAdmin) return

  if (chat.isGroup) {
    const groupInfo = await db.getGroupInfo(chat.id._serialized)

    const config = {
      link: groupInfo?.anti_link ? '🟩' : '🟥',
      malicious: groupInfo?.anti_porn ? '🟩' : '🟥',
      bv: groupInfo?.bem_vindo ? '🟩' : '🟥',
      og: groupInfo?.one_group ? '🟩' : '🟥',
      ail: groupInfo?.auto_invite_link ? '🟩' : '🟥',
      as: groupInfo?.auto_sticker ? '🟩' : '🟥',
      bl: groupInfo?.black_list.length,
      at: groupInfo?.anti_trava?.status
        ? `🟩 - ${groupInfo?.anti_trava.max_characters}`
        : `🟥 - ${groupInfo?.anti_trava?.max_characters}`,
    }

    await message?.reply(zap.translateMessage('groupstatus', config))

    return
  }

  await message?.reply(zap.translateMessage('notgrouperror'))
}
