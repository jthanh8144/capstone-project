import { Router } from 'express'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { UserController } from '../controllers'
import { CheckEmailDto, IdDto } from '../dtos'

class UserRoute {
  public path = '/users'
  public router = Router()

  private userController: UserController

  constructor() {
    this.userController = new UserController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .get(authenticationMiddleware, this.userController.getUsers)
    this.router
      .route('/profile')
      .get(authenticationMiddleware, this.userController.userProfile)
    this.router
      .route('/inactive')
      .get(authenticationMiddleware, this.userController.inactiveAccount)
    this.router
      .route('/active')
      .get(
        validationMiddleware(IdDto, 'query', true),
        this.userController.activeAccount,
      )
    this.router
      .route('/check-email')
      .post(
        validationMiddleware(CheckEmailDto, 'body', true),
        this.userController.getUserByEmail,
      )
    this.router
      .route('/')
      .delete(authenticationMiddleware, this.userController.removeAccount)
  }
}

export const userRoute = new UserRoute()
