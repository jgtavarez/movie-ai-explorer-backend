import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAiController } from './open-ai.controller';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  imports: [ConfigModule],
  exports: [OpenAiService],
})
export class OpenAiModule {}
