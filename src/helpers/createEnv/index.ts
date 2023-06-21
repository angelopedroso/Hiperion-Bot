import { PromptGroupAwaitedReturn, outro } from '@clack/prompts'
import picocolors from 'picocolors'

import { writeFile } from 'fs-extra'
import path from 'path'

type Info = PromptGroupAwaitedReturn<{
  owner: string | symbol
  bot: string | symbol
}>

export async function createEnvFile(infos: Info) {
  const { owner, bot } = infos

  const env = `
     NOME_ADMINISTRADOR=${owner}
     NOME_BOT=
     NUMERO_DONO=${bot}
     
     # SightEngine - https://dashboard.sightengine.com/login
     API_SIGHTENGINE_USER=
     API_SIGHTENGINE_SECRET=
     
     # OPENAI - https://platform.openai.com - OFF
     OPENAI_API_KEY=
     OPENAI_PASSWORD=
     
     # DATABASE (mysql) Example: "mysql://root:docker@localhost:3306/hiperion"
     DATABASE_URL=

     # REDIS (optional if you use a local redis)
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
