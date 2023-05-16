import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class SendMessageDto {
  @IsString()
  messageType: string

  @IsString()
  message: string

  @IsNumber()
  encryptType: number
}

export class NewConservationDto {
  @IsString()
  receiverId: string

  @IsString()
  messageType: string

  @IsString()
  message: string

  @IsNumber()
  encryptType: number
}

export class UpdateConservationSettingDto {
  @IsBoolean()
  @IsOptional()
  isMuted?: boolean

  @IsBoolean()
  @IsOptional()
  isRemoved?: boolean

  @IsBoolean()
  @IsOptional()
  isArchived?: boolean
}
