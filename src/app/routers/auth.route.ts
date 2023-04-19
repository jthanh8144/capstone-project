import { Router } from 'express'
import {
  CreateUserDto,
  LoginDto,
  RefreshTokenDto,
  SendRequestResetPasswordDto,
  ResetPasswordDto,
  VerifyDto,
} from '../dtos'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { AuthController } from '../controllers'

class AuthRoute {
  public path = '/auth'
  public router = Router()

  private authController: AuthController

  constructor() {
    this.authController = new AuthController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/register')
      .post(
        validationMiddleware(CreateUserDto, 'body', true),
        this.authController.register,
      )
    this.router
      .route('/login')
      .post(
        validationMiddleware(LoginDto, 'body', true),
        this.authController.login,
      )
    this.router
      .route('/refresh-token')
      .post(
        validationMiddleware(RefreshTokenDto, 'body', true),
        this.authController.refreshToken,
      )
    this.router
      .route('/logout')
      .post(
        authenticationMiddleware,
        validationMiddleware(RefreshTokenDto, 'body', true),
        this.authController.logout,
      )
    this.router
      .route('/verify')
      .get(
        validationMiddleware(VerifyDto, 'query', true),
        this.authController.verify,
      )
    this.router
      .route('/request-reset-password')
      .post(
        validationMiddleware(SendRequestResetPasswordDto, 'body', true),
        this.authController.sendRequestResetPassword,
      )
    this.router
      .route('/reset-password')
      .post(
        validationMiddleware(ResetPasswordDto, 'body', true),
        this.authController.resetPassword,
      )
  }
}

export const authRoute = new AuthRoute()
