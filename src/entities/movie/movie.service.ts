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

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(MovieService.name);

  // api

  async findAll(getAllMoviesParams: GetAllMoviesParams): Promise<MoviesResp> {
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

  async findOne(id: string): Promise<MovieResp> {
    try {
      const reqConf: AxiosRequestConfig = {
        params: {
          apikey: this.configService.get('OMDB_API_KEY'),
          i: id,
          plot: 'full',
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

  async create(createMovieInput: CreateMovieInput): Promise<Movie> {
    try {
      // check if movie exists (api)
      const movie = await this.findOne(createMovieInput.imdb_id);
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
}
