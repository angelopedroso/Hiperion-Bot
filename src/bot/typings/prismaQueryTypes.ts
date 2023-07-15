import {
  AntiTrava,
  Group,
  Participant,
  ParticipantGroupType,
} from '@prisma/client'

export type CompleteGroup = Group & {
  participants: Participant[]
  blackList?: Participant[]
  antiTrava?: AntiTrava
  image_url?: string
  participants_size?: string
}

export type GetAdmin = {
  id: string
  p_id: string
  name: string
  image_url: string | null
  type: ParticipantGroupType[]
}[]

export type addParticipantInGroupProps = {
  userId: string
  pushname: string
  imageUrl: string
}
