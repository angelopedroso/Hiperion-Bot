export type LocaleFileName =
  | 'groupinfo'
  | 'notgroup'
  | 'fs'
  | 'welcome'
  | 'wrongcmd'
  | 'acceptInvite'
  | 'bl'
  | 'general'
  | 'dload'
  | 'about'

interface LocaleAttributeMap {
  welcome: 'message' | 'onegroup'
  groupinfo: 'info'
  notgroup: 'error'
  fs: 'help' | 'nomedia' | 'madeby'
  wrongcmd: 'wrongcommand'
  acceptInvite: 'error'
  bl: 'error' | 'errorR'
  general: 'botisnotadmin' | 'onlyowner'
  dload: 'error' | 'errorAxios' | 'errorSize'
  about: 'message'
}

export type TranslationVariables = Record<
  string,
  string | number | boolean | undefined
>

export type LocaleAttributeName<T extends LocaleFileName> =
  LocaleAttributeMap[T]
