export type prismaGroup = {
  id: string
  bemvindo: boolean
  linkDetector: boolean
  pornDetector: boolean
  participantes: {
    id: string
    tipo: 'admin' | 'membro'
  }[]
  travaDetector: {
    status: boolean
    maxCharacters: number
  }
  blackList?: {
    participanteId: string
  }[]
}

export type prismaParticipant = {
  id: string
  groupId?: string
  tipo: 'admin' | 'membro'
  isBlackListed?: boolean
}
