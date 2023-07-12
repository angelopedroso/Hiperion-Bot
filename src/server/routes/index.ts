import { Router } from 'express'
import { groupRoutes } from './group.routes'
import { logRoutes } from './log.routes'

const routes = Router()

routes.use('/groups', groupRoutes)
routes.use('/log', logRoutes)

export { routes }
