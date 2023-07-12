import { prisma } from '@lib/prisma'
import { CompleteGroup } from '@typings/prismaQueryTypes'
import { AppError } from 'server/errors'

export async function updateGroupService({ id, ...group }: CompleteGroup) {
  const existsGroup = await prisma.group.findUnique({
    where: {
      id,
    },
  })

  if (!existsGroup) {
    throw new AppError('Group not found!')
  }

  const groupUpdated = await prisma.group.update({
    where: {
      id,
    },
    data: {
      bem_vindo: group.bem_vindo,
      anti_link: group.anti_link,
      anti_porn: group.anti_porn,
      one_group: group.one_group,
      auto_sticker: group.auto_sticker,
      auto_invite_link: group.auto_invite_link,
      anti_trava: {
        upsert: {
          create: {
            status: group.antiTrava?.status,
            max_characters: group.antiTrava?.max_characters,
          },
          update: {
            status: group.antiTrava?.status,
            max_characters: group.antiTrava?.max_characters,
          },
        },
      },
      black_list: {
        set: group.blackList,
      },
    },
  })

  return groupUpdated
}
