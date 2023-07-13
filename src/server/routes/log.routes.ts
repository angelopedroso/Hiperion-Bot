import { Router } from 'express'
import { getLogsController } from 'server/modules/log/getLogs/logController'

const logRoutes = Router()

logRoutes.get('/', getLogsController)

export { logRoutes }
