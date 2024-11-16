import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ToggleFavoriteInput } from './dto/toggle-favorite.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserType,
} from 'src/auth/decorators/current-user.decorator';
import { Favorite } from './entities/favorite.entity';
import { GetAllFavoritesParams } from './dto/get-all-favorites.params';

@ApiTags('Favorite')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  toggle(
    @Body() toggleFavoriteInput: ToggleFavoriteInput,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<Favorite> {
    return this.favoriteService.toggle(toggleFavoriteInput, currentUser);
  }

  @Get()
  findAll(
    @Query() getAllFavoritesParams: GetAllFavoritesParams,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<Favorite[]> {
    return this.favoriteService.findAll(getAllFavoritesParams, currentUser);
  }

  @Get(':imdb_id')
  findOne(
    @Param('imdb_id') imdb_id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<boolean> {
    return this.favoriteService.isUserFavorite(imdb_id, currentUser);
  }
}
