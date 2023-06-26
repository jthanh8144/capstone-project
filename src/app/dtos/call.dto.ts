import { IsEnum, IsOptional, IsString } from 'class-validator'
import { CallType } from '../../shared/constants'

export class CreateCallDto {
  @IsString()
  callerName: string

  @IsString()
  receiverId: string

  @IsString()
  meetingId: string
}

export class UpdateCallDto {
  @IsString()
  userId: string

  @IsEnum(CallType)
  type: CallType

  @IsString()
  @IsOptional()
  meetingId?: string

  @IsString()
  @IsOptional()
  callerName?: string
}
