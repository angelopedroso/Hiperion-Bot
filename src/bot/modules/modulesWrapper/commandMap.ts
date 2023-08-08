import { aboutBot } from '@modules/about'
import { addUser, banUser, demoteUser, promoteUser } from '@modules/admin'
import { toggleWelcome } from '@modules/bemVindo/command'
import {
  addUserInBlackList,
  removeUserFromAllBlackList,
  removeUserFromBlackList,
} from '@modules/blacklist'
import { togglePrivateMode } from '@modules/bot'
import { clearAllChats } from '@modules/clearChats'
import { mediaDownloader } from '@modules/downloader'
import { sendGroupInviteLink } from '@modules/groupInvite'
import { toggleAutoInvite } from '@modules/groupInvite/commands'
import { joinNewGroup } from '@modules/groupJoin/commands'
import { sendGroupStatus } from '@modules/groupStatus'
import { leaveGroup } from '@modules/leave'
import { toggleLinkDetector } from '@modules/linkDetector/command'
import { toggleMaliciousDetector } from '@modules/maliciousDetector/commands'
import { menuBot } from '@modules/menu'
import { recognizeMusic } from '@modules/musicRecognition'
import { toggleOneGroup } from '@modules/oneGroup'
import { sendPing } from '@modules/ping'
import { sendRules } from '@modules/rules'
import { shutDownBot } from '@modules/shutdown'
import { sendSticker } from '@modules/sticker'
import { toggleAutoSticker } from '@modules/sticker/command'
import { transcriptionAudio } from '@modules/transcription'
import { toggleTravaDetector } from '@modules/travaDetector/command'
import { ZapType } from '@modules/zapConstructor'

interface CommandInfo {
  handler: (zap: ZapType, ...args: string[]) => Promise<void> | void
  expectedArgs: number | 'any'
  fullArg?: boolean
}

const commandMap = new Map<string, CommandInfo>()

commandMap.set('menu', { handler: menuBot, expectedArgs: 'any' })
commandMap.set('fs', { handler: sendSticker, expectedArgs: 0 })
commandMap.set('off', { handler: shutDownBot, expectedArgs: 0 })
commandMap.set('link', { handler: sendGroupInviteLink, expectedArgs: 0 })
commandMap.set('ping', { handler: sendPing, expectedArgs: 0 })
commandMap.set('regras', { handler: sendRules, expectedArgs: 0 })
commandMap.set('add', { handler: addUser, expectedArgs: 'any', fullArg: true })
commandMap.set('promote', { handler: promoteUser, expectedArgs: 'any' })
commandMap.set('demote', { handler: demoteUser, expectedArgs: 'any' })
commandMap.set('ban', { handler: banUser, expectedArgs: 'any' })
commandMap.set('join', { handler: joinNewGroup, expectedArgs: 1 })
commandMap.set('leave', { handler: leaveGroup, expectedArgs: 0 })
commandMap.set('ld', { handler: toggleLinkDetector, expectedArgs: 0 })
commandMap.set('md', { handler: toggleMaliciousDetector, expectedArgs: 0 })
commandMap.set('og', { handler: toggleOneGroup, expectedArgs: 0 })
commandMap.set('td', { handler: toggleTravaDetector, expectedArgs: 'any' })
commandMap.set('bl', {
  handler: addUserInBlackList,
  expectedArgs: 'any',
  fullArg: true,
})
commandMap.set('rbl', {
  handler: removeUserFromBlackList,
  expectedArgs: 'any',
  fullArg: true,
})
commandMap.set('rblall', {
  handler: removeUserFromAllBlackList,
  expectedArgs: 'any',
  fullArg: true,
})
commandMap.set('bv', { handler: toggleWelcome, expectedArgs: 0 })
commandMap.set('asticker', { handler: toggleAutoSticker, expectedArgs: 0 })
commandMap.set('ainvite', { handler: toggleAutoInvite, expectedArgs: 0 })
commandMap.set('ginfo', { handler: sendGroupStatus, expectedArgs: 0 })
commandMap.set('about', { handler: aboutBot, expectedArgs: 0 })
commandMap.set('dload', {
  handler: mediaDownloader,
  expectedArgs: 'any',
  fullArg: true,
})
commandMap.set('totext', { handler: transcriptionAudio, expectedArgs: 0 })
commandMap.set('clearchats', { handler: clearAllChats, expectedArgs: 0 })
commandMap.set('recognize', { handler: recognizeMusic, expectedArgs: 0 })
commandMap.set('pv', { handler: togglePrivateMode, expectedArgs: 0 })

export { commandMap }
