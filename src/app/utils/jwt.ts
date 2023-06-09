import { sign, verify } from 'jsonwebtoken'
import { environment } from '../../shared/constants'

interface TokenData {
  userId: string
  email: string
}

const { accessTokenSecret, refreshTokenSecret } = environment.jwt

const getToken = (data: TokenData, isRefresh?: boolean) => {
  const secret = isRefresh ? refreshTokenSecret : accessTokenSecret
  const expiresIn = isRefresh
    ? environment.jwt.refreshTokenLife
    : environment.jwt.accessTokenLife

  return sign(data, secret, { expiresIn })
}

const verifyToken = (token: string, isRefresh?: boolean) => {
  const secret = isRefresh ? refreshTokenSecret : accessTokenSecret
  return verify(token, secret)
}

export { getToken, verifyToken }
