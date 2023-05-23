import { StatusCodes } from 'http-status-codes'
import { Response, NextFunction } from 'express'
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'

import { verifyToken } from '../utils'
import { AuthRequest, JwtResponse } from '../typings'

const authenticationMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers['authorization']
      ? req.headers['authorization'].split(' ')[1]
      : ''
    if (token) {
      const { userId, email } = verifyToken(token) as JwtResponse
      req.userId = userId
      req.email = email
      next()
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Authentication token is required' })
    }
  } catch (error) {
    if (
      error instanceof TokenExpiredError ||
      error instanceof JsonWebTokenError
    ) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: error.message })
    } else {
      next(error)
    }
  }
}

export { authenticationMiddleware }
