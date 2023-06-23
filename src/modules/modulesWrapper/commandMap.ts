import { sendPing } from '@modules/ping'
import { sendSticker } from '@modules/sticker'
import { ZapType } from '@modules/zapConstructor'

interface CommandInfo {
  handler: (zap: ZapType, args: string[]) => void
  expectedArgs: number
}

const commandMap = new Map<string, CommandInfo>()

commandMap.set('fs', { handler: sendSticker, expectedArgs: 0 })
commandMap.set('ping', { handler: sendPing, expectedArgs: 0 })

export { commandMap }
