import { getTotalCommandsController } from '@server/modules/log/getTotalCommandsByGroup/getTotalCommandsController'
import { Router } from 'express'
import { getLogsController } from 'server/modules/log/getLogs/logController'

const logRoutes = Router()

logRoutes.get('/', getLogsController)
logRoutes.get('/total-by-group', getTotalCommandsController)

export { logRoutes }
