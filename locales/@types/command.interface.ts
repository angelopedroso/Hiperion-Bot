export type LocaleFileName =
  | 'groupinfo'
  | 'notgroup'
  | 'fs'
  | 'welcome'
  | 'wrongcmd'

interface LocaleAttributeMap {
  welcome: 'message' | 'onegroup'
  groupinfo: 'info'
  notgroup: 'error'
  fs: 'help' | 'nomedia' | 'madeby'
  wrongcmd: 'wrongcommand'
}

export type TranslationVariables = Record<
  string,
  string | number | boolean | undefined
>

export type LocaleAttributeName<T extends LocaleFileName> =
  LocaleAttributeMap[T]
