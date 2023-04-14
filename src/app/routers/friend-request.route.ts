import { Router } from 'express'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { FriendRequestController } from '../controllers'
import {
  CreateFriendRequestDto,
  IdDto,
  UpdateStatusFriendRequestDto,
} from '../dtos'

class FriendRequestRoute {
  public path = '/friend-requests'
  public router = Router()

  private friendRequestController: FriendRequestController

  constructor() {
    this.friendRequestController = new FriendRequestController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/sended')
      .get(
        authenticationMiddleware,
        this.friendRequestController.getSendedFriendRequests,
      )
    this.router
      .route('/received')
      .get(
        authenticationMiddleware,
        this.friendRequestController.getReceivedFriendRequests,
      )
    this.router
      .route('/')
      .post(
        authenticationMiddleware,
        validationMiddleware(CreateFriendRequestDto, 'body', true),
        this.friendRequestController.sendFriendRequest,
      )
    this.router
      .route('/')
      .put(
        authenticationMiddleware,
        validationMiddleware(UpdateStatusFriendRequestDto, 'body', true),
        this.friendRequestController.updateReceivedFriendRequest,
      )
    this.router
      .route('/:id')
      .delete(
        authenticationMiddleware,
        validationMiddleware(IdDto, 'params', true),
        this.friendRequestController.removeSendedFriendRequest,
      )
  }
}

export const friendRequestRoute = new FriendRequestRoute()
