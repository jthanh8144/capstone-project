import { NextFunction, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { CreateFriendRequestDto, UpdateStatusFriendRequestDto } from '../dtos'
import { FriendRequestRepository } from '../repositories'
import { FriendEnum, LIMIT_USER_SELECTED } from '../../shared/constants'
import { AuthRequest } from '../typings'
import { addEventJob, getPageFromQuery } from '../utils/functions'

export class FriendRequestController {
  private friendRequestRepository: FriendRequestRepository

  constructor() {
    this.friendRequestRepository = new FriendRequestRepository()
  }

  public sendFriendRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { receiverId }: CreateFriendRequestDto = req.body
      const friendRequest = await this.friendRequestRepository.getBy2UserId(
        userId,
        receiverId,
      )
      if (friendRequest) {
        switch (friendRequest.status) {
          case FriendEnum.accepted:
            res
              .status(StatusCodes.OK)
              .json({ success: false, message: 'Both are already friends.' })
            break
          case FriendEnum.pending:
            res.status(StatusCodes.OK).json({
              success: false,
              message: 'The friend request is waiting for response.',
            })
            break
          case FriendEnum.declined:
            await this.friendRequestRepository.updateFriendRequest(
              friendRequest.id,
              { status: FriendEnum.pending },
            )
            res.status(StatusCodes.OK).json({
              success: true,
              message: 'Resend friend request successfully',
            })
            break
        }
      } else {
        await this.friendRequestRepository.save(
          this.friendRequestRepository.create({
            receiverId,
            requesterId: userId,
            status: FriendEnum.pending,
          }),
        )
        res.status(StatusCodes.OK).json({
          success: true,
          message: 'The friend request has sended successfully',
        })
      }
      await addEventJob({
        to: receiverId,
        eventName: 'friendRequest',
        data: { type: 'received' },
      })
    } catch (error) {
      next(error)
    }
  }

  public getSendedFriendRequests = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { page } = req.query
      const realPage = getPageFromQuery(page) || 1
      const [friendRequests, total] =
        await this.friendRequestRepository.getSendedFriendRequest(
          userId,
          realPage,
        )
      const totalPage = Math.ceil(total / LIMIT_USER_SELECTED)
      res.status(StatusCodes.OK).json({
        success: true,
        friendRequests,
        nextPage:
          total === 0 || totalPage === realPage ? undefined : realPage + 1,
        totalPage,
      })
    } catch (error) {
      next(error)
    }
  }

  public getReceivedFriendRequests = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { page } = req.query
      const realPage = getPageFromQuery(page) || 1
      const [friendRequests, total] =
        await this.friendRequestRepository.getReceivedFriendRequest(userId)
      const totalPage = Math.ceil(total / LIMIT_USER_SELECTED)
      res.status(StatusCodes.OK).json({
        success: true,
        friendRequests,
        nextPage:
          total === 0 || totalPage === realPage ? undefined : realPage + 1,
        totalPage,
      })
    } catch (error) {
      next(error)
    }
  }

  public updateReceivedFriendRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { status, id }: UpdateStatusFriendRequestDto = req.body
      const friendRequest = await this.friendRequestRepository.findOne({
        where: { id },
      })
      if (friendRequest) {
        if (friendRequest.receiverId === userId) {
          await this.friendRequestRepository.updateFriendRequest(id, { status })
          await addEventJob({
            to: friendRequest.requesterId,
            eventName: 'friendRequest',
            data: { type: 'requested', status },
          })
          res
            .status(StatusCodes.OK)
            .json({ success: true, message: 'Update status successfully' })
        } else {
          res
            .status(StatusCodes.FORBIDDEN)
            .json({ success: false, message: 'Forbidden' })
        }
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: 'Entity is not existed' })
      }
    } catch (error) {
      next(error)
    }
  }

  public removeSendedFriendRequest = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { id } = req.params
      const friendRequest = await this.friendRequestRepository.findOne({
        where: { id },
      })
      if (friendRequest) {
        if (friendRequest.requesterId === userId) {
          await this.friendRequestRepository.delete(id)
          await addEventJob({
            to: friendRequest.receiverId,
            eventName: 'friendRequest',
            data: { type: 'received' },
          })
          res.status(StatusCodes.OK).json({
            success: true,
            message: 'Delete friend request successfully',
          })
        } else {
          res
            .json(StatusCodes.FORBIDDEN)
            .json({ success: false, message: 'Forbidden' })
        }
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: 'Entity is not existed' })
      }
    } catch (error) {
      next(error)
    }
  }
}
