import { getAdminsController } from '@server/modules/user/getAdmins/getAdminsController'
import { getUsersController } from '@server/modules/user/getUsers/getUsers/getUsersController'
import { Router } from 'express'

const userRoutes = Router()

userRoutes.get('/', getUsersController)
userRoutes.get('/admin', getAdminsController)

export { userRoutes }
