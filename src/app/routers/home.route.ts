import { Router } from 'express'
import { HomeController } from '../controllers'
import { validationMiddleware } from '../middlewares'
import { PresignedUrlDto } from '../dtos'

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
        validationMiddleware(PresignedUrlDto, 'query'),
        this.homeController.getPresignedUrl,
      )
  }
}

export const homeRoute = new HomeRoute()
