import { Request, Response } from 'express'
import { removeParticipantFromGroupService } from './removeParticipantFromGroupService'

export async function removeParticipantFromGroupController(
  req: Request,
  res: Response,
) {
  const body = req.body

  await removeParticipantFromGroupService(body)

  return res.status(200).json('Participants has been removeds!')
}
