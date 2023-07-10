export type LocaleFileName =
  | 'groupinfo'
  | 'notgroup'
  | 'fs'
  | 'welcome'
  | 'wrongcmd'
  | 'acceptInvite'
  | 'bl'
  | 'add'
  | 'general'
  | 'dload'
  | 'about'
  | 'recognize'
  | 'menu'

interface LocaleAttributeMap {
  welcome: 'message' | 'onegroup'
  groupinfo: 'info'
  notgroup: 'error'
  fs: 'help' | 'nomedia' | 'madeby'
  wrongcmd: 'wrongcommand'
  acceptInvite: 'error'
  bl: 'error' | 'errorR'
  add: 'message'
  general: 'botisnotadmin' | 'onlyowner'
  dload: 'error' | 'errorAxios' | 'errorSize'
  about: 'message'
  recognize: 'message'
  menu: 'main'
}

export type TranslationVariables = Record<
  string,
  string | number | boolean | undefined
>

export type LocaleAttributeName<T extends LocaleFileName> =
  LocaleAttributeMap[T]
