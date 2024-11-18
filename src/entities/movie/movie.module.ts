import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { OpenAiModule } from '../../open-ai/open-ai.module';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [
    TypeOrmModule.forFeature([Movie]),
    ConfigModule,
    HttpModule,
    OpenAiModule,
  ],
  exports: [MovieService],
})
export class MovieModule {}
