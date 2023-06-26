import { Router } from 'express'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { CallController } from '../controllers'
import { CreateCallDto, UpdateCallDto } from '../dtos'

class CallRoute {
  public path = '/call'
  public router = Router()

  private callController: CallController

  constructor() {
    this.callController = new CallController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/')
      .post(
        authenticationMiddleware,
        validationMiddleware(CreateCallDto, 'body'),
        this.callController.create,
      )
      .put(
        authenticationMiddleware,
        validationMiddleware(UpdateCallDto, 'body'),
        this.callController.update,
      )
  }
}

export const callRoute = new CallRoute()
