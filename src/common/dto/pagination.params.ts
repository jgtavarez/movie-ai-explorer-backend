import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationParams {
  @ApiProperty({
    minimum: 1,
    maximum: 100,
    default: 1,
    required: false,
    nullable: true,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  page: number = 1;
}
