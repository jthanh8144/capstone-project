import { Router } from 'express'
import { HomeController } from '../controllers'
import { validationMiddleware, authenticationMiddleware } from '../middlewares'
import { GetDeviceId, PresignedUrlDto } from '../dtos'

class HomeRoute {
  public path = '/'
  public router = Router()

  private homeController: HomeController

  constructor() {
    this.homeController = new HomeController()
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.route('/').get(this.homeController.home)
    this.router
      .route('/presigned-url')
      .get(
        authenticationMiddleware,
        validationMiddleware(PresignedUrlDto, 'query'),
        this.homeController.getPresignedUrl,
      )
    this.router
      .route('/devices')
      .get(
        validationMiddleware(GetDeviceId, 'query'),
        this.homeController.getDeviceId,
      )
  }
}

export const homeRoute = new HomeRoute()
