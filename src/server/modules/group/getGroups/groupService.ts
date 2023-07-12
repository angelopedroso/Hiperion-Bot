import { client } from '@config/startupConfig'
import { prisma } from '@lib/prisma'
import { ZapConstructor } from '@modules/zapConstructor'

export async function getGroups() {
  const allGroups = await prisma.group.findMany({
    include: {
      participants: true,
      black_list: true,
      anti_trava: true,
    },
  })

  const groupPics = await ZapConstructor(client).getGroupPictures()

  return allGroups.map((group) => {
    return {
      id: group.id,
      imageUrl:
        groupPics?.find((pic) => pic.groupId === group.g_id)?.url || null,
      groupId: group.g_id,
      bemVindo: group.bem_vindo,
      antiLink: group.anti_link,
      antiPorn: group.anti_porn,
      oneGroup: group.one_group,
      autoSticker: group.auto_sticker,
      autoInvite: group.auto_invite_link,
      antiTrava: {
        status: group.anti_trava?.status,
        maxCharacters: group.anti_trava?.max_characters,
      },
      blackList: group.black_list,
      participantsSize: group.participants.length,
    }
  })
}
