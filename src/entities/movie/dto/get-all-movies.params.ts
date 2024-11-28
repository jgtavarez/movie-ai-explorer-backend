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
  @ApiProperty({
    maxLength: 256,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  search: string;

  @ApiProperty({
    required: false,
    nullable: true,
    enum: MovieType,
  })
  @IsEnum(MovieType)
  @IsOptional()
  type?: MovieType;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  year?: number;
}
