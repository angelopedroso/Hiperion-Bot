import { getBotController } from '@server/modules/bot/getBot/getBotController'
import { updateBotInfoController } from '@server/modules/bot/updateBotInfo/updateBotInfoController'
import { Router } from 'express'

const botRoutes = Router()

botRoutes.get('/', getBotController)
botRoutes.put('/', updateBotInfoController)

export { botRoutes }
