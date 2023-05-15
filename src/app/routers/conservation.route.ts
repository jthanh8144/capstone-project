import { Router } from 'express'
import { authenticationMiddleware, validationMiddleware } from '../middlewares'
import { ConservationController } from '../controllers'
import { IdDto, NewConservationDto, PageDto, SendMessageDto } from '../dtos'

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
      .route('/')
      .post(
        authenticationMiddleware,
        validationMiddleware(NewConservationDto, 'body'),
        this.conservationController.newChat,
      )
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
    this.router
      .route('/:id/settings')
      .get(
        authenticationMiddleware,
        validationMiddleware(IdDto, 'params'),
        this.conservationController.getConservationSetting,
      )
  }
}

export const conservationRoute = new ConservationRoute()
