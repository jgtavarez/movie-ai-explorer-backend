import { IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserInput extends PartialType(CreateUserInput) {
  @ApiProperty()
  @IsUUID()
  id: string;
}
