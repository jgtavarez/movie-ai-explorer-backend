import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class UpdateUserInput {
  @ApiProperty({
    type: [String],
    format: 'uuid',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  categories: string[];
}
