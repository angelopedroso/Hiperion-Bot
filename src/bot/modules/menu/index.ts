import { ZapType } from '@modules/zapConstructor'
import { BOT_NAME } from '@utils/envs'
import i18next from 'i18next'
import { getMenuPage } from './util'

interface MenuItem {
  title: string
  description: string
}

export interface Menu {
  menu: {
    title: string
    items: MenuItem[]
  }[]
}

export async function menuBot({ message, ...zap }: ZapType, page: string) {
  const formattedPageNum = +page
  const menu = (await i18next.getResourceBundle(
    i18next.language,
    'menu',
  )) as Menu
  const isOwner = await zap.IsOwner()

  if (page && !isNaN(formattedPageNum)) {
    if (formattedPageNum > menu.menu.length) {
      message?.reply(
        zap.translateMessage('menu', 'main', {
          botname: BOT_NAME,
        }),
      )

      return
    }

    if (formattedPageNum === 5 && isOwner) {
      const messageFormat = getMenuPage(menu, formattedPageNum)

      message?.reply(messageFormat)

      return
    }

    const messageFormat = getMenuPage(menu, formattedPageNum)

    message?.reply(messageFormat)

    return
  }

  message?.reply(
    zap.translateMessage('menu', 'main', {
      botname: BOT_NAME,
    }),
  )
}
