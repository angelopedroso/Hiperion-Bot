import { AntiTrava, Group, Participant } from '@prisma/client'

export type CompleteGroup = Group & {
  participants: Participant[]
  blackList: Participant[]
  antiTrava?: AntiTrava
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
