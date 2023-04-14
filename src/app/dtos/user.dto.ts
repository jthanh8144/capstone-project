import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  Matches,
  IsBoolean,
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
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean

  @IsOptional()
  isActive?: boolean
}

export class CheckEmailDto {
  @IsEmail()
  email: string
}

export class IdDto {
  @IsString()
  id: string
}

export class SearchDto {
  @IsString()
  q: string
}
