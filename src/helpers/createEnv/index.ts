import { PromptGroupAwaitedReturn, outro } from '@clack/prompts'
import picocolors from 'picocolors'

import { writeFile } from 'fs-extra'
import path from 'path'

type Info = PromptGroupAwaitedReturn<{
  owner: string | symbol
  bot: string | symbol
  lang: string | symbol
}>

export async function createEnvFile(infos: Info) {
  const { owner, bot, lang } = infos

  const env = `
     BOT_NAME=
     OWNER_NUM=${owner}
     BOT_NUM=${bot}
     LANGUAGE=${lang}
     
     # SightEngine - https://dashboard.sightengine.com/login
     API_SIGHTENGINE_USER=
     API_SIGHTENGINE_SECRET=
     
     # OPENAI - https://platform.openai.com
     OPENAI_API_KEY=
     OPENAI_PASSWORD=

     # ACRCLOUD - https://www.acrcloud.com
     ACR_HOST=
     ACR_KEY=
     ACR_SECRET_KEY=
     
     # DATABASE (mysql) Example: "mysql://root:docker@localhost:3306/hiperion"
     DATABASE_URL=

     # REDIS (optional if you use a local redis, you can create a remote redis on https://app.redislabs.com/#/)
     REDIS_URI=
    `

  await writeFile(path.resolve('.env'), env, { encoding: 'utf-8' })

  outro(
    picocolors.bgGreen(
      'Restart the application. Please check the .env file to add the other variables.',
    ),
  )
  process.exit(0)
}
