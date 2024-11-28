import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './entities/user/user.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './entities/movie/movie.module';
import { FavoriteModule } from './entities/favorite/favorite.module';
import { OpenAiModule } from './open-ai/open-ai.module';
import { CategoryModule } from './entities/category/category.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Rate limit configuration
    ThrottlerModule.forRoot([
      {
        ttl: 60, // 1m
        limit: 60, // 60 requests per minute
      },
    ]),
    // DB configuration
    TypeOrmModule.forRoot({
      ssl: process.env.NODE_ENV === 'prod',
      extra: {
        ssl:
          process.env.NODE_ENV === 'prod'
            ? { rejectUnauthorized: false }
            : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    UserModule,
    MovieModule,
    FavoriteModule,
    OpenAiModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
