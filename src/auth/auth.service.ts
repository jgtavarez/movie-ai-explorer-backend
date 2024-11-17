import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './dto/auth-response.type';
import { LoginInput } from './dto/login.input';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/entities/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user/entities/user.entity';
import { CreateUserInput } from 'src/entities/user/dto/create-user.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private logger: Logger = new Logger(AuthService.name);

  private getJwtToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    try {
      const user = await this.userService.findOneByEmail(loginInput.email);

      if (!bcrypt.compareSync(loginInput.password, user.password)) {
        throw new UnauthorizedException();
      }
      if (!user.active) {
        throw new ForbiddenException();
      }

      delete user.password;
      return {
        jwt: this.getJwtToken(user.id),
        user: user,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async create(createUserInput: CreateUserInput): Promise<AuthResponse> {
    try {
      const newUser = await this.userService.create(createUserInput);

      delete newUser.password;
      return {
        jwt: this.getJwtToken(newUser.id),
        user: newUser,
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user.active) {
      throw new ForbiddenException();
    }

    return user;
  }
}
