import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [OpenAiService],
  imports: [ConfigModule],
  exports: [OpenAiService],
})
export class OpenAiModule {}
