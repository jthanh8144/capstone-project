import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ILike } from 'typeorm'

import { UserRepository } from '../repositories'
import { AuthRequest } from '../typings'

export class UserController {
  private userRepository: UserRepository
  constructor() {
    this.userRepository = new UserRepository()
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
    try {
      const { userId } = req
      await this.userRepository.delete(userId)
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Remove account successfully' })
    } catch (error) {
      next(error)
    }
  }
}
