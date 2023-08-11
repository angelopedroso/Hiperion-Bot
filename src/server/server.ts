import express from 'express'
import cors from 'cors'
import { start } from '../bot'

import { existsSync } from 'fs'

import { printHeader } from '@cli/terminal'
import { routes } from './routes'

if (!existsSync('.env')) {
  printHeader()
} else {
  start()
}

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
}

const app = express()

app.use(cors(corsOptions))

app.listen(3333)

app.use(express.json())

app.use(routes)
