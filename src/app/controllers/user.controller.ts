import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import dataSource from '../../shared/configs/data-source.config'
import {
  LIMIT_CONSERVATION_SELECTED,
  LIMIT_FRIEND_SELECTED,
  LIMIT_USER_SELECTED,
} from '../../shared/constants'
import {
  FriendRequestRepository,
  SignalStoreRepository,
  UserRepository,
} from '../repositories'
import { AuthRequest } from '../typings'
import { User } from '../entities'
import {
  RemoveUserDto,
  SignalDto,
  UpdateFcmTokenDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from '../dtos'
import { comparePassword, getPageFromQuery, hashPassword } from '../utils'
import {
  handleConservationWith,
  handleSearchUsers,
  handleUserConservations,
} from '../helpers/response.helper'

export class UserController {
  private userRepository: UserRepository
  private friendRequestRepository: FriendRequestRepository
  private signalStoreRepository: SignalStoreRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.friendRequestRepository = new FriendRequestRepository()
    this.signalStoreRepository = new SignalStoreRepository()
  }

  public getUserByEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req.body
      const user = await this.userRepository.getUserByEmail(email)
      res.status(StatusCodes.OK).json({ success: true, isExisted: !!user })
    } catch (error) {
      next(error)
    }
  }

  public getUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { q, page } = req.query
      const query = `%${q as string}%`
      const realPage = getPageFromQuery(page) || 1
      const [users, total] = await this.userRepository.searchUser(
        userId,
        query,
        realPage,
      )
      const totalPage = Math.ceil(total / LIMIT_USER_SELECTED)
      res.status(StatusCodes.OK).json({
        success: true,
        users: handleSearchUsers(users),
        nextPage:
          total === 0 || totalPage === realPage ? undefined : realPage + 1,
        totalPage,
      })
    } catch (error) {
      next(error)
    }
  }

  public userProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const user = await this.userRepository.findOne({
        where: { id: userId },
      })
      res.status(StatusCodes.OK).json({ success: true, user })
    } catch (error) {
      next(error)
    }
  }

  public inactiveAccount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      await this.userRepository.updateUser(userId, { isActive: false })
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Inactive account successfully' })
    } catch (error) {
      next(error)
    }
  }

  public activeAccount = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.query
      await this.userRepository.updateUser(id as string, { isActive: true })
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Active account successfully' })
    } catch (error) {
      next(error)
    }
  }

  public removeAccount = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const queryRunner = dataSource.createQueryRunner()
    try {
      const { userId, email } = req
      const { password }: RemoveUserDto = req.body
      const user = await this.userRepository.getUserIncludePassword(email)
      if (comparePassword(password, user.password)) {
        queryRunner.connect()
        await queryRunner.startTransaction()
        await queryRunner.manager.getRepository(User).delete(userId)
        await queryRunner.commitTransaction()
        res
          .status(StatusCodes.OK)
          .json({ success: true, message: 'Remove account successfully' })
      } else {
        res
          .status(StatusCodes.OK)
          .json({ success: false, message: 'Password is incorrect' })
      }
    } catch (error) {
      await queryRunner.rollbackTransaction()
      next(error)
    }
  }

  public getFriendsList = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { page, name } = req.query
      const realPage = getPageFromQuery(page) || 1
      const { friends, total } =
        await this.friendRequestRepository.getFriendsListOfUser(
          userId,
          realPage,
          typeof name === 'string' ? name : undefined,
        )
      const totalPage = Math.ceil(total / LIMIT_FRIEND_SELECTED)
      res.status(StatusCodes.OK).json({
        success: true,
        friends,
        nextPage:
          total === 0 || totalPage === realPage ? undefined : realPage + 1,
        totalPage,
      })
    } catch (error) {
      next(error)
    }
  }

  public updateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const data: UpdateUserDto = req.body
      await this.userRepository.updateUser(userId, { ...data })
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Update profile success' })
    } catch (error) {
      next(error)
    }
  }

  public changePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email } = req
      const { oldPassword, newPassword }: UpdatePasswordDto = req.body
      const user = await this.userRepository.getUserIncludePassword(email)
      if (comparePassword(oldPassword, user.password)) {
        await this.userRepository.updateUser(user.id, {
          password: hashPassword(newPassword),
        })
        res
          .status(StatusCodes.OK)
          .json({ success: true, message: 'Update password success' })
      } else {
        res
          .status(StatusCodes.OK)
          .json({ success: false, message: 'Old password is incorrect' })
      }
    } catch (error) {
      next(error)
    }
  }

  public getConservationsOfUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { page } = req.query
      const realPage = getPageFromQuery(page) || 1
      const [conservations, total] = await Promise.all([
        this.userRepository.getConservationsOfUser(userId, realPage),
        this.userRepository.countTotalConservationsOfUser(userId),
      ])
      const totalPage = Math.ceil(total / LIMIT_CONSERVATION_SELECTED)
      res.status(StatusCodes.OK).json({
        success: true,
        conservations: handleUserConservations(conservations, userId),
        nextPage:
          total === 0 || totalPage === realPage ? undefined : realPage + 1,
        totalPage,
      })
    } catch (error) {
      next(error)
    }
  }

  public signal = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const data: SignalDto = req.body
      const signalStore = await this.signalStoreRepository.findOne({
        where: { userId },
      })
      if (!signalStore) {
        await this.signalStoreRepository.save(
          this.signalStoreRepository.create({
            userId,
            ...data,
          }),
        )
      } else {
        await this.signalStoreRepository.save(
          this.signalStoreRepository.create({
            id: signalStore.id,
            userId,
            ...data,
          }),
        )
      }
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Create signal key successfully!' })
    } catch (error) {
      next(error)
    }
  }

  public getSignal = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const signalStore = await this.signalStoreRepository.findOne({
        where: { userId },
      })
      res.status(StatusCodes.OK).json(signalStore)
    } catch (error) {
      next(error)
    }
  }

  public getConservationWithUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { partnerId } = req.params
      const conservation = await this.userRepository.getConservationWithUser(
        userId,
        partnerId,
      )
      if (conservation && handleConservationWith(conservation, userId).id) {
        res.status(StatusCodes.OK).json({
          existed: true,
          data: handleConservationWith(conservation, userId),
        })
      } else {
        res.status(StatusCodes.OK).json({ existed: false, data: null })
      }
    } catch (error) {
      next(error)
    }
  }

  public updateFcmToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { fcmToken }: UpdateFcmTokenDto = req.body
      await this.userRepository.updateUser(userId, { fcmToken })
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Update FCM token success' })
    } catch (error) {
      next(error)
    }
  }

  public unfriend = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req
      const { id } = req.params
      await this.friendRequestRepository.unfriend(userId, id)
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Unfriend success!' })
    } catch (error) {
      next(error)
    }
  }
}
