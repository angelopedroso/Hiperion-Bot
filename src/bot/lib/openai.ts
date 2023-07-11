import { OPENAI_API_KEY } from '@utils/envs'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
})

export const openai = new OpenAIApi(configuration)
