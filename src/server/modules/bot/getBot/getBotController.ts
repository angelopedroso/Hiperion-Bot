import { db } from '@lib/auth/prisma-query'
import { Request, Response } from 'express'

export async function getBotController(_: Request, res: Response) {
  const botSettings = await db.getBotInfo()

  return res.status(200).json(botSettings)
}
