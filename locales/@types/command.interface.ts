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

interface LocaleAttributeMap {
  welcome: 'message' | 'onegroup'
  groupinfo: 'info'
  notgroup: 'error'
  fs: 'help' | 'nomedia' | 'madeby'
  wrongcmd: 'wrongcommand'
  acceptInvite: 'error'
  bl: 'error'
  general: 'botisnotadmin'
  dload: 'error' | 'errorAxios' | 'errorSize'
}

export type TranslationVariables = Record<
  string,
  string | number | boolean | undefined
>

export type LocaleAttributeName<T extends LocaleFileName> =
  LocaleAttributeMap[T]
