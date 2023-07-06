import { BOT_NAME } from '@utils/envs'
import { Menu } from '.'

export function getMenuPage({ menu }: Menu, formattedPageNum: number) {
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

  return messageFormat
}
