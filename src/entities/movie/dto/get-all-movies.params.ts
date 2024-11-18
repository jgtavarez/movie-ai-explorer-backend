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
import { MovieType } from './omdb-api.interfaces';
import { PaginationParams } from '../../../common/dto/pagination.params';

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
