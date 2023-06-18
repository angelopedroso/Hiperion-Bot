import { Participant } from '@prisma/client'

export type groupInfoCache = {
  bem_vindo: boolean | null
  anti_link: boolean | null
  anti_porn: boolean | null
  black_list: Participant[]
  anti_trava: {
    status: boolean | null
    max_characters: number | null
  } | null
}
