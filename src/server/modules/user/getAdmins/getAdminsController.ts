import { Request, Response } from 'express'
import { getAdmins } from './getAdminsService'

export async function getAdminsController(_: Request, res: Response) {
  const allAdmins = await getAdmins()

  return res.status(200).json(allAdmins)
}
