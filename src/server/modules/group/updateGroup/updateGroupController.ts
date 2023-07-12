import { Request, Response } from 'express'
import { updateGroupService } from './updateGroupService'

export async function updateGroupController(req: Request, res: Response) {
  const groupId = req.params.id
  const updatedGroup = req.body

  const groupUpdated = await updateGroupService({
    id: groupId,
    ...updatedGroup,
  })

  return res.status(200).json(groupUpdated)
}
