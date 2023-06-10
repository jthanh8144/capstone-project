import { Request } from 'express'
import { JwtPayload } from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: string
  email?: string
}

export interface JwtResponse extends JwtPayload {
  email: string
  userId: string
}

export * from './repository'
export * from './worker'
