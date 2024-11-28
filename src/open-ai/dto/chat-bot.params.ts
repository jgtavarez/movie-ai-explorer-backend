import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChatBotParams {
  @ApiProperty({
    maxLength: 400,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  prompt: string;
}
