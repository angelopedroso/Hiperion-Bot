import { Request, Response } from 'express'
import { getTotalsService } from './getTotalsService'

export async function getTotalsController(_: Request, res: Response) {
  const allLogs = await getTotalsService()

  return res.status(200).json(allLogs)
}
