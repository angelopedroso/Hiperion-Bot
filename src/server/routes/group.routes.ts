import { Router } from 'express'
import { getGroupsController } from 'server/modules/group/getGroups/groupController'

const groupRoutes = Router()

groupRoutes.get('/', getGroupsController)

export { groupRoutes }
