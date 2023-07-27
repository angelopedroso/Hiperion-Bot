import { client } from '@config/startupConfig'
import { prisma, redis } from '@lib/prisma'
import { ZapConstructor } from '@modules/zapConstructor'
import { CompleteGroup } from '@typings/prismaQueryTypes'
import { AppError } from 'server/errors'

type FormattedResponseBody = CompleteGroup & {
  avatar_image?: string
  group_name?: string
}

export async function updateGroupService({
  id,
  avatar_image: avatarImage,
  group_name: groupName,
  ...group
}: FormattedResponseBody) {
  const existsGroup = await prisma.group.findUnique({
    where: {
      id,
    },
  })

  if (!existsGroup) {
    throw new AppError('Group not found!')
  }

  if (avatarImage) {
    await ZapConstructor(client).updateGroupPicture(avatarImage, group.g_id)
  }

  if (groupName) {
    await ZapConstructor(client).updateGroupSubject(groupName, group.g_id)
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
        update: {
          status: group.antiTrava?.status,
          max_characters: group.antiTrava?.max_characters,
        },
      },
      black_list: {
        connect: group.blackList?.map((user) => ({
          id: user.id,
        })),
      },
    },
  })

  Promise.all([
    redis.del(`group-info:${group.g_id}`),
    redis.del(`group:${id}`),
    redis.del('all-groups'),
  ])

  return groupUpdated
}
