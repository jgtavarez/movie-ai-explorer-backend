import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { OpenAiModule } from '../../open-ai/open-ai.module';

describe('MovieService Integration', () => {
  let service: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        HttpModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [Movie],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Movie]),
        OpenAiModule,
      ],
      providers: [MovieService],
    }).compile();

    service = module.get<MovieService>(MovieService);
  });

  describe('OMDB API', () => {
    describe('findOneApi', () => {
      it('should fetch movie by IMDB ID', async () => {
        const result = await service.findOneApi({
          imdbId: 'tt0111161', // The Shawshank Redemption
        });

        expect(result).toBeDefined();
        expect(result.Title).toBe('The Shawshank Redemption');
        expect(result.imdbID).toBe('tt0111161');
      });
    });

    describe('findAllApi', () => {
      it('should search movies by title', async () => {
        const result = await service.findAllApi({
          search: 'Inception',
          page: 1,
        });

        expect(result.Search).toBeDefined();
        expect(result.Search.length).toBeGreaterThan(0);
        expect(result.totalResults).toBeDefined();
      });

      it('should filter by year', async () => {
        const result = await service.findAllApi({
          search: 'Batman',
          year: 2008,
          page: 1,
        });

        const allMoviesContainYear = result.Search.every((movie) =>
          movie.Year.match(/2008/),
        );

        expect(allMoviesContainYear).toBeTruthy();
      });
    });
  });

  describe('AI Features', () => {
    it('should get movie recommendations', async () => {
      const recommendations = await service.findAllRecommendations('tt0111161');

      expect(recommendations).toBeDefined();
      expect(Array.isArray(recommendations)).toBeTruthy();
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('should get AI review', async () => {
      const review = await service.findAiReview('tt0111161');

      expect(review).toBeDefined();
      expect(review.title).toBeDefined();
      expect(review.description).toBeDefined();
      expect(review.score).toBeDefined();
    });
  });
});
