import { db } from '@lib/auth/prisma-query'
import { Request, Response } from 'express'

export async function getGroupsController(_: Request, res: Response) {
  const allGroups = await db.getAllGroups()

  return res.status(200).json(allGroups)
}
