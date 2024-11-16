import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetAllMoviesParams } from './dto/get-all-movies.params';

@ApiTags('Movie')
@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  findAll(@Query() getAllMoviesParams: GetAllMoviesParams) {
    return this.movieService.findAllApi(getAllMoviesParams);
  }

  @Get(':imdb_id')
  findOne(@Param('imdb_id') imdb_id: string) {
    return this.movieService.findOneApi(imdb_id);
  }
}
