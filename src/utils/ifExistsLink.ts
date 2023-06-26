import linkify from 'linkify-it'
import { domains } from './globalVariable'

export const isSocialMediaLink = (text: string) => {
  const linkRecognizer = linkify()
  const matches = linkRecognizer.match(text)

  if (matches && matches.length > 0) {
    const { url } = matches[0]
    return domains.some((domain) => url.includes(domain))
  }
  return false
}
