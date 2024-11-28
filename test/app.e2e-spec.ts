import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateUserInput } from '../src/entities/user/dto/create-user.input';
import { LoginInput } from '../src/auth/dto/login.input';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  const testUser: CreateUserInput = {
    name: 'Test User',
    email: `test${Math.random().toString(36).substring(7)}@example.com`,
    password: 'Test123!@#',
    confirmPassword: 'Test123!@#',
  };

  const loginData: LoginInput = {
    email: testUser.email,
    password: testUser.password,
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same pipes and configurations as in main.ts
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('POST /api/auth/register', () => {
      it('should register a new user', () => {
        return request(app.getHttpServer())
          .post('/api/auth/register')
          .send(testUser)
          .expect(201)
          .expect((res) => {
            expect(res.body.jwt).toBeDefined();
            expect(res.body.user.id).toBeDefined();
          });
      });
    });

    describe('POST /api/auth/login', () => {
      it('should login successfully', async () => {
        const response = await request(app.getHttpServer())
          .post('/api/auth/login')
          .send(loginData)
          .expect(201);

        authToken = response.body.jwt;
        expect(authToken).toBeDefined();
      });
    });
  });

  describe('Movies', () => {
    describe('GET /api/movies', () => {
      it('should require authentication', () => {
        return request(app.getHttpServer()).get('/api/movies').expect(401);
      });

      it('should get movies with search', () => {
        return request(app.getHttpServer())
          .get('/api/movies')
          .query({ search: 'Inception' })
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.Search).toBeDefined();
            expect(Array.isArray(res.body.Search)).toBeTruthy();
          });
      });
    });

    describe('GET /api/movies/:imdbId', () => {
      it('should get movie details', () => {
        return request(app.getHttpServer())
          .get('/api/movies/tt1375666') // Inception
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.Title).toBe('Inception');
            expect(res.body.imdbID).toBe('tt1375666');
          });
      });
    });

    describe('GET /api/movies/recommendations/:imdbId', () => {
      it('should get movie recommendations', () => {
        return request(app.getHttpServer())
          .get('/api/movies/recommendations/tt1375666')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
          });
      });
    });
  });
});
