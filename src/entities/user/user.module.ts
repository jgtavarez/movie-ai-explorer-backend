import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { CategoryModule } from '../category/category.module';
import { OpenAiModule } from 'src/open-ai/open-ai.module';
import { MovieModule } from '../movie/movie.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    CategoryModule,
    OpenAiModule,
    MovieModule,
  ],
  exports: [UserService],
})
export class UserModule {}
