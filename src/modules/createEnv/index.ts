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
     
     # SightEngine
     API_SIGHTENGINE_USER=
     API_SIGHTENGINE_SECRET=
     
     # OPENAI
     OPENAI_API_KEY=
     OPENAI_PASSWORD=
     
     # DATABASE
     DATABASE_URL=
    `

  await writeFile(path.resolve('.env'), env, { encoding: 'utf-8' })

  outro(
    picocolors.bgGreen(
      'Restart the application. Please check the .env file to add the other variables.',
    ),
  )
  process.exit(0)
}
