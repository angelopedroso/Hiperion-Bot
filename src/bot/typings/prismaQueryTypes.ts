import { AntiTrava, Group, Participant } from '@prisma/client'

type GroupInfo = {
  groupId: string
  name: string
  image_url: string | undefined
  inviteCode: string
  isAdmin: boolean
}

export type CompleteGroup = Group & {
  participants: Participant[]
  blackList: Participant[]
  antiTrava?: AntiTrava
  group_info?: GroupInfo
}

export type GetAdmin = {
  id: string
  p_id: Promise<string>
  name: string
  image_url: string | null
  groups: Group & { image_url: string; name: string }[]
}[]

export type addParticipantInGroupProps = {
  userId: string
  pushname: string
  imageUrl: string
}
