import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EMAIL_LIMIT,
  NAME_LIMIT,
} from 'src/common/utils/constants/limits.constants';

export class CreateUserInput {
  @ApiProperty()
  @IsString()
  @MaxLength(NAME_LIMIT)
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(EMAIL_LIMIT)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
