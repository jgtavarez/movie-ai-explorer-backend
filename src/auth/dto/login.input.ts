import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { EMAIL_LIMIT } from '../../common/utils/constants/limits.constants';

export class LoginInput {
  @ApiProperty({
    maxLength: EMAIL_LIMIT,
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(EMAIL_LIMIT)
  email: string;

  @ApiProperty({
    format: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
