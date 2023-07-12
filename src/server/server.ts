import express from 'express'
import { start } from '../bot'

import { existsSync } from 'fs'

import { printHeader } from '@cli/terminal'
import { routes } from './routes'

const app = express()

app.use(express.json())

app.use(routes)

if (!existsSync('.env')) {
  printHeader()
} else {
  start()
}
