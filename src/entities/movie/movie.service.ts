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
import { MovieResp, MoviesResp } from './dto/api';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(MovieService.name);

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
}
