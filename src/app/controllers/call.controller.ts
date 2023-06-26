import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { CreateCallDto, UpdateCallDto } from './../dtos'
import { CallType } from '../../shared/constants'
import { UserRepository } from '../repositories'
import { pushNotification } from '../utils'
import { AuthRequest } from '../typings'

export class CallController {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public create = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { receiverId, meetingId, callerName }: CreateCallDto = req.body
      const { fcmToken } = await this.userRepository.findOne({
        where: { id: receiverId },
      })
      if (fcmToken) {
        await pushNotification([fcmToken], {
          data: {
            callerId: userId,
            callerName,
            meetingId,
            type: CallType.CALL_INITIATED,
          },
          android: {
            priority: 'high',
          },
        })
        res
          .status(StatusCodes.OK)
          .json({ success: true, message: 'Create call successfully!' })
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: `The user hasn't FCM token!` })
      }
    } catch (error) {
      next(error)
    }
  }

  public update = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId, type, meetingId, callerName }: UpdateCallDto = req.body
      const { fcmToken } = await this.userRepository.findOne({
        where: { id: userId },
      })
      if (fcmToken) {
        const data = {
          type,
          meetingId,
          callerName,
        }
        await pushNotification([fcmToken], {
          data: JSON.parse(JSON.stringify(data)),
          apns: {
            headers: {
              'apns-priority': '10',
            },
            payload: {
              aps: {
                badge: 1,
              },
            },
          },
        })
      }
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Update call successfully!' })
    } catch (error) {
      next(error)
    }
  }
}
