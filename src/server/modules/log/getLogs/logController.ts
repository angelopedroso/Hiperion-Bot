import { Request, Response } from 'express'
import { getLog } from './logService'

export async function getLogsController(_: Request, res: Response) {
  const allLogs = await getLog()

  return res.status(200).json(allLogs)
}
