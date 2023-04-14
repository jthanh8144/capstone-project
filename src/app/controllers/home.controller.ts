import { Request, Response } from 'express'

export class HomeController {
  public home = async (req: Request, res: Response): Promise<void> => {
    res.redirect('/docs')
  }
}
