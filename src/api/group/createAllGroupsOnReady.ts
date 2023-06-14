// eslint-disable-next-line no-unused-vars
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { printAllGroupsCreated } from 'cli/terminal'
import { PrismaQuery } from 'lib/auth/prisma-query'
import { prisma } from 'lib/prisma'
import { Chat, GroupChat } from 'whatsapp-web.js'

export async function createAllGroupsOnReady(groups: Chat[]) {
  const db = PrismaQuery()

  for (const group of groups) {
    try {
      const chat = group as GroupChat

      const participantIds = chat.participants.map(
        (participant) => participant.id.user,
      )

      const existingParticipants = await prisma.participant.findMany({
        where: {
          id: {
            in: participantIds,
          },
        },
      })

      const existingParticipantsMap = new Map(
        existingParticipants.map((participant) => [
          participant.id,
          participant,
        ]),
      )

      const participantsToCreate = chat.participants.filter(
        (participant) => !existingParticipantsMap.has(participant.id.user),
      )

      await Promise.all(
        participantsToCreate.map(async (participant) => {
          await db.createParticipant({
            id: participant.id.user,
            tipo:
              participant.isAdmin || participant.isSuperAdmin
                ? 'admin'
                : 'membro',
          })
        }),
      )

      const existingGroup = await db.findGroupById(chat.id._serialized)

      const participants = chat.participants.map((participant) => ({
        id: participant.id.user,
        tipo:
          participant.isAdmin || participant.isSuperAdmin
            ? 'admin'
            : ('membro' as 'admin' | 'membro'),
      }))

      if (existingGroup) {
        await db.updateGroup(chat.id._serialized, {
          participantes: participants,
        })
      } else {
        await db.createGroup({
          id: chat.id._serialized,
          participantes: participants,
          bemvindo: false,
          linkDetector: false,
          pornDetector: false,
          travaDetector: { status: false, maxCharacters: 0 },
          blackList: [],
        })
      }
    } catch (error: PrismaClientKnownRequestError | any) {
      if (error.code === 'P2002') {
        console.log('Erro grupo já existe: ' + error.message)
      } else {
        console.log('Erro: ' + error.message)
      }
    }
  }

  return printAllGroupsCreated()
}

// import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
// import { printAllGroupsCreated } from 'cli/terminal'
// import { PrismaQuery } from 'lib/auth/prisma-query'
// import { prisma } from 'lib/prisma'
// import { Chat, GroupChat } from 'whatsapp-web.js'

// export async function createAllGroupsOnReady(groups: Chat[]) {
//   const db = PrismaQuery()

//   for (const group of groups) {
//     try {
//       const chat = group as GroupChat

//       const existingGroup = await db.findGroupById(chat.id._serialized)

//       for (const participant of chat.participants) {
//         const existingParticipant = await prisma.participant.findUnique({
//           where: {
//             id: participant.id.user,
//           },
//         })

//         if (!existingParticipant) {
//           await db.createParticipant({
//             id: participant.id.user,
//             tipo:
//               participant.isAdmin || participant.isSuperAdmin
//                 ? 'admin'
//                 : 'membro',
//           })
//         }
//       }

//       if (!existingGroup) {
//         const participants = chat.participants

//         await db.createGroup({
//           id: group.id._serialized,
//           participantes: participants.map((participant) => ({
//             id: participant.id.user,
//             tipo:
//               participant.isAdmin || participant.isSuperAdmin
//                 ? 'admin'
//                 : 'membro',
//           })),
//           bemvindo: false,
//           linkDetector: false,
//           pornDetector: false,
//           travaDetector: { status: false, maxCharacters: 0 },
//           blackList: [],
//         })
//       }
//     } catch (error: PrismaClientKnownRequestError | any) {
//       if (error.code === 'P2002') {
//         console.log('Erro grupo já existe: ' + error.message)
//       } else {
//         console.log('Erro: ' + error.message)
//       }
//     }
//   }

//   return printAllGroupsCreated()
// }
