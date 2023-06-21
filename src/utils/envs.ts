const NOME_BOT = process.env.NOME_BOT || 'Hiperion'
const NUMERO_DONO = process.env.NUMERO_DONO || ''
const NUMERO_BOT = process.env.NUMERO_BOT || ''

const API_SIGHTENGINE_USER = process.env.API_SIGHTENGINE_USER || ''
const API_SIGHTENGINE_SECRET = process.env.API_SIGHTENGINE_SECRET || ''

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
const OPENAI_PASSWORD = process.env.OPENAI_PASSWORD || ''

const DATABASE_URL = process.env.DATABASE_URL || ''

const REDIS_URI = process.env.REDIS_URI || ''

export {
  API_SIGHTENGINE_SECRET,
  API_SIGHTENGINE_USER,
  DATABASE_URL,
  NOME_BOT,
  NUMERO_BOT,
  NUMERO_DONO,
  OPENAI_API_KEY,
  OPENAI_PASSWORD,
  REDIS_URI,
}
