import { Router } from 'express'
import { groupRoutes } from './group.routes'
import { logRoutes } from './log.routes'
import { userRoutes } from './user.routes'
import { summaryRoutes } from './summary.routes'

const routes = Router()

routes.use('/groups', groupRoutes)
routes.use('/log', logRoutes)
routes.use('/users', userRoutes)
routes.use('/summary', summaryRoutes)

export { routes }
