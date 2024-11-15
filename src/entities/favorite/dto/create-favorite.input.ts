import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFavoriteInput {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imdb_id: string;
}
