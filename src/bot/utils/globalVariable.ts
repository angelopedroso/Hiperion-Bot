import path from 'path'
import { getRandomName } from './generateRandomName'

const domains = [
  'it.pinterest.com',
  'pin.it',
  'br.pinterest.com',
  'pinterest.pt',
  'pinterest.br',
  'tiktok.com',
  'vm.tiktok.com',
  'm.tiktok.com',
  'instagram.com',
  'facebook.com',
  'mbasic.facebook.com',
  'm.facebook.com',
  'm.facebook.me',
  'fb.com',
  'fb.watch',
  'twitter.com',
  't.twitter.com',
  't.co',
  'twitter.co',
  'x.com',
  'chat.whatsapp.com',
  'wa.me',
  'youtube.com',
  'youtu.be',
  'reddit.com',
  'soundcloud.com',
] // You can add or remove url to link detector

const isUrl =
  /(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/im

function localPath(type: 'audio' | 'img', format: string) {
  const mainPath = path.resolve(path.dirname(require.main?.filename + ''), '..') // build

  return path.resolve(
    `${mainPath}/assets/${type}/tmp/${getRandomName(`.${format}`)}`,
  )
}

export { domains, isUrl, localPath }
