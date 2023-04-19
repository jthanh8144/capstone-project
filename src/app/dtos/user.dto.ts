import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  Matches,
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

export class IdDto {
  @IsString()
  id: string
}

export class SearchDto {
  @IsString()
  q: string
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
