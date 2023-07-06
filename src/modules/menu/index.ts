import { ZapType } from '@modules/zapConstructor'
import { BOT_NAME } from '@utils/envs'
import i18next from 'i18next'

interface MenuItem {
  title: string
  description: string
}

interface Menu {
  menu: {
    title: string
    items: MenuItem[]
  }[]
}

export async function menuBot({ message, ...zap }: ZapType, page: string) {
  const formattedPageNum = +page
  const { menu } = (await i18next.getResourceBundle(
    i18next.language,
    'menu',
  )) as Menu

  if (page && !isNaN(formattedPageNum)) {
    if (formattedPageNum > menu.length) {
      message?.reply(
        zap.translateMessage('menu', 'main', {
          botname: BOT_NAME,
        }),
      )
      return
    }

    const pageInfo = menu[formattedPageNum - 1]
    const pageTitle = pageInfo.title
    const pageItems = pageInfo.items

    const messageCmds = pageItems.reduce(
      (acc, cur) => {
        return {
          title: acc.title,
          description:
            (acc.description += `┝ *!${cur.title}* ➝ ${cur.description}\n`),
        }
      },
      {
        title: '',
        description: '',
      },
    )

    const messageFormat = `╭☾ *${pageTitle.toUpperCase()}* ☽\n│\n${
      messageCmds.description
    }│\n╰╼❥ *${BOT_NAME}®*`

    message?.reply(messageFormat)

    return
  }

  message?.reply(
    zap.translateMessage('menu', 'main', {
      botname: BOT_NAME,
    }),
  )
}
