import { AntiTrava, Group, Participant } from '@prisma/client'

export type CompleteGroup = Group & {
  participants: Participant[]
  blackList?: Participant[]
  antiTrava?: AntiTrava
}
