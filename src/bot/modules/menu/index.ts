import { ZapType } from '@modules/zapConstructor'
import { BOT_NAME } from '@utils/envs'
import i18next from 'i18next'
import { getMenuPage } from './util'

export interface MenuItem {
  title: string
  description: string
}

export interface Menu {
  desc: string
  menu: {
    title: string
    items: MenuItem[]
  }[]
}

export async function menuBot({ message, ...zap }: ZapType, page: string) {
  let isAdmin = false
  const formattedPageNum = +page
  const menu = (await i18next.getResourceBundle(
    i18next.language,
    'menu',
  )) as Menu
  const maxMenuPages = menu.menu.length

  const { isGroup } = await zap.getChat()

  const isOwner = await zap.IsOwner()

  if (page && !isNaN(formattedPageNum)) {
    if (formattedPageNum > maxMenuPages) {
      message?.reply(
        zap.translateMessage('menu', 'main', {
          botname: BOT_NAME,
        }),
      )

      return
    }

    if (formattedPageNum === 5) {
      if (isOwner) {
        const menuPageMessage = getMenuPage(menu, formattedPageNum)

        message?.reply(menuPageMessage)

        return
      }

      message?.reply(
        zap.translateMessage('menu', 'main', {
          botname: BOT_NAME,
        }),
      )

      return
    }

    if (formattedPageNum === 2 && !isGroup) {
      await message?.reply(zap.translateMessage('notgroup', 'error'))
      return
    }

    if (isGroup) {
      isAdmin = await zap.getUserIsAdmin(message?.author || message!.from)
    }

    const menuPageMessage = getMenuPage(menu, formattedPageNum, isAdmin)

    message?.reply(menuPageMessage)

    return
  }

  message?.reply(
    zap.translateMessage('menu', 'main', {
      botname: BOT_NAME,
    }),
  )
}
