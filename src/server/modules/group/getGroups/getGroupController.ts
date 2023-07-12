import { Request, Response } from 'express'
import { getGroups } from './getGroupService'

export async function getGroupsController(_: Request, res: Response) {
  const allGroups = await getGroups()

  return res.status(200).json(allGroups)
}
