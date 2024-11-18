import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import {
  RECOMMENDATION_TEMPLATE,
  USER_RECOMMENDATION_TEMPLATE,
} from './promts';
import { ConfigService } from '@nestjs/config';

const MODEL = 'gpt-4';

@Injectable()
export class OpenAiService {
  constructor(private readonly configService: ConfigService) {}

  private openai = new OpenAI({
    apiKey: this.configService.get('OPENAI_API_KEY'),
  });

  private logger: Logger = new Logger(OpenAiService.name);

  async getRecommendations(prompt: string): Promise<{ movies: string[] }> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: RECOMMENDATION_TEMPLATE,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: MODEL,
        temperature: 0.5,
        max_tokens: 150,
      });

      const jsonResp = JSON.parse(completion.choices[0].message.content);

      return jsonResp;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUserRecommendations(prompt: string): Promise<{ movies: string[] }> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: USER_RECOMMENDATION_TEMPLATE,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: MODEL,
        temperature: 0.6,
        max_tokens: 120,
      });

      const jsonResp = JSON.parse(completion.choices[0].message.content);

      return jsonResp;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
