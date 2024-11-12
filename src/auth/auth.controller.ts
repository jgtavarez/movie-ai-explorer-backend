import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserInput } from 'src/entities/user/dto/create-user.input';
import { LoginInput } from './dto/login.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  createUser(@Body() createUserInput: CreateUserInput) {
    return this.authService.create(createUserInput);
  }

  @Post('login')
  @Public()
  loginUser(@Body() loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
