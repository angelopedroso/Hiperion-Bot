import { Request, Response } from 'express'
import { getUsers } from './getUsersService'

export async function getUsersController(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1
  const size = parseInt(req.query.size as string) || 20

  const allUsers = await getUsers(page, size)

  return res.status(200).json(allUsers)
}
