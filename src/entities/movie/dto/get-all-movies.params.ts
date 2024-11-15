import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationParams } from 'src/common/dto/pagination.params';
import { MovieType } from './omdb-api.interfaces';

export class GetAllMoviesParams extends PaginationParams {
  @ApiProperty()
  @IsString()
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
