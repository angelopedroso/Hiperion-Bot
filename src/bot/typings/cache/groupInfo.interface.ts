import { Participant } from '@prisma/client'

export type groupInfoCache = {
  g_id?: string
  bem_vindo: boolean | null
  one_group: boolean | null
  auto_invite_link: boolean | null
  auto_sticker: boolean | null
  anti_link: boolean | null
  anti_porn: boolean | null
  anti_profane: boolean | null
  black_list: Participant[]
  anti_trava: {
    status: boolean | null
    max_characters: number | null
  } | null
}

export type botInfoCache = {
  id: string
  private: boolean | null
}
