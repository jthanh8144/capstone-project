import { IsOptional, IsString } from 'class-validator'

export class IdDto {
  @IsString()
  id: string
}

export class PageDto {
  @IsString()
  @IsOptional()
  page?: string
}
