import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetAllMoviesParams } from './dto/get-all-movies.params';
import { MovieResp } from './dto/omdb-api.interfaces';

@ApiTags('Movie')
@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  findAll(@Query() getAllMoviesParams: GetAllMoviesParams) {
    return this.movieService.findAllApi(getAllMoviesParams);
  }

  @Get(':imdbId')
  findOne(@Param('imdbId') imdbId: string) {
    return this.movieService.findOneApi({
      imdbId,
    });
  }

  @Get('/recommendations/:imdbId')
  findAllRecommendations(
    @Param('imdbId') imdbId: string,
  ): Promise<MovieResp[]> {
    return this.movieService.findAllRecommendations(imdbId);
  }
}
