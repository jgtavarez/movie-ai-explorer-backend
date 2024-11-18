import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OpenAiService } from './open-ai.service';
import { ChatBotParams } from './dto/chat-bot.params';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
