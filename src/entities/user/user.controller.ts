import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  CurrentUser,
  CurrentUserType,
} from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { MovieResp } from '../movie/dto/omdb-api.interfaces';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findOne(@CurrentUser() currentUser: CurrentUserType): Promise<User> {
    return this.userService.findOne(currentUser.id);
  }

  @Patch()
  update(
    @Body() updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: CurrentUserType,
  ) {
    return this.userService.update(updateUserInput, currentUser.id);
  }

  // AI

  @Get('/recommendations')
  findAllUserRecommendations(
    @CurrentUser() currentUser: CurrentUserType,
  ): Promise<MovieResp[]> {
    return this.userService.findAllRecommendations(currentUser.id);
  }
}
