import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { PaginationParams } from 'src/common/dto/pagination.params';

export enum MovieType {
  Movie = 'movie',
  Series = 'series',
  Episode = 'episode',
}

export class GetAllMoviesParams extends PaginationParams {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(256)
  search: string;

  @ApiProperty()
  @IsEnum(MovieType)
  @IsOptional()
  type?: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  year?: number;
}
