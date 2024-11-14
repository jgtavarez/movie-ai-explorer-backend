import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [ConfigModule, HttpModule],
})
export class MovieModule {}
