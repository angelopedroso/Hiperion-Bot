import { db } from '@lib/auth/prisma-query'
import { GroupChat } from 'whatsapp-web.js'

export async function checkBlackListOnInit(groups: GroupChat[]) {
  const groupIds = groups.map((g) => g.id._serialized)

  const groupsBlackList = await db.getBlackListFromGroups(groupIds)

  for (const group of groups) {
    const groupId = group.id._serialized
    const participants = group.participants.map((p) => p.id.user)

    const groupBlackList = groupsBlackList.find(
      (g) => g.groupId === groupId,
    )?.blackList

    const blackList = groupBlackList
      ?.map((p) => p.p_id)
      .filter((p) => {
        return participants.includes(p)
      })

    if (blackList && blackList?.length > 0) {
      group.removeParticipants(blackList)
    }
  }
}
