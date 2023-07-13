import { getGroupsController } from '@server/modules/group/getGroups/getGroupController'
import { updateGroupController } from '@server/modules/group/updateGroup/updateGroupController'
import { Router } from 'express'

const groupRoutes = Router()

groupRoutes.get('/', getGroupsController)
groupRoutes.put('/:id', updateGroupController)

export { groupRoutes }
