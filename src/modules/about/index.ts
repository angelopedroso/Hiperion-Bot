import { ZapType } from '@modules/zapConstructor'

export async function aboutBot({ message, ...zap }: ZapType) {
  message?.reply(zap.translateMessage('about', 'message'))
}
