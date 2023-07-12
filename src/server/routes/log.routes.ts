import { Router } from 'express'
import { getLogsController } from 'server/modules/log/logController'

const logRoutes = Router()

logRoutes.get('/', getLogsController)

export { logRoutes }
