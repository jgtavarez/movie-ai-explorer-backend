import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetAllFavoritesParams {
  @ApiProperty({
    maxLength: 256,
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @MaxLength(256)
  search?: string;
}
