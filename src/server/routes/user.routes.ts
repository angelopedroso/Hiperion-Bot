import { getAdminsController } from '@server/modules/user/getAdmins/getAdminsController'
import { getUsersController } from '@server/modules/user/getUsers/getUsers/getUsersController'
import { removeParticipantFromGroupController } from '@server/modules/user/removeParticipantFromGroup/removeParticipantFromGroupController'
import { Router } from 'express'

const userRoutes = Router()

userRoutes.get('/', getUsersController)
userRoutes.get('/admin', getAdminsController)
userRoutes.get('/remove-participants', removeParticipantFromGroupController)

export { userRoutes }
