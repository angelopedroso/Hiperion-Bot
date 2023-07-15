import { ParticipantType } from '@prisma/client'

export interface IParticipant {
  id: string
  p_id: string
  tipo: ParticipantType
  name: string
  imageUrl: string
}
