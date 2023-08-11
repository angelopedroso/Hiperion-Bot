import { Request, Response } from 'express'
import { updateBotInfoService } from './updateBotInfoService'
import { BotSettings } from '@prisma/client'

export async function updateBotInfoController(req: Request, res: Response) {
  const data = req.body as BotSettings

  const botInfo = await updateBotInfoService(data)

  return res.status(200).json(botInfo)
}
