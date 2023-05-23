import { IsString, IsEnum } from 'class-validator'
import { FriendEnum } from '../../shared/constants'

export class CreateFriendRequestDto {
  @IsString()
  receiverId: string
}

export class UpdateFriendRequestDto {
  @IsEnum(FriendEnum)
  status: FriendEnum
}

export class UpdateStatusFriendRequestDto {
  @IsString()
  id: string

  @IsEnum(FriendEnum)
  status: FriendEnum
}
