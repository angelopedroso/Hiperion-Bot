import { getGroupByIdController } from '@server/modules/group/getGroupById/getGroupByIdController'
import { getGroupsController } from '@server/modules/group/getGroups/getGroupController'
import { updateGroupController } from '@server/modules/group/updateGroup/updateGroupController'
import { Router } from 'express'

const groupRoutes = Router()

groupRoutes.get('/', getGroupsController)
groupRoutes.get('/:id', getGroupByIdController)
groupRoutes.put('/:id', updateGroupController)

export { groupRoutes }
