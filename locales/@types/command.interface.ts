export type LocaleFileName =
  | 'groupinfo'
  | 'notgroup'
  | 'fs'
  | 'welcome'
  | 'wrongcmd'
  | 'ban'
  | 'acceptInvite'
  | 'td'
  | 'add'
  | 'bl'
  | 'general'
  | 'promote'
  | 'demote'
  | 'dload'

interface LocaleAttributeMap {
  welcome: 'message' | 'onegroup'
  groupinfo: 'info'
  notgroup: 'error'
  fs: 'help' | 'nomedia' | 'madeby'
  wrongcmd: 'wrongcommand'
  ban: 'help'
  acceptInvite: 'error'
  td: 'help'
  add: 'help'
  bl: 'error'
  general: 'botisnotadmin'
  promote: 'help'
  demote: 'help'
  dload: 'error' | 'errorAxios'
}

export type TranslationVariables = Record<
  string,
  string | number | boolean | undefined
>

export type LocaleAttributeName<T extends LocaleFileName> =
  LocaleAttributeMap[T]
