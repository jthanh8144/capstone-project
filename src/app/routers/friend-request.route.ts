import { Router } from 'express'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { FriendRequestController } from '../controllers'
import {
  CreateFriendRequestDto,
  IdDto,
  PageDto,
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
        validationMiddleware(PageDto, 'query'),
        this.friendRequestController.getSendedFriendRequests,
      )
    this.router
      .route('/received')
      .get(
        authenticationMiddleware,
        validationMiddleware(PageDto, 'query'),
        this.friendRequestController.getReceivedFriendRequests,
      )
    this.router
      .route('/')
      .post(
        authenticationMiddleware,
        validationMiddleware(CreateFriendRequestDto, 'body'),
        this.friendRequestController.sendFriendRequest,
      )
      .put(
        authenticationMiddleware,
        validationMiddleware(UpdateStatusFriendRequestDto, 'body'),
        this.friendRequestController.updateReceivedFriendRequest,
      )
    this.router
      .route('/:id')
      .delete(
        authenticationMiddleware,
        validationMiddleware(IdDto, 'params'),
        this.friendRequestController.removeSendedFriendRequest,
      )
  }
}

export const friendRequestRoute = new FriendRequestRoute()
