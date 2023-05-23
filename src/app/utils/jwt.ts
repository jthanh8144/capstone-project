import { sign, verify } from 'jsonwebtoken'

interface TokenData {
  userId: string
  email: string
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || ''
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || ''

const getToken = (data: TokenData, isRefresh?: boolean) => {
  const secret = isRefresh ? refreshTokenSecret : accessTokenSecret
  const expiresIn = isRefresh
    ? process.env.REFRESH_TOKEN_LIFE || '7d'
    : process.env.ACCESS_TOKEN_LIFE || '1h'

  return sign(data, secret, { expiresIn })
}

const verifyToken = (token: string, isRefresh?: boolean) => {
  const secret = isRefresh ? refreshTokenSecret : accessTokenSecret
  return verify(token, secret)
}

export { getToken, verifyToken }
