import { Participant } from '@prisma/client'

export type groupInfoCache = {
  bem_vindo: boolean | null
  one_group: boolean | null
  auto_invite_link: boolean | null
  auto_sticker: boolean | null
  anti_link: boolean | null
  anti_porn: boolean | null
  black_list: Participant[]
  anti_trava: {
    status: boolean | null
    max_characters: number | null
  } | null
}
