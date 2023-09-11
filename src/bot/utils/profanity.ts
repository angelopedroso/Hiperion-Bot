import Profanity from 'profanity-js'
import { LANGUAGE } from './envs'

export function isProfane(message: string | undefined) {
  const profanity = new Profanity('', {
    language: LANGUAGE === 'en' ? 'en-us' : 'pt-br',
  })

  if (!message) return false

  return profanity.isProfane(message)
}
