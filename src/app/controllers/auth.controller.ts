import { StatusCodes } from 'http-status-codes'
import { NextFunction, Request, Response } from 'express'
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'

import { CreateUserDto, LoginDto, RefreshTokenDto } from '../dtos'
import {
  UserRepository,
  UserTokenRepository,
  VerifyRequestRepository,
} from '../repositories'
import {
  comparePassword,
  hashPassword,
  getToken,
  verifyToken,
  addDays,
} from '../utils'
import { JwtResponse } from '../typings'
import { VerifyRequestStatusEnum } from '../../shared/constants'

export class AuthController {
  private userRepository: UserRepository
  private userTokenRepository: UserTokenRepository
  private verifyRequestRepository: VerifyRequestRepository

  constructor() {
    this.userRepository = new UserRepository()
    this.userTokenRepository = new UserTokenRepository()
    this.verifyRequestRepository = new VerifyRequestRepository()
  }

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body
      const user = await this.userRepository.getUserByEmail(userData.email)
      if (user) {
        res
          .status(StatusCodes.CONFLICT)
          .json({ success: false, message: 'Email is existed' })
      } else {
        userData.password = hashPassword(userData.password)
        const savedUser = await this.userRepository.createUser(userData)
        await this.verifyRequestRepository.save(
          this.verifyRequestRepository.create({
            user: savedUser,
            status: VerifyRequestStatusEnum.pending,
            expiredTime: addDays(new Date(), 1),
          }),
        )
        res.status(StatusCodes.OK).json({
          success: true,
          message:
            'Create user successfully, please check your email to verify your account.',
        })
      }
    } catch (error) {
      next(error)
    }
  }

  public verify = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.query
      const verifyRequest = await this.verifyRequestRepository.findOne({
        where: { id: id as string },
      })
      let message = 'Email verify request is invalid'
      let success = false
      if (
        verifyRequest &&
        verifyRequest.status === VerifyRequestStatusEnum.pending
      ) {
        if (verifyRequest.expiredTime >= new Date()) {
          verifyRequest.status = VerifyRequestStatusEnum.done
          message = 'Email verify successfully'
          success = true
          await this.userRepository.updateUser(verifyRequest.userId, {
            isVerified: true,
          })
        } else {
          verifyRequest.status = VerifyRequestStatusEnum.expired
          message = 'Email verify request is expired'
        }
        await this.verifyRequestRepository.save(verifyRequest)
        res.status(StatusCodes.OK).json({ success, message })
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ success, message })
      }
    } catch (error) {
      next(error)
    }
  }

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password }: LoginDto = req.body
      const user = await this.userRepository.findOne({
        where: { email },
      })
      if (user && comparePassword(password, user.password)) {
        const data = {
          userId: user.id,
          email,
        }
        const refreshToken = getToken(data, true)
        await this.userTokenRepository.save(
          this.userTokenRepository.create({ token: refreshToken, user }),
        )
        res.status(StatusCodes.OK).json({
          userId: user.id,
          email,
          accessToken: getToken(data),
          refreshToken,
        })
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Username or password is incorrect!' })
      }
    } catch (error) {
      next(error)
    }
  }

  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken }: RefreshTokenDto = req.body
      const { email, userId } = verifyToken(refreshToken, true) as JwtResponse
      const accessToken = getToken({ email, userId })
      res.status(StatusCodes.OK).json({ success: true, accessToken })
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ success: false, message: error.message })
      } else {
        next(error)
      }
    }
  }

  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { refreshToken }: RefreshTokenDto = req.body
      const token = await this.userTokenRepository.findOne({
        where: { token: refreshToken },
      })
      if (token) {
        await this.userTokenRepository.remove(token)
      }
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: 'Logout successfully' })
    } catch (error) {
      next(error)
    }
  }
}
