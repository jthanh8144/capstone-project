import { IsString } from 'class-validator'

export class PresignedUrlDto {
  @IsString()
  type: string

  @IsString()
  folder: string
}

export type PresignedUrlType = {
  type: string
  folder: string
}
