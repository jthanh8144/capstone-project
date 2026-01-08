import { IsEmail, IsString, MinLength, Matches } from 'class-validator'
import { passwordRegex } from '../utils/constants'

export class LoginDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'Incorrect password format',
  })
  password: string
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string
}

export class VerifyDto {
  @IsString()
  id: string
}

export class SendRequestResetPasswordDto {
  @IsEmail()
  email: string
}

export class ResetPasswordDto {
  @IsEmail()
  email: string

  @IsString()
  code: string
}
