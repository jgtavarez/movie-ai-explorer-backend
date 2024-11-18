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
import { ApiTags } from '@nestjs/swagger';

import { Favorite } from './entities/favorite.entity';
import { GetAllFavoritesParams } from './dto/get-all-favorites.params';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserType,
} from '../../auth/decorators/current-user.decorator';

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
    return this.favoriteService.toggle(toggleFavoriteInput, currentUser.id);
  }

  @Get()
  findAll(
    @Query() getAllFavoritesParams: GetAllFavoritesParams,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<Favorite[]> {
    return this.favoriteService.findAll(getAllFavoritesParams, currentUser.id);
  }

  @Get(':imdb_id')
  findOne(
    @Param('imdb_id') imdb_id: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<boolean> {
    return this.favoriteService.isUserFavorite(imdb_id, currentUser.id);
  }
}
