import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  Matches,
  IsNumber,
} from 'class-validator'
import { passwordRegex } from '../utils'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'Password too weak',
  })
  password: string

  @IsString()
  @IsOptional()
  fullName?: string
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName?: string

  @IsString()
  @IsOptional()
  avatarUrl?: string
}

export class CheckEmailDto {
  @IsEmail()
  email: string
}

export class SearchDto {
  @IsString()
  q: string

  @IsString()
  @IsOptional()
  page: string
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'Password too weak',
  })
  oldPassword: string

  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'Password too weak',
  })
  newPassword: string
}

export class RemoveUserDto {
  @IsString()
  @MinLength(6)
  @Matches(passwordRegex, {
    message: 'Password too weak',
  })
  password: string
}

export class SignalDto {
  @IsNumber()
  registrationId: number

  @IsString()
  ikPublicKey: string

  @IsNumber()
  spkKeyId: number

  @IsString()
  spkPublicKey: string

  @IsString()
  spkSignature: string

  @IsNumber()
  pkKeyId: number

  @IsString()
  pkPublicKey: string
}

export class GetConservationWithUser {
  @IsString()
  partnerId: string
}
