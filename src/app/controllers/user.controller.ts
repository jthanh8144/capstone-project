import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { UserRepository } from '../repositories'

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
}
