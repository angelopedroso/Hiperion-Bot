const BOT_NAME = process.env.BOT_NAME || 'Hiperion'
const OWNER_NUM = process.env.OWNER_NUM || ''
const BOT_NUM = process.env.BOT_NUM || ''
const LANGUAGE = process.env.LANGUAGE || 'pt'

const API_SIGHTENGINE_USER = process.env.API_SIGHTENGINE_USER || ''
const API_SIGHTENGINE_SECRET = process.env.API_SIGHTENGINE_SECRET || ''

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
const OPENAI_PASSWORD = process.env.OPENAI_PASSWORD || ''

const ACR_HOST = process.env.ACR_HOST || ''
const ACR_KEY = process.env.ACR_KEY || ''
const ACR_SECRET_KEY = process.env.ACR_SECRET_KEY || ''

const DATABASE_URL = process.env.DATABASE_URL || ''

const REDIS_URI = process.env.REDIS_URI || ''

const PORT = process.env.PORT || 3001

export {
  API_SIGHTENGINE_SECRET,
  API_SIGHTENGINE_USER,
  DATABASE_URL,
  BOT_NAME,
  BOT_NUM,
  OWNER_NUM,
  LANGUAGE,
  OPENAI_API_KEY,
  OPENAI_PASSWORD,
  ACR_HOST,
  ACR_KEY,
  ACR_SECRET_KEY,
  REDIS_URI,
  PORT,
}
