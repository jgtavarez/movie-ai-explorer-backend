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
} from '../../../common/utils/constants/limits.constants';

export class CreateUserInput {
  @ApiProperty({
    maxLength: NAME_LIMIT,
  })
  @IsString()
  @MaxLength(NAME_LIMIT)
  name: string;

  @ApiProperty({
    maxLength: EMAIL_LIMIT,
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(EMAIL_LIMIT)
  email: string;

  @ApiProperty({
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @Matches(/[a-zA-Z]/, { message: 'Contain at least one letter' })
  @Matches(/[0-9]/, { message: 'Contain at least one number' })
  @Matches(/[^a-zA-Z0-9]/, {
    message: 'Contain at least one special character',
  })
  password: string;

  @ApiProperty({
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  confirmPassword: string;
}
