import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ToggleFavoriteInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imdb_id: string;
}
