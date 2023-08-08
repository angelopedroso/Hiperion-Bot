import { BOT_NAME } from '@utils/envs'
import { Menu, MenuItem } from '.'

function getGroupCommands(menuItems: MenuItem[], isAdmin: boolean) {
  const availableCommands = menuItems.filter((item) => {
    const isAdminCommand = item.description.includes('*admin*')

    return isAdmin || !isAdminCommand
  })

  return availableCommands
}

export function getMenuPage(
  { menu }: Menu,
  formattedPageNum: number,
  isAdmin: boolean = false,
) {
  const pageInfo = menu[formattedPageNum - 1]
  const pageTitle = pageInfo.title
  const pageItems = pageInfo.items

  const availableCommands = getGroupCommands(pageItems, isAdmin)

  const messageCmds = availableCommands.reduce(
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
