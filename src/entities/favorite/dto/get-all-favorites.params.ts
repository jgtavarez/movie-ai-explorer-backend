import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetAllFavoritesParams {
  @IsString()
  @IsOptional()
  @MaxLength(256)
  search?: string;
}
