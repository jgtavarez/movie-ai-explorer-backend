import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleFavoriteInput {
  @ApiProperty({
    required: true,
    format: 'imdbId',
  })
  @IsString()
  @IsNotEmpty()
  imdbId: string;
}
