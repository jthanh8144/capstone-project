import { Router } from 'express'
import { CreateUserDto, LoginDto, RefreshTokenDto, VerifyDto } from '../dtos'
import { validationMiddleware } from '../middlewares'
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
        validationMiddleware(RefreshTokenDto, 'body', true),
        this.authController.logout,
      )
    this.router
      .route('/verify')
      .get(
        validationMiddleware(VerifyDto, 'query', true),
        this.authController.verify,
      )
  }
}

export const authRoute = new AuthRoute()
