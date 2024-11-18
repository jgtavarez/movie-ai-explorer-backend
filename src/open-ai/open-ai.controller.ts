import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OpenAiService } from './open-ai.service';
import { ChatBotParams } from './dto/chat-bot.params';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('/chatbot')
  chatBot(@Body() chatBotParams: ChatBotParams) {
    return this.openAiService.chatBot(chatBotParams.prompt);
  }
}
