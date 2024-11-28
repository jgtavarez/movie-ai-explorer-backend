import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OpenAiService } from './open-ai.service';
import { ChatBotParams } from './dto/chat-bot.params';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@ApiTags('AI')
@Controller('ai')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('/chatbot')
  @ApiOperation({
    summary: 'Get chatbot response',
  })
  async chatBot(@Body() chatBotParams: ChatBotParams, @Res() res: Response) {
    const chunks = await this.openAiService.chatBot(chatBotParams.prompt);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of chunks) {
      const contentChunk = chunk.choices[0].delta.content || '';
      res.write(contentChunk);
    }

    res.end();
  }
}
