import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ILike } from 'typeorm'

import dataSource from '../../shared/configs/data-source.config'
import { FriendRequestRepository, UserRepository } from '../repositories'
import { AuthRequest } from '../typings'
import { User } from '../entities'
import { RemoveUserDto, UpdatePasswordDto, UpdateUserDto } from '../dtos'
import { comparePassword, hashPassword } from '../utils'
import { handleUserConservations } from '../helpers/response.helper'

export class UserController {
  private userRepository: UserRepository
  private friendRequestRepository: FriendRequestRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.friendRequestRepository = new FriendRequestRepository()
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
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { q } = req.query
      const query = `%${q as string}%`
      const users = await this.userRepository.find({
        where: [
          { fullName: ILike(query), isActive: true },
          { email: ILike(query), isActive: true },
        ],
      })
      res.status(StatusCodes.OK).json({ success: true, users })
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
      const friends = await this.friendRequestRepository.getFriendsListOfUser(
        userId,
      )
      res.status(StatusCodes.OK).json({ success: true, friends })
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
      const conservations = await this.userRepository.getConservationsOfUser(
        userId,
      )
      res.status(StatusCodes.OK).json({
        success: true,
        conservations: handleUserConservations(conservations, userId),
      })
    } catch (error) {
      next(error)
    }
  }
}
