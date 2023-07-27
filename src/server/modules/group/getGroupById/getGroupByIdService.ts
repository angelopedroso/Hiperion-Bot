import { printError } from '@cli/terminal'
import { client } from '@config/startupConfig'
import { prisma, redis } from '@lib/prisma'
import { ZapConstructor } from '@modules/zapConstructor'
import { CompleteGroup } from '@typings/prismaQueryTypes'

export async function getGroupByIdService(id: string) {
  try {
    const cache = await redis.get('group:' + id)

    if (cache) {
      return JSON.parse(cache) as CompleteGroup
    }

    const groupInfo = await prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        participants: true,
        black_list: true,
        anti_trava: true,
      },
    })

    const groupPics = await ZapConstructor(client).getGroupPictures()

    const formattedGroups = {
      id: groupInfo?.id,
      group_info: groupPics?.find((pic) => pic.groupId === groupInfo?.g_id),
      g_id: groupInfo?.g_id,
      bem_vindo: groupInfo?.bem_vindo,
      anti_link: groupInfo?.anti_link,
      anti_porn: groupInfo?.anti_porn,
      one_group: groupInfo?.one_group,
      auto_sticker: groupInfo?.auto_sticker,
      auto_invite_link: groupInfo?.auto_invite_link,
      anti_trava_id: groupInfo?.anti_trava_id,
      anti_trava: {
        status: groupInfo?.anti_trava?.status,
        max_characters: groupInfo?.anti_trava?.max_characters,
      },
      blackList: groupInfo?.black_list,
      participants: groupInfo?.participants,
    }

    await redis.set(
      'group:' + id,
      JSON.stringify(formattedGroups),
      'EX',
      60 * 5,
    )

    return formattedGroups as CompleteGroup
  } catch (error: Error | any) {
    printError('getGroupById Query: ' + error.message)
  }
}
