import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { EMAIL_LIMIT } from 'src/common/utils/constants/limits.constants';

export class LoginInput {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(EMAIL_LIMIT)
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
