import { Router } from 'express'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { ConservationController } from '../controllers'
import { IdDto, PageDto, SendMessageDto } from '../dtos'

class ConservationRoute {
  public path = '/conservations'
  public router = Router()

  private conservationController: ConservationController

  constructor() {
    this.conservationController = new ConservationController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route('/:id')
      .get(
        authenticationMiddleware,
        validationMiddleware(IdDto, 'params'),
        validationMiddleware(PageDto, 'query'),
        this.conservationController.getMessagesOfConservation,
      )
      .post(
        authenticationMiddleware,
        validationMiddleware(IdDto, 'params'),
        validationMiddleware(SendMessageDto, 'body'),
        this.conservationController.sendChat,
      )
  }
}

export const conservationRoute = new ConservationRoute()
