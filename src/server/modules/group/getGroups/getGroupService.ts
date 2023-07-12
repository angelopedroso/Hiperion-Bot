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
      image_url:
        groupPics?.find((pic) => pic.groupId === group.g_id)?.url || null,
      g_id: group.g_id,
      bem_vindo: group.bem_vindo,
      anti_link: group.anti_link,
      anti_porn: group.anti_porn,
      one_group: group.one_group,
      auto_sticker: group.auto_sticker,
      auto_invite_link: group.auto_invite_link,
      anti_trava: {
        status: group.anti_trava?.status,
        max_characters: group.anti_trava?.max_characters,
      },
      black_list: group.black_list,
      participants_size: group.participants.length,
    }
  })
}
