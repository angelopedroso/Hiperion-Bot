import { getTotalsController } from '@server/modules/summary/getTotals/getTotalsController'
import { Router } from 'express'

const summaryRoutes = Router()

summaryRoutes.get('/', getTotalsController)

export { summaryRoutes }
