import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieInput {
  @IsString()
  @IsNotEmpty()
  imdbId: string;
}
