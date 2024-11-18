import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetAllMoviesParams } from './dto/get-all-movies.params';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { MovieResp, MoviesResp } from './dto/omdb-api.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { CreateMovieInput } from './dto/create-movie.input';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { generateMovieDetailsFormat } from 'src/open-ai/promts';

interface GetOneMovieParams {
  imdbId: string;
  plot?: 'short' | 'full';
  title?: string;
}

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly openAiService: OpenAiService,
  ) {}

  private readonly logger = new Logger(MovieService.name);

  // api

  async findAllApi(
    getAllMoviesParams: GetAllMoviesParams,
  ): Promise<MoviesResp> {
    try {
      const { search, type, year: y, page } = getAllMoviesParams;
      const reqConf: AxiosRequestConfig = {
        params: {
          apikey: this.configService.get('OMDB_API_KEY'),
          s: search,
          ...(type && {
            type,
          }),
          ...(y && {
            y,
          }),
          ...(page && {
            page,
          }),
        },
      };

      const resp = await lastValueFrom(
        this.httpService.get<MoviesResp>(
          this.configService.get('OMDB_API_URL'),
          reqConf,
        ),
      );

      if (resp.data.Response === 'False') {
        throw new InternalServerErrorException(resp.data.Error);
      }

      return resp.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findOneApi(getOneMovieParams: GetOneMovieParams): Promise<MovieResp> {
    const { imdbId, plot = 'full', title } = getOneMovieParams;
    try {
      const reqConf: AxiosRequestConfig = {
        params: {
          apikey: this.configService.get('OMDB_API_KEY'),
          plot,
          ...(title ? { t: title } : { i: imdbId }),
        },
      };

      const resp = await lastValueFrom(
        this.httpService.get<MovieResp>(
          this.configService.get('OMDB_API_URL'),
          reqConf,
        ),
      );

      if (resp.data.Response === 'False') {
        throw new NotFoundException();
      }

      return resp.data;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // db

  async upsert(createMovieInput: CreateMovieInput): Promise<Movie> {
    try {
      // check if movie exists (api)
      const movie = await this.findOneApi({ imdbId: createMovieInput.imdb_id });
      if (!movie) {
        throw new NotFoundException();
      }

      // upsert movie (db)
      await this.movieRepository.upsert(
        {
          ...createMovieInput,
          title: movie.Title,
          poster: movie.Poster,
        },
        ['imdb_id'],
      );

      return await this.movieRepository.findOneBy({
        imdb_id: createMovieInput.imdb_id,
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  // ai

  async checkMovieHallucination(movies: string[]): Promise<MovieResp[]> {
    // check if the movies are not hallucinated and exist
    try {
      const results = await Promise.allSettled(
        movies.map((movie) => this.findOneApi({ imdbId: '', title: movie })),
      );

      // return only successful requests
      const validMovies = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

      return validMovies;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findAllRecommendations(imdbId: string): Promise<MovieResp[]> {
    try {
      // short plot to reduce ai promt tokens
      const movie = await this.findOneApi({ imdbId, plot: 'short' });
      const { movies } = await this.openAiService.getRecommendations(
        generateMovieDetailsFormat(movie),
      );

      return this.checkMovieHallucination(movies);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
