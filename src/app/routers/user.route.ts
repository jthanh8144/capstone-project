import { Router } from 'express'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { UserController } from '../controllers'
import {
  CheckEmailDto,
  IdDto,
  RemoveUserDto,
  SearchDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from '../dtos'

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
      .get(
        authenticationMiddleware,
        validationMiddleware(SearchDto, 'query'),
        this.userController.getUsers,
      )
      .put(
        authenticationMiddleware,
        validationMiddleware(RemoveUserDto, 'body'),
        this.userController.removeAccount,
      )
    this.router
      .route('/profile')
      .get(authenticationMiddleware, this.userController.userProfile)
      .put(
        authenticationMiddleware,
        validationMiddleware(UpdateUserDto, 'body'),
        this.userController.updateProfile,
      )
    this.router
      .route('/password')
      .put(
        authenticationMiddleware,
        validationMiddleware(UpdatePasswordDto, 'body'),
        this.userController.changePassword,
      )
    this.router
      .route('/friends')
      .get(authenticationMiddleware, this.userController.getFriendsList)
    this.router
      .route('/inactive')
      .get(authenticationMiddleware, this.userController.inactiveAccount)
    this.router
      .route('/active')
      .get(
        validationMiddleware(IdDto, 'query'),
        this.userController.activeAccount,
      )
    this.router
      .route('/check-email')
      .post(
        validationMiddleware(CheckEmailDto, 'body'),
        this.userController.getUserByEmail,
      )
  }
}

export const userRoute = new UserRoute()
