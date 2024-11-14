import { Injectable, Logger } from '@nestjs/common';
import { GetAllMoviesParams } from './dto/get-all-movies.params';
import { AxiosRequestConfig } from 'axios';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiError, MovieResp, MoviesResp } from './dto/api';

@Injectable()
export class MovieService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(MovieService.name);

  async findAll(
    getAllMoviesParams: GetAllMoviesParams,
  ): Promise<MoviesResp | ApiError> {
    try {
      const { search, type, year } = getAllMoviesParams;
      const reqConf: AxiosRequestConfig = {
        params: {
          apikey: this.configService.get('OMDB_API_KEY'),
          s: search,
          ...(type && {
            type,
          }),
          ...(year && {
            y: year,
          }),
        },
      };

      const resp = await lastValueFrom(
        this.httpService.get<MoviesResp>(
          this.configService.get('OMDB_API_URL'),
          reqConf,
        ),
      );
      return resp.data;
    } catch (error) {
      this.logger.error(error);
      return {
        Response: 'False',
        Error: error.message,
      };
    }
  }

  async findOne(id: string): Promise<MovieResp | ApiError> {
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
      return resp.data;
    } catch (error) {
      this.logger.error(error);
      return {
        Response: 'False',
        Error: error.message,
      };
    }
  }
}
