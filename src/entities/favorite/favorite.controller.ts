import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteInput } from './dto/create-favorite.input';
// import { UpdateFavoriteDto } from './dto/update-favorite.dto';
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
  create(
    @Body() createFavoriteInput: CreateFavoriteInput,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<Favorite> {
    return this.favoriteService.create(createFavoriteInput, currentUser);
  }

  @Get()
  findAll(
    @Query() getAllFavoritesParams: GetAllFavoritesParams,
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<Favorite[]> {
    return this.favoriteService.findAll(getAllFavoritesParams, currentUser);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateFavoriteDto: UpdateFavoriteDto,
  // ) {
  //   return this.favoriteService.update(+id, updateFavoriteDto);
  // }

  @Delete(':id')
  remove(
    @CurrentUser() currentUser: CurrentUserType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.favoriteService.remove(id, currentUser);
  }
}
