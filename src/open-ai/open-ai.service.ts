import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import {
  CHATBOT_TEMPLATE,
  RECOMMENDATION_TEMPLATE,
  REVIEW_TEMPLATE,
  USER_RECOMMENDATION_TEMPLATE,
} from './prompts';
import { ConfigService } from '@nestjs/config';

const MODEL = process.env.NODE_ENV === 'prod' ? 'gpt-4' : 'gpt-3.5-turbo';

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

  async chatBot(prompt: string) {
    try {
      const completion = await this.openai.chat.completions.create({
        stream: true,
        messages: [
          {
            role: 'system',
            content: CHATBOT_TEMPLATE,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        model: MODEL,
        temperature: 0.4,
        max_tokens: 220,
      });

      return completion;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getReview(
    prompt: string,
  ): Promise<{ title: string; description: string; score: string }> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: REVIEW_TEMPLATE,
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
}
