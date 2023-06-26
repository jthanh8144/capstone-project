import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { generate } from 'generate-password'

import { GetDeviceIdType, PresignedUrlType } from '../dtos'
import minioClient from '../../shared/configs/minio.config'
import { environment } from '../../shared/constants'
import { DeviceRepository } from '../repositories'

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
      const fileName = `${Date.now()}_${folder}_${generate({
        length: 6,
      })}.${type}`
      const location = `${folder}/${fileName}`
      const presignedUrl = await minioClient.presignedPutObject(
        environment.minio.bucketName,
        location,
        5 * 60,
      )
      res.status(StatusCodes.OK).json({
        presignedUrl: presignedUrl.replace('http', 'https'),
        url: `https://${environment.minio.host}/${environment.minio.bucketName}/${location}`,
      })
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
