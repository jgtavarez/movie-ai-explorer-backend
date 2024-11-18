import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
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
  @Matches(/[a-zA-Z]/, { message: 'Contain at least one letter' })
  @Matches(/[0-9]/, { message: 'Contain at least one number' })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'Contain at least one special character',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  confirmPassword: string;
}
