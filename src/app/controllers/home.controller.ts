import { NextFunction, Request, Response } from 'express'
import { generate } from 'generate-password'
import { StatusCodes } from 'http-status-codes'

import { GetDeviceIdType, PresignedUrlType } from '../dtos'
import { DeviceRepository } from '../repositories'
import { generatePresignedUrl } from '../utils/functions'

export class HomeController {
  public home = async (req: Request, res: Response): Promise<void> => {
    res.redirect('/docs')
  }

  public getPresignedUrl = async (
    req: Request<any, any, any, PresignedUrlType>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { type, folder } = req.query
      if (!type || !folder) {
        res.json({})
        return
      }
      const fileName = `${Date.now()}_${generate({ length: 8 })}.${type}`
      const location = `${folder}/${fileName}`
      const { presignedUrl, fileUrl } = await generatePresignedUrl(
        location,
        5 * 60,
      )
      res.status(StatusCodes.OK).json({ presignedUrl, url: fileUrl })
    } catch (err) {
      next(err)
    }
  }

  public getDeviceId = async (
    req: Request<any, any, any, GetDeviceIdType>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { deviceId } = req.query
      const deviceRepository = new DeviceRepository()
      const device = await deviceRepository.findOne({ where: { deviceId } })
      if (device) {
        res.status(StatusCodes.OK).json({ success: true, deviceId: device.id })
      } else {
        const newDevice = await deviceRepository.save(
          deviceRepository.create({ deviceId }),
        )
        res
          .status(StatusCodes.OK)
          .json({ success: true, deviceId: newDevice.id })
      }
    } catch (err) {
      next(err)
    }
  }
}
