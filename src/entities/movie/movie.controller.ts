import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetAllMoviesParams } from './dto/get-all-movies.params';
import { MovieResp, MoviesResp } from './dto/omdb-api.interfaces';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Movies')
@Controller('movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all movies',
  })
  findAll(
    @Query() getAllMoviesParams: GetAllMoviesParams,
  ): Promise<MoviesResp> {
    return this.movieService.findAllApi(getAllMoviesParams);
  }

  @Get(':imdbId')
  @ApiOperation({
    summary: 'Get one movie',
  })
  findOne(@Param('imdbId') imdbId: string) {
    return this.movieService.findOneApi({
      imdbId,
    });
  }

  // AI

  @Get('/recommendations/:imdbId')
  @ApiOperation({
    summary: 'Get movie recommendations',
  })
  findAllRecommendations(
    @Param('imdbId') imdbId: string,
  ): Promise<MovieResp[]> {
    return this.movieService.findAllRecommendations(imdbId);
  }

  @Get('/review/:imdbId')
  @ApiOperation({
    summary: 'Get movie review',
  })
  findAiReview(@Param('imdbId') imdbId: string) {
    return this.movieService.findAiReview(imdbId);
  }
}
