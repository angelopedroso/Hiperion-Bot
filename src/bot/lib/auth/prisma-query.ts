import { prisma, redis } from '@lib/prisma'
import {
  CompleteGroup,
  addParticipantInGroupProps,
} from '@typings/prismaQueryTypes'
import {
  BanLog,
  BotSettings,
  Group,
  Log,
  Participant,
  ParticipantType,
} from '@prisma/client'
import { printError } from '@cli/terminal'
import {
  botInfoCache,
  groupInfoCache,
} from '@typings/cache/groupInfo.interface'
import { ZapConstructor } from '@modules/zapConstructor'
import { client } from '@config/startupConfig'

export function PrismaQuery() {
  return {
    async createGroup(group: Partial<CompleteGroup>) {
      await prisma.group.create({
        data: {
          g_id: group.g_id as string,
          anti_trava: {
            create: {},
          },
          participants: {
            connect: group.participants?.map((participant) => {
              return {
                p_id: participant.p_id,
              }
            }),
          },
        },
      })
    },

    async updateGroupExceptParticipants(
      groupId: string,
      data: Partial<CompleteGroup>,
    ) {
      await prisma.group.update({
        where: {
          g_id: groupId,
        },
        data: {
          ...data,
          participants: {},
        },
      })
    },

    async findGroupById(groupId: string) {
      const group = await prisma.group.findUnique({
        where: {
          g_id: groupId,
        },
      })

      return group
    },

    async deleteGroup(groupId: string) {
      await prisma.$transaction([
        prisma.participantGroupType.deleteMany({
          where: {
            group: {
              g_id: groupId,
            },
          },
        }),
        prisma.group.delete({
          where: {
            g_id: groupId,
          },
        }),
      ])
    },

    async findParticipantsByIds(participantIds: string[]) {
      const participants = await prisma.participant.findMany({
        where: {
          p_id: {
            in: participantIds,
          },
        },
      })

      return participants
    },

    async createParticipant(participant: Participant) {
      await prisma.participant.create({
        data: {
          p_id: participant.p_id,
          name: participant.name,
          image_url: participant.image_url,
        },
      })
    },

    async addParticipantInGroup(
      user: addParticipantInGroupProps,
      groupId: string,
    ) {
      const existsParticipantInGroup = await prisma.participant.findUnique({
        where: {
          p_id: user.userId,
        },
        include: {
          group_participant: true,
          participant_group_type: true,
        },
      })

      const participantType =
        existsParticipantInGroup?.participant_group_type.find(
          (p) => p.participantId === existsParticipantInGroup.id,
        )

      if (
        existsParticipantInGroup &&
        participantType?.tipo === 'membro' &&
        existsParticipantInGroup.group_participant.length > 0
      )
        return 'ban'

      await prisma.group.update({
        where: {
          g_id: groupId,
        },
        data: {
          participants: {
            connectOrCreate: {
              where: {
                p_id: user.userId,
              },
              create: {
                p_id: user.userId,
                name: user.pushname,
                image_url: user.imageUrl,
              },
            },
          },
        },
      })

      const existsGroupType = await prisma.participantGroupType.findFirst({
        where: {
          group: {
            g_id: groupId,
          },
          participant: {
            p_id: user.userId,
          },
        },
      })

      if (!existsGroupType) {
        await this.createParticipantGroupType(groupId, user.userId, 'membro')
      }
    },

    async getParticipantsFromGroup(groupId: string) {
      const existingParticipants = await prisma.group.findUnique({
        where: {
          g_id: groupId,
        },
        select: {
          participants: true,
        },
      })

      return existingParticipants
    },

    async getParticipantsFromGroups(groupIds: string[]) {
      try {
        const participantsInGroups = await prisma.group.findMany({
          where: {
            g_id: {
              in: groupIds,
            },
          },
          include: {
            participants: true,
          },
        })
        const participantsInGroupsFormatted = participantsInGroups.map(
          (group) => ({
            groupId: group.g_id,
            participants: group.participants,
          }),
        )

        return participantsInGroupsFormatted
      } catch (error: Error | any) {
        printError(error)
        return []
      }
    },

    async getParticipantsTypeFromGroups(groupIds: string[]) {
      try {
        const participantsInGroups = await prisma.participantGroupType.findMany(
          {
            where: {
              group: {
                g_id: {
                  in: groupIds,
                },
              },
            },
            include: {
              group: true,
              participant: true,
            },
          },
        )

        const participantsInGroupsFormatted = participantsInGroups.map(
          (group) => ({
            groupId: group.group.g_id,
            participantId: group.participant.p_id,
          }),
        )

        return participantsInGroupsFormatted
      } catch (error: Error | any) {
        printError(error)
        return []
      }
    },

    async getBlackListFromGroups(groupIds: string[]) {
      try {
        const groupBlackList = await prisma.group.findMany({
          where: {
            g_id: {
              in: groupIds,
            },
          },
          select: {
            black_list: true,
            g_id: true,
          },
        })

        const blackListFromGroupsFormatted = groupBlackList.map((group) => ({
          groupId: group.g_id,
          blackList: group.black_list,
        }))

        return blackListFromGroupsFormatted
      } catch (error: Error | any) {
        printError(error)
        return []
      }
    },

    async removeParticipantsFromGroup(participantId: string, groupId: string) {
      const participant = await prisma.participant.findUnique({
        where: {
          p_id: participantId,
        },
        include: {
          group_participant: true,
        },
      })

      if (!participant) return

      const groupsCount = participant.group_participant.length

      if (
        groupsCount === 1 &&
        participant.group_participant[0].g_id === groupId
      ) {
        await prisma.$transaction([
          prisma.participantGroupType.deleteMany({
            where: {
              participant: {
                id: participant.id,
              },
              group: {
                g_id: groupId,
              },
            },
          }),

          prisma.participant.delete({
            where: {
              p_id: participantId,
            },
          }),
        ])
      } else {
        await prisma.participant.update({
          where: {
            p_id: participantId,
          },
          data: {
            group_participant: {
              disconnect: {
                g_id: groupId,
              },
            },
          },
        })
      }
    },

    async deleteParticipant(participantId: string) {
      await prisma.participant.delete({
        where: {
          p_id: participantId,
        },
      })
    },

    async updateGroupOnReady(groupId: string, p: Participant) {
      await prisma.group.update({
        where: { g_id: groupId },
        data: {
          participants: {
            connectOrCreate: {
              where: {
                p_id: p.p_id,
              },
              create: {
                p_id: p.p_id,
                name: p.name,
                image_url: p.image_url,
              },
            },
          },
        },
      })
    },

    createParticipantGroupType(
      groupId: string,
      participantId: string,
      tipo: ParticipantType,
    ) {
      return prisma.participantGroupType.create({
        data: {
          tipo,
          group: {
            connect: {
              g_id: groupId,
            },
          },
          participant: {
            connect: {
              p_id: participantId,
            },
          },
        },
      })
    },

    async getGroupInfo(groupId: string) {
      try {
        const cacheKey = `group-info:${groupId}`
        const cache = await redis.get(cacheKey)

        if (cache) {
          return JSON.parse(cache) as groupInfoCache
        }

        const groupInfo = await prisma.group.findUnique({
          where: { g_id: groupId },
          select: {
            anti_link: true,
            anti_porn: true,
            bem_vindo: true,
            one_group: true,
            auto_invite_link: true,
            auto_sticker: true,
            black_list: true,
            anti_trava: {
              select: {
                status: true,
                max_characters: true,
              },
            },
          },
        })

        await redis.set(cacheKey, JSON.stringify(groupInfo), 'EX', 60 * 10)

        return groupInfo
      } catch (error: Error | any) {
        printError('getGroupInfo Query: ' + error.message)
      }
    },

    async getAllGroups() {
      try {
        const cache = await redis.get('all-groups')

        if (cache) {
          return JSON.parse(cache) as CompleteGroup[]
        }

        const allGroups = await prisma.group.findMany({
          include: {
            participants: true,
            black_list: true,
            anti_trava: true,
          },
        })

        const groupPics = await ZapConstructor(client).getGroupInfo()

        const formattedGroups = allGroups?.map((group) => {
          return {
            id: group.id,
            participants_ids: group.participants_ids,
            black_list_ids: group.black_list_ids,
            name: group.name,
            image_url: group.image_url,
            group_info: groupPics?.find((pic) => pic.groupId === group.g_id),
            g_id: group.g_id,
            bem_vindo: group.bem_vindo,
            anti_link: group.anti_link,
            anti_porn: group.anti_porn,
            one_group: group.one_group,
            auto_sticker: group.auto_sticker,
            auto_invite_link: group.auto_invite_link,
            anti_trava_id: group.anti_trava_id,
            anti_trava: {
              status: group.anti_trava?.status,
              max_characters: group.anti_trava?.max_characters,
            },
            blackList: group.black_list,
            participants: group.participants,
          }
        })

        await redis.set(
          'all-groups',
          JSON.stringify(formattedGroups),
          'EX',
          60 * 5,
        )

        return formattedGroups as CompleteGroup[]
      } catch (error: Error | any) {
        printError('getAllGroups Query: ' + error.message)
      }
    },

    addToBlacklist(
      groupId: string,
      participantId: string,
      allGroups: Group[] | CompleteGroup[] | undefined,
    ) {
      const querys = []
      querys.push(
        prisma.group.update({
          where: { g_id: groupId },
          data: {
            black_list: {
              connect: { p_id: participantId },
            },
          },
        }),
      )

      const otherGroups = allGroups?.filter(
        (otherGroup: any) => otherGroup.g_id !== groupId,
      )
      if (otherGroups) {
        for (const otherGroup of otherGroups) {
          querys.push(
            prisma.group.update({
              where: { g_id: otherGroup.g_id },
              data: {
                black_list: {
                  connect: { p_id: participantId },
                },
              },
            }),
          )
        }
      }

      redis.del('group-info:' + groupId)

      return querys
    },

    async removeFromBlacklist(groupId: string, participantId: string) {
      await prisma.group.update({
        where: {
          g_id: groupId,
        },
        data: {
          black_list: {
            disconnect: {
              p_id: participantId,
            },
          },
        },
      })

      redis.del('group-info:' + groupId)
    },

    removeFromAllBlacklist(
      groupId: string,
      participantId: string,
      allGroups: Group[] | undefined,
    ) {
      const querys = []
      querys.push(
        prisma.group.update({
          where: { g_id: groupId },
          data: {
            black_list: {
              disconnect: { p_id: participantId },
            },
          },
        }),
      )

      const otherGroups = allGroups?.filter(
        (otherGroup: any) => otherGroup.g_id !== groupId,
      )

      if (otherGroups) {
        for (const otherGroup of otherGroups) {
          querys.push(
            prisma.group.update({
              where: { g_id: otherGroup.g_id },
              data: {
                black_list: {
                  disconnect: { p_id: participantId },
                },
              },
            }),
          )
        }
      }

      redis.del('group-info:' + groupId)

      return querys
    },

    async createLog(log: Log) {
      await prisma.log.create({
        data: {
          command: log.command,
          groupId: log.groupId,
          is_group: log.is_group,
          user_name: log.user_name,
          chat_name: log.chat_name,
          date_time: log.date_time,
        },
      })
    },

    async createBanLog(log: BanLog) {
      await prisma.banLog.create({
        data: {
          user_phone: log.user_phone,
          user_name: log.user_name,
          chat_name: log.chat_name,
          date_time: log.date_time,
          image: log.image,
          message: log.message,
          reason: log.reason,
        },
      })
    },

    async updateParticipants(p: Participant) {
      await prisma.participant.updateMany({
        where: {
          AND: [{ p_id: p.p_id }, { NOT: { image_url: p.image_url } }],
        },
        data: {
          name: p.name,
          image_url: p.image_url,
        },
      })
    },

    async getBotInfo() {
      try {
        const cacheKey = 'bot-info'
        const cache = await redis.get(cacheKey)

        if (cache) {
          return JSON.parse(cache) as botInfoCache
        }

        const botInfo = await prisma.botSettings.findFirst({})

        await redis.set(cacheKey, JSON.stringify(botInfo), 'EX', 60 * 15)

        return botInfo
      } catch (error: Error | any) {
        printError('getBotInfo Query: ' + error.message)
      }
    },

    async createBotInfo() {
      try {
        const botInfo = await prisma.botSettings.findFirst({})

        if (botInfo) return

        await prisma.botSettings.create({
          data: {},
        })
      } catch (error: Error | any) {
        printError('updateBotInfo Query: ' + error.message)
      }
    },

    async updateBotInfo({ private: privateChat }: BotSettings) {
      try {
        await prisma.botSettings.updateMany({
          data: {
            private: privateChat,
          },
        })
      } catch (error: Error | any) {
        printError('updateBotInfo Query: ' + error.message)
      }
    },
  }
}

export const db = PrismaQuery()
