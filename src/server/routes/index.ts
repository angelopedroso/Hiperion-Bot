import { Router } from 'express'
import { groupRoutes } from './group.routes'
import { logRoutes } from './log.routes'
import { userRoutes } from './user.routes'
import { summaryRoutes } from './summary.routes'
import { botRoutes } from './bot.routes'

const routes = Router()

routes.use('/groups', groupRoutes)
routes.use('/log', logRoutes)
routes.use('/users', userRoutes)
routes.use('/summary', summaryRoutes)
routes.use('/bot', botRoutes)

export { routes }
