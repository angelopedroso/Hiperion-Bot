import { Request, Response } from 'express'
import { getTotalCommandsService } from './getTotalCommandsService'

export async function getTotalCommandsController(_: Request, res: Response) {
  const allLogs = await getTotalCommandsService()

  return res.status(200).json(allLogs)
}
