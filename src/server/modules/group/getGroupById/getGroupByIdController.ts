import { Request, Response } from 'express'
import { getGroupByIdService } from './getGroupByIdService'

export async function getGroupByIdController(req: Request, res: Response) {
  const { id } = req.params

  const groupData = await getGroupByIdService(id)

  return res.status(201).json(groupData)
}
