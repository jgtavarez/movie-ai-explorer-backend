import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CreateUserInput } from '../entities/user/dto/create-user.input';
import { AuthResponse } from './dto/auth-response.type';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({
    status: 201,
    description: 'Successfully',
    type: AuthResponse,
  })
  createUser(@Body() createUserInput: CreateUserInput): Promise<AuthResponse> {
    return this.authService.create(createUserInput);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 201,
    description: 'Successfully',
    type: AuthResponse,
  })
  loginUser(@Body() loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }
}
