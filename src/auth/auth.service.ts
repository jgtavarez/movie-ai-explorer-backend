import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './dto/auth-response.type';
import { LoginInput } from './dto/login.input';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../entities/user/user.service';
import { CreateUserInput } from '../entities/user/dto/create-user.input';
import { User } from '../entities/user/entities/user.entity';

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

      return {
        jwt: this.getJwtToken(user.id),
        user: {
          id: user.id,
        },
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
        user: {
          id: newUser.id,
        },
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
