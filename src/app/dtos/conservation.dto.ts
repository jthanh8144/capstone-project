import { IsString } from 'class-validator'

export class SendMessageDto {
  @IsString()
  messageType: string

  @IsString()
  message: string
}
