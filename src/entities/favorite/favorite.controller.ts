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
import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Favorite } from './entities/favorite.entity';
import { GetAllFavoritesParams } from './dto/get-all-favorites.params';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  CurrentUserType,
} from '../../auth/decorators/current-user.decorator';

@ApiTags('Favorite')
@Controller('favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @ApiOperation({
    summary: 'Toggle user favorite',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully',
    type: Favorite,
  })
  toggle(
    @Body() toggleFavoriteInput: ToggleFavoriteInput,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<Favorite> {
    return this.favoriteService.toggle(toggleFavoriteInput, currentUser.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all user favorites',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: [Favorite],
  })
  findAll(
    @Query() getAllFavoritesParams: GetAllFavoritesParams,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<Favorite[]> {
    return this.favoriteService.findAll(getAllFavoritesParams, currentUser.id);
  }

  @Get(':imdbId')
  @ApiOperation({
    summary: 'Check if movie is user favorite',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: Boolean,
  })
  findOne(
    @Param('imdbId') imdbId: string,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<boolean> {
    return this.favoriteService.isUserFavorite(imdbId, currentUser.id);
  }
}
